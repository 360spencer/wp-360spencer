/*!
 * Theia Sticky Sidebar v1.7.0
 * https://github.com/WeCodePixels/theia-sticky-sidebar
 *
 * Glues your website's sidebars, making them permanently visible while scrolling.
 *
 * Copyright 2013-2016 WeCodePixels and other contributors
 * Released under the MIT license
 */

(function ($) {

    var NectarStickyState = function() {
      this.scrollTop = $(document).scrollTop();
      this.scrollLeft = 0;
      this.bindEvents()
    };

    NectarStickyState.prototype.bindEvents = function() {

      var that = this;

      $(document).on('scroll', function() {
        that.scrollTop = window.scrollY || $(document).scrollTop();
        that.scrollLeft = 0;
      });

    };

    var nectarStickyState = new NectarStickyState();

    $.fn.theiaStickySidebar = function (options) {
        var defaults = {
            'containerSelector': '',
            'additionalMarginTop': 0,
            'additionalMarginBottom': 0,
            'updateSidebarHeight': true,
            'minWidth': 0,
            'disableOnResponsiveLayouts': true,
            'sidebarBehavior': 'modern',
            'defaultPosition': 'relative',
            'namespace': 'TSS'
        };
        options = $.extend(defaults, options);

        // Validate options
        options.additionalMarginTop = parseInt(options.additionalMarginTop) || 0;
        options.additionalMarginBottom = parseInt(options.additionalMarginBottom) || 0;

        tryInitOrHookIntoEvents(options, this);

        // Try doing init, otherwise hook into window.resize and document.scroll and try again then.
        function tryInitOrHookIntoEvents(options, $that) {
            var success = tryInit(options, $that);

            if (!success) {
                console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');

                $(document).on('scroll.' + options.namespace, function (options, $that) {
                    return function (evt) {
                        var success = tryInit(options, $that);

                        if (success) {
                            $(this).unbind(evt);
                        }
                    };
                }(options, $that));
                $(window).on('resize.' + options.namespace, function (options, $that) {
                    return function (evt) {
                        var success = tryInit(options, $that);

                        if (success) {
                            $(this).unbind(evt);
                        }
                    };
                }(options, $that))
            }
        }

        // Try doing init if proper conditions are met.
        function tryInit(options, $that) {
            if (options.initialized === true) {
                return true;
            }

            if ($('body').width() < options.minWidth) {
                return false;
            }

            init(options, $that);

            return true;
        }

        // Init the sticky sidebar(s).
        function init(options, $that) {
            options.initialized = true;

            $that.each(function () {
                var o = {};

                o.sidebar = $(this);

                // Save options
                o.options = options || {};

                // Get container
                o.container = $(o.options.containerSelector);
                if (o.container.length == 0) {
                    o.container = o.sidebar.parent();
                }

                // Create sticky sidebar
                o.sidebar.parents().css('-webkit-transform', 'none'); // Fix for WebKit bug - https://code.google.com/p/chromium/issues/detail?id=20574
                o.sidebar.css({
                    'position': o.options.defaultPosition,
                    'overflow': 'visible',
                    // The "box-sizing" must be set to "content-box" because we set a fixed height to this element when the sticky sidebar has a fixed position.
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });

                // Get the sticky sidebar element. If none has been found, then create one.
                o.stickySidebar = o.sidebar.find('.theiaStickySidebar');
                if (o.stickySidebar.length == 0) {
                    // Remove <script> tags, otherwise they will be run again when added to the stickySidebar.
                    var javaScriptMIMETypes = /(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;
                    o.sidebar.find('script').filter(function (index, script) {
                        return script.type.length === 0 || script.type.match(javaScriptMIMETypes);
                    }).remove();

                    o.stickySidebar = $('<div>').addClass('n-sticky').addClass('theiaStickySidebar').append(o.sidebar.children());
                    o.sidebar.append(o.stickySidebar);
                }

                // Get existing top and bottom margins and paddings
                o.marginBottom = parseInt(o.sidebar.css('margin-bottom'));
                o.paddingTop = parseInt(o.sidebar.css('padding-top'));
                o.paddingBottom = parseInt(o.sidebar.css('padding-bottom'));

                // Add a temporary padding rule to check for collapsable margins.
                var collapsedTopHeight = o.stickySidebar.offset().top;
                var collapsedBottomHeight = o.stickySidebar.outerHeight();
                o.stickySidebar.css('padding-top', 1);
                o.stickySidebar.css('padding-bottom', 1);
                collapsedTopHeight -= o.stickySidebar.offset().top;
                collapsedBottomHeight = o.stickySidebar.outerHeight() - collapsedBottomHeight - collapsedTopHeight;
                if (collapsedTopHeight == 0) {
                    o.stickySidebar.css('padding-top', 0);
                    o.stickySidebarPaddingTop = 0;
                }
                else {
                    o.stickySidebarPaddingTop = 1;
                }

                if (collapsedBottomHeight == 0) {
                    o.stickySidebar.css('padding-bottom', 0);
                    o.stickySidebarPaddingBottom = 0;
                }
                else {
                    o.stickySidebarPaddingBottom = 1;
                }

                // Nectar addition - cache stuff
                o.stickySidebarVisible = o.stickySidebar.is(":visible");
                o.windowHeight = $(window).height();
                o.windowWidth = window.innerWidth;
                o.cachedOffsetTop = o.sidebar.offset().top;
                o.cachedOuterHeight = o.stickySidebar.outerHeight();
                o.cachedContainerHeight = getClearedHeight(o.container);
                setInterval(function(){
                    if( window.nectarState && window.nectarState.materialOffCanvasOpen ) {
                        return;
                    }
                  o.cachedOffsetTop = o.sidebar.offset().top;
                  o.cachedOuterHeight = o.stickySidebar.outerHeight();
                  o.cachedContainerHeight = getClearedHeight(o.container);
                }, 1000);
                o.prevPosition = '';
                // Nectar addition end

                // We use this to know whether the user is scrolling up or down.
                o.previousScrollTop = null;

                // Scroll top (value) when the sidebar has fixed position.
                o.fixedScrollTop = 0;

                // Set sidebar to default values.
                resetSidebar();

                o.onScroll = function (o) {

                    // Check if in view
                    if (nectarStickyState.scrollTop < o.cachedOffsetTop - o.windowHeight - 200 ||
                        nectarStickyState.scrollTop > o.cachedContainerHeight + o.cachedOffsetTop + o.paddingTop + o.options.additionalMarginTop ||
                        window.nectarState && window.nectarState.materialOffCanvasOpen ||
                        !o.stickySidebarVisible ) {
                        
                        o.stickySidebar[0].style.opacity = '0';
                        o.stickySidebar[0].style.pointerEvents = 'none';

                        return;
                    }   
                    
                    o.stickySidebar[0].style.opacity = '1';
                    o.stickySidebar[0].style.pointerEvents = 'all';
                    
                    // Stop if the sidebar width is larger than the container width (e.g. the theme is responsive and the sidebar is now below the content)
                    if (o.options.disableOnResponsiveLayouts && o.windowWidth < 1000) {
                        
                        resetSidebar();
            
                        return;
                       
                    }

                    var scrollTop = nectarStickyState.scrollTop;
                    var position = 'static';


                    // If the user has scrolled down enough for the sidebar to be clipped at the top, then we can consider changing its position.

                    if (scrollTop >= o.cachedOffsetTop + (o.paddingTop - o.options.additionalMarginTop)) {
                        
              
                        var cachedOuterHeight = o.cachedOuterHeight;

                        // The top and bottom offsets, used in various calculations.
                        var offsetTop = o.paddingTop + options.additionalMarginTop;
                        var offsetBottom = o.paddingBottom + o.marginBottom + options.additionalMarginBottom;

                        // All top and bottom positions are relative to the window, not to the parent elemnts.
                        var containerHeight = o.cachedContainerHeight;

                        var containerTop = o.cachedOffsetTop;
                        var containerBottom = o.cachedOffsetTop + containerHeight;

                        // The top and bottom offsets relative to the window screen top (zero) and bottom (window height).
                        var windowOffsetTop = 0 + options.additionalMarginTop;
                        var windowOffsetBottom;


                        // Nectar addition conditional
                        if( containerHeight > cachedOuterHeight + options.additionalMarginTop ) {


                          var sidebarSmallerThanWindow = (cachedOuterHeight + offsetTop + offsetBottom) < o.windowHeight;
                          if (sidebarSmallerThanWindow) {
                              windowOffsetBottom = windowOffsetTop + cachedOuterHeight;
                          }
                          else {
                              windowOffsetBottom = o.windowHeight - o.marginBottom - o.paddingBottom - options.additionalMarginBottom;
                          }

                          var staticLimitTop = containerTop - scrollTop + o.paddingTop;
                          var staticLimitBottom = containerBottom - scrollTop - o.paddingBottom - o.marginBottom;

                          var top = o.stickySidebar.offset().top - scrollTop;
                          
                          var scrollTopDiff = o.previousScrollTop - scrollTop;

                          // If the sidebar position is fixed, then it won't move up or down by itself. So, we manually adjust the top coordinate.
                          if (o.stickySidebar.css('position') == 'fixed') {
                              if (o.options.sidebarBehavior == 'modern') {
                                  top += scrollTopDiff;
                              }
                          }

                          if (o.options.sidebarBehavior == 'stick-to-top') {
                              top = options.additionalMarginTop;
                          }

                          if (o.options.sidebarBehavior == 'stick-to-bottom') {
                              top = windowOffsetBottom - cachedOuterHeight;
                          }

                          if (scrollTopDiff > 0) { // If the user is scrolling up.
                              top = Math.min(top, windowOffsetTop);
                          }
                          else { // If the user is scrolling down.
                              top = Math.max(top, windowOffsetBottom - cachedOuterHeight);
                          }

                          top = Math.max(top, staticLimitTop);

                          top = Math.min(top, staticLimitBottom - cachedOuterHeight);

                          // If the sidebar is the same height as the container, we won't use fixed positioning.
                          var sidebarSameHeightAsContainer = containerHeight == cachedOuterHeight;
                  
                          if (!sidebarSameHeightAsContainer && top == windowOffsetTop) {
                              position = 'fixed';
                          }
                          else if (!sidebarSameHeightAsContainer && top == windowOffsetBottom - cachedOuterHeight) {
                              position = 'fixed';
                          }
                          else if (scrollTop + top - o.cachedOffsetTop - o.paddingTop <= options.additionalMarginTop ) {
                              // Stuck to the top of the page. No special behavior.
                              position = 'static';
                          }
                          else {
                              // Stuck to the bottom of the page.
                              position = 'absolute';
                          }

                      }// Nectar addition conditional end.



                    }

                    /*
                     * Performance notice: It's OK to set these CSS values at each resize/scroll, even if they don't change.
                     * It's way slower to first check if the values have changed.
                     */
                    if (position == 'fixed' && o.prevPosition != 'fixed') {
                     
                        //var scrollLeft = nectarStickyState.scrollLeft;
                        var scrollLeft = 0;
                        o.stickySidebar.css({
                            'position': 'fixed',
                            'width': getWidthForObject(o.sidebar) + 'px',
                            'transform': 'translateY(' + top + 'px)',
                            'left': (o.sidebar.offset().left + parseInt(o.sidebar.css('padding-left')) - scrollLeft) + 'px',
                            'top': '0px'
                        });
                    }
                    else if (position == 'absolute' && o.prevPosition != 'absolute') {
                       
                        var css = {};

                        if (o.stickySidebar.css('position') != 'absolute') {
                            css.position = 'absolute';
                            css.transform = 'translateY(' + (scrollTop + top - o.sidebar.offset().top - o.stickySidebarPaddingTop - o.stickySidebarPaddingBottom) + 'px)';
                            css.top = '0px';
                        }

                        css.width = getWidthForObject(o.sidebar) + 'px';
                        css.left = '';

                        o.stickySidebar.css(css);
                    }
                    else if (position == 'static' && o.prevPosition != 'static') {
                     
                        resetSidebar();
                    }

                    /*
                    if (position != 'static') {
                        
                        if (o.options.updateSidebarHeight == true) {
                            o.sidebar.css({
                                'min-height': o.stickySidebar.outerHeight() + o.stickySidebar.offset().top - o.sidebar.offset().top + o.paddingBottom
                            });
                        }
                    } */

                    o.prevPosition = position;
                    o.previousScrollTop = scrollTop;
                   
                };

                // Initialize the sidebar's position.
                o.onScroll(o);

                // Recalculate the sidebar's position on every scroll and resize.
                $(document).on('scroll.' + o.options.namespace, function (o) {
                    return function () {
                        o.onScroll(o);
                    };
                }(o));

                // nectar addition end
                $(window).on('load.' + o.options.namespace, function (o) {
                  o.stickySidebarVisible = o.stickySidebar.is(":visible");
                  o.windowHeight = $(window).height();
                  o.windowWidth = window.innerWidth;
                  o.cachedOffsetTop = o.sidebar.offset().top;
                  o.cachedOuterHeight = o.stickySidebar.outerHeight();
                  o.cachedContainerHeight = getClearedHeight(o.container);
                }(o));

         
                $(window).on('nectar-tab-changed', function(){
                  o.cachedOffsetTop = o.sidebar.offset().top;
                  o.cachedOuterHeight = o.stickySidebar.outerHeight();
                  o.cachedContainerHeight = getClearedHeight(o.container);
                  o.onScroll(o);
                });

                $(window).on('resize.' + o.options.namespace, function (o) {
                    return function () {
                      // nectar addition end
                        o.stickySidebarVisible = o.stickySidebar.is(":visible");
                        o.paddingTop = parseInt(o.sidebar.css('padding-top'));
                        o.paddingBottom = parseInt(o.sidebar.css('padding-bottom'));
                        o.windowHeight = $(window).height();
                        o.windowWidth = window.innerWidth;
                        o.cachedOffsetTop = o.sidebar.offset().top;
                        o.cachedOuterHeight = o.stickySidebar.outerHeight();
                        o.cachedContainerHeight = getClearedHeight(o.container);
                        // nectar addition end
                        o.prevPosition = '';
                        o.stickySidebar.css({'position': 'static'});
                        o.onScroll(o);
                    };
                }(o));

                // Recalculate the sidebar's position every time the sidebar changes its size.
                if (typeof ResizeSensor !== 'undefined') {
                    new ResizeSensor(o.stickySidebar[0], function (o) {
                        return function () {
                            o.onScroll(o);
                        };
                    }(o));
                }

                // Reset the sidebar to its default state
                function resetSidebar() {
                    o.fixedScrollTop = 0;
                    o.sidebar.css({
                        'min-height': '1px'
                    });
                    o.stickySidebar.css({
                        'position': 'static',
                        'width': '',
                        'transform': 'none'
                    });
                }

                // Get the height of a div as if its floated children were cleared. Note that this function fails if the floats are more than one level deep.
                function getClearedHeight(e) {
                    var height = e.height();

                    e.children().each(function () {
                        height = Math.max(height, $(this).height());
                    });

                    return height;
                }
            });
        }

        function getWidthForObject(object) {
            var width;
            /* nectar addition - get width with padding */
            width = object.width();
            return width;

            try {
                width = object[0].getBoundingClientRect().width;
            }
            catch (err) {
            }

            if (typeof width === "undefined") {
                width = object.width();
            }

            return width;
        }

        return this;
    }
})(jQuery);
