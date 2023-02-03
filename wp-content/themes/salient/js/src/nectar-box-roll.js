/**
 * Salient "Box Roll" header effect script file.
 *
 * @package Salient
 * @author ThemeNectar
 */

(function( $ ) {
  
  "use strict";
  
  function NectarBoxRoll(nectarDOMInfo,waypoints,midnightInit,pageLoadHash,resizeVideoToCover) {
    
    this.nectarDOMInfo = nectarDOMInfo;
    this.waypoints = waypoints;
    this.midnightInit = midnightInit;
    this.pageLoadHash = pageLoadHash;
    this.resizeVideoToCover = resizeVideoToCover;
    this.bodyBorderWidth = 0;

    this.perspect = 'not-rolled';
    this.animating = 'false';
    this.init();
    this.resizeBind();
    this.scrollBind();
    this.touchEvents();
  }
  
  NectarBoxRoll.prototype.resizeBind = function() {
    $(window).on( 'resize', this.contentHeight.bind(this) );
  };
  
  NectarBoxRoll.prototype.scrollBind = function() {
    
    if ($('.nectar-box-roll').length > 0) {
      $('body').on("mousewheel", this.scrollEvent.bind(this));
    } else {
      $('body').off("mousewheel", this.scrollEvent);
    }
    
  };
  
  NectarBoxRoll.prototype.scrollEvent = function(event, delta) {
    
    if ($('#slide-out-widget-area.open.fullscreen').length > 0 || 
    $('.material-ocm-open').length > 0 || 
    $('#search-outer.material-open').length > 0) {
      return false;
    }
    
    this.boxRoll(event, delta);
    
  };
  
  
  NectarBoxRoll.prototype.touchEvents = function(){
    
    var that = this;
    
    $('body').on('click', '.nectar-box-roll .section-down-arrow, .nectar-box-roll .minimal-arrow', function () {
      that.boxRoll(null, -1);
      $(this).addClass('hovered');
      setTimeout(function () {
        $('.nectar-box-roll .section-down-arrow').removeClass('hovered');
      }, 2000);
      return false;
    });
    
    // Touch 
    if (navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/) && $('.nectar-box-roll').length > 0) {
      
      var that = this;
      
      $('body').swipe({
        tap: function (event, target) {
          
          // Still allow click events for interactive elements.
          if ($(target).parents('.nectar-flip-box').length > 0) {
            $(target).parents('.nectar-flip-box').trigger('click');
          }
          
          if ($(target).is('.nectar-flip-box') || $(target).is('.nectar_hotspot.click') ) {
            $(target).trigger('click');
          }
          
          if ($(target).is('.team-member[data-style="bio_fullscreen"]')) {
            $(target).trigger('click');
          }
          
          if ($(target).is('.nectar-post-grid-filters h4')) {
            $(target).trigger('click');
          }
          
          if ($(target).is('.team-member-overlay') && $(target).parents('.team-member[data-style="bio_fullscreen"]').length > 0) {
            $(target).parents('.team-member[data-style="bio_fullscreen"]').trigger('click');
          }
          
          if ($(target).parents('.nectar_team_member_overlay').length > 0) {
            $(target).parents('.nectar_team_member_overlay').trigger('click');
          }

          if ($(target).is('.ocm-dropdown-arrow')) {
            $(target).trigger('click');
          }

          if ($(target).is('.wp-dark-mode-switcher') || $(target).parents('.wp-dark-mode-switcher').length > 0) {
            $(target).trigger('click');
          }

          if ($(target).is('.box-roll-event-pass-thru') || $(target).parents('.box-roll-event-pass-thru').length > 0 ) {
            $(target).trigger('click');
          }
          
          if ($(target).parents('.ocm-dropdown-arrow').length > 0) {
            $(target).parents('.ocm-dropdown-arrow').trigger('click');
          }
          
        },
        swipeStatus: function (event, phase, direction, distance, duration, fingers) {
          
          if ($('#slide-out-widget-area.open').length > 0) {
            return false;
          }
          
          if (direction == 'up') {
            
            that.boxRoll(null, -1);
            if ($('#ajax-content-wrap.no-scroll').length == 0) {
              $('body').swipe("option", "allowPageScroll", 'vertical');
            }
            
          } else if (direction == "down" && $(window).scrollTop() == 0) {
            
            that.boxRoll(null, 1);
            $('body').swipe("option", "allowPageScroll", 'auto');
            
          }
        }
      });
      
    }
    
  };
  
  
  NectarBoxRoll.prototype.getScrollbarWidth = function() {
    
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar";
    
    document.body.appendChild(outer);
    
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";
    
    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    
    var widthWithScroll = inner.offsetWidth;
    
    // remove divs
    outer.parentNode.removeChild(outer);
    
    return widthNoScroll - widthWithScroll;
  };
  
  NectarBoxRoll.prototype.init = function() {
    
    var that = this;
    
    if ($('.nectar-box-roll').length > 0) {
      
      // Store body border width
      if( $('.body-border-right').length > 0 ) {
        this.bodyBorderWidth = parseInt($('.body-border-right').width());
      }

      $('body').attr('data-scrollbar-width', this.getScrollbarWidth());
      
      $('body, html, #ajax-content-wrap, .container-wrap, .blurred-wrap').addClass('no-scroll');
      
      $(window).trigger('nectar-box-roll-scroll-disabled');
      
      $('body,html').stop().animate({
        scrollTop: 0
      }, 0);
      
      $('.container-wrap')
        .css('opacity', 0)
        .addClass('no-transform-animation-bottom-out')
        .addClass('bottomBoxOut');
      
      if ($('.mobile').length == 0) $('#ajax-loading-screen .loading-icon > span').css({
        'left': '-' + this.getScrollbarWidth() / 2 + 'px'
      });
      
      // Change content pos
      var $overlaid = $('#page-header-bg .overlaid-content').clone();
      var $scrollDownOverlaid = $('.scroll-down-wrap').clone();
      
      $('#page-header-bg').removeAttr('data-midnight');
      $('#page-header-bg .overlaid-content, #page-header-bg .scroll-down-wrap').remove();
      $('.nectar-box-roll').append($overlaid);
      
      if ($('#header-outer.dark-slide').length == 0) {
        $('.nectar-box-roll').attr('data-midnight', 'light');
      } else {
        $('.nectar-box-roll').attr('data-midnight', 'dark');
      }
      
      if( $('.overlaid-content .scroll-down-wrap').length == 0 ) {
        $('.overlaid-content').append($scrollDownOverlaid);
      }
  
      
      if ($('.page-submenu[data-sticky="true"]').length > 0) {
        $('.container-wrap').addClass('no-trans');
      }
      
      // global sections.
      if( $('#ajax-content-wrap > .nectar-global-section.after-nav').length > 0 ) {
        var $afterNavSection = $('#ajax-content-wrap > .nectar-global-section.after-nav').detach();
        $('.container-wrap').prepend($afterNavSection);
      }
      if( $('#ajax-content-wrap > .nectar-global-section.before-footer').length > 0 ) {
        var $beforeFooterSection = $('#ajax-content-wrap > .nectar-global-section.before-footer').detach();
        $('.container-wrap').append($beforeFooterSection);
      }
      
      this.contentHeight();
      
      $('html').addClass('nectar-box-roll-loaded');
      $('body').addClass('nectar-no-flex-height');
      
      setTimeout(function () {
        that.pageLoadHash();
      }, 700);
      
    } else {
      
      $('#ajax-content-wrap, .blurred-wrap').addClass('at-content');
      
      $('body, html, #ajax-content-wrap, .container-wrap, .blurred-wrap').removeClass('no-scroll');
      $(window).trigger('nectar-box-roll-scroll-enabled');
      
      $('.container-wrap')
        .css('opacity', 1)
        .removeClass('no-transform-animation-bottom-out')
        .removeClass('bottomBoxOut')
        .removeClass('bottomBoxIn');
        
      this.perspect = 'not-rolled';
    }
    
  };
  
  
  
  NectarBoxRoll.prototype.contentHeight = function() {
    
    var $headerNavSpace = ($('body[data-header-format="left-header"]').length > 0 && $(window).width() > 1000) ? 0 : $('#header-space').height();
    
    if ($('#header-outer[data-transparent-header="true"]').length == 0) {
      $('.nectar-box-roll .overlaid-content, .nectar-box-roll .canvas-bg, .container-wrap').css({
        'height': window.innerHeight - $headerNavSpace,
        'min-height': window.innerHeight - $headerNavSpace
      });
      if ($('.mobile').length == 0 && $('body[data-header-format="left-header"]').length == 0) {
        $('#ajax-content-wrap').css('margin-top', $headerNavSpace);
        $('#slide-out-widget-area.fullscreen').css('margin-top', '-' + $headerNavSpace + 'px');
      } else {
        $('#ajax-content-wrap, #slide-out-widget-area.fullscreen').css('margin-top', '0');
      }
    } else {
      
      if ($('.mobile').length > 0 && $('body[data-permanent-transparent="1"]').length == 0) {
        $('.nectar-box-roll .overlaid-content, .nectar-box-roll .canvas-bg, .container-wrap').css('height', window.innerHeight - $headerNavSpace);
      } else {
        $('.nectar-box-roll .overlaid-content, .nectar-box-roll .canvas-bg, .container-wrap').css('height', window.innerHeight);
      }
      
    }
    
  };
  
  
  
  NectarBoxRoll.prototype.boxRoll = function(e, d) {
    
    var $headerNavSpace = ($('body[data-header-format="left-header"]').length > 0 && $(window).width() > 1000) ? 0 : $('#header-space').height();
    var that = this;
    
    if ($('#slide-out-widget-area.open').length > 0) {
      return false;
    }
    if ($('.nectar-box-roll canvas').length > 0 && $('.nectar-box-roll canvas[data-loaded="true"]').length == 0) {
      return false;
    }
    
    if (this.perspect == 'not-rolled' && this.animating == 'false' && d == -1) {
      
      this.perspect = 'rolled';
      this.animating = 'true';
      
      $('body')
        .addClass('box-animating')
        .addClass('box-perspective-rolled')
        .addClass('box-rolling')
        .addClass('after-rolled');
      
      $('.nectar-box-roll #page-header-bg')
        .removeClass('topBoxIn')
        .addClass('topBoxOut')
        .css('will-change', 'transform');
      
      $('.nectar-box-roll .overlaid-content')
        .removeClass('topBoxIn2')
        .removeClass('topBoxIn')
        .addClass('topBoxOut2')
        .css('will-change', 'transform');
      
      $('.container-wrap')
        .removeClass('bottomBoxOut')
        .addClass('bottomBoxIn')
        .removeClass('no-transform-animation-bottom-out')
        .addClass('nectar-box-roll-class')
        .css('will-change', 'transform');
      
      
      if ($('#header-outer[data-transparent-header="true"]').length == 0) {
        
        $('.container-wrap').css({
          'height': $(window).height() - $headerNavSpace,
          'opacity': 1
        });
        
        $('#slide-out-widget-area.fullscreen').css('margin-top', '0px');
        
      } else {
        
        $('.container-wrap').css({
          'height': $(window).height(),
          'opacity': 1
        });
        
      }
      
      
      $('.nectar-slider-wrap').css({
        'opacity': 0
      });
      
      //this.updateRowRightPadding(d);
      this.pauseVideoBG();
      
      
      var timeout1 = 1220;
      var timeout2 = 1650;
      var timeout3 = 1700;
      var timeout4 = 1350;
      if ($('html.no-cssanimations').length > 0) {
        timeout1 = 1;
        timeout2 = 1;
        timeout3 = 1;
        timeout4 = 1;
      }
      
      $('.container-wrap').css('padding-right', $('body').attr('data-scrollbar-width') + 'px');
      
      //document.body.setAttribute("style", "--scroll-bar-w: 0px");
      
      setTimeout(function () {
        $('#header-outer, #wpadminbar').animate({
          'padding-right': $('body').attr('data-scrollbar-width')
        }, 250);
        $('.nectar-box-roll .canvas-bg').addClass('out-of-sight');
        if ($('#header-outer[data-permanent-transparent="1"]').length == 0) {
          $('#header-outer').removeClass('transparent');
        }
        
        if ($('body.mobile').length > 0) $('.nectar-box-roll').css({
          'z-index': '1'
        });
        
        // Perma trans coloring
        var $first_row_coloring = ($('.container-wrap > .main-content > .row > .wpb_row').length > 0) ? $('.container-wrap > .main-content > .row > .wpb_row:first-child').attr('data-midnight') : 'dark';
        if ($('#header-outer[data-permanent-transparent="1"]').length > 0) {
          
          if ($first_row_coloring == 'dark') {
            $('#header-outer').addClass('dark-slide');
          } else {
            $('#header-outer').removeClass('dark-slide');
          }
          
        }
        
      }, timeout1);
      
      setTimeout(function () {
        
        //that.updateRowRightPadding(1);
        //document.body.setAttribute("style", "--scroll-bar-w: " + $('body').attr('data-scrollbar-width') + "px");
        $('body,html,#ajax-content-wrap, .container-wrap, .blurred-wrap').removeClass('no-scroll');
        $(window).trigger('nectar-box-roll-scroll-enabled');
        
        $('#ajax-content-wrap, .blurred-wrap').addClass('at-content');
        
        $('.container-wrap, #footer-outer')
          .removeClass('bottomBoxIn')
          .removeClass('nectar-box-roll-class')
          .addClass('auto-height');

        if( $('.body-border-right').length > 0 && that.nectarDOMInfo.winW > 999) {
          that.bodyBorderWidth = parseInt($('.body-border-right').width());
        } else {
          that.bodyBorderWidth = 0;
        }

          
        $('#header-outer, #wpadminbar, .container-wrap').stop().css('padding-right', that.bodyBorderWidth);
        
        $('.nectar-box-roll').css({
          'z-index': '-1000'
        }).transition({
          'y': '-200%'
        }, 0);
        $('.nectar-box-roll canvas').hide();
        $('body').removeClass('box-rolling');
        $('.nectar-slider-wrap').transition({
          'opacity': 1
        }, 600, 'easeOutCubic');
        
        $('.nectar-box-roll #page-header-bg, .nectar-box-roll .overlaid-content, .container-wrap').css('will-change', 'auto');
        
        if ( $('body').hasClass('after-rolled') ) {
          that.waypoints();
          that.midnightInit();
        }
        
        // Mobile secondary
        if( $('#header-secondary-outer[data-mobile="display_full"]').length > 0 && $('body.mobile').length > 0 ) {
          $('#header-outer').css('transform', 'translateY(-' + $('#header-secondary-outer').outerHeight() + 'px)');
        }
        
      }, timeout2);
      
      // FadeIn
      setTimeout(function () {
        $('.container-wrap .main-content > .row > div > div[class*="col"]').css({
          'opacity': 1
        });
      }, timeout4);
      
      setTimeout(function () {
        that.animating = 'false';
        $('body').removeClass('box-animating');
      }, timeout3);
      
      // Header position when transparent nav was used
      if ($('#header-outer[data-permanent-transparent="1"]').length == 0 && 
      $('.mobile').length == 0 && 
      $('#header-outer[data-transparent-header="true"]').length != 0) {
        
        $('#ajax-content-wrap').transition({
          'margin-top': $('#header-outer').outerHeight(true) + $('#header-outer').offset().top
        }, 2000, 'easeInOutQuad');
        
      }
      

      // Remove header if not fixed
      if ($('.mobile #header-outer[data-permanent-transparent="1"]').length > 0 && 
      $('.mobile #header-outer[data-mobile-fixed="false"]').length == 1) {
        $('#header-outer').transition({
          'y': '-100%'
        }, 400, 'easeOutCubic');
      }
      
    } else if (this.perspect == 'rolled' && this.animating == 'false' && d == 1 && $(window).scrollTop() < 100) {
      
      $('.container-wrap').removeClass('auto-height');
      if ($('#header-outer[data-transparent-header="true"]').length == 0) {
        $('.container-wrap').css({
          'height': $(window).height() - $headerNavSpace,
          'opacity': 1
        });
      } else {
        $('.container-wrap').css({
          'height': $(window).height(),
          'opacity': 1
        });
      }
      
      $('#footer-outer').removeClass('auto-height');
      $('body').addClass('box-rolling');
      
      this.perspect = 'not-rolled';
      this.animating = 'true';
      
      $('body')
        .addClass('box-animating')
        .addClass('box-perspective-not-rolled');
      
      //document.body.setAttribute("style", "--scroll-bar-w: 0px");
      $('#header-outer, #wpadminbar, .container-wrap, .original .cart-outer .cart-menu').css('padding-right', (parseInt($('body').attr('data-scrollbar-width')) + this.bodyBorderWidth) + 'px');
      
      $('.nectar-slider-wrap').transition({
        'opacity': 0
      }, 600, 'easeOutCubic');
      $('.container-wrap .main-content > .row > div > div[class*="col"]').stop(true).css({
        'opacity': 0
      });
      
      setTimeout(function () {
        $('#header-outer, #wpadminbar, .original .cart-outer .cart-menu').animate({
          'padding-right': 0 + this.bodyBorderWidth
        }, 250);
        $('.nectar-box-roll .canvas-bg').removeClass('out-of-sight');
        that.resizeVideoToCover();
        // Header position when transparent nav was used
        if ($('#header-outer[data-transparent-header="true"]').length != 0) {
          $('#ajax-content-wrap').stop(true, true).transition({
            'margin-top': 0
          }, 2000, 'easeInOutCubic');
        } else {
          if ($('.mobile').length == 0) {
            $('#slide-out-widget-area.fullscreen').css('margin-top', '-' + $headerNavSpace + 'px');
          }
        }
        

      }, 30);
      
      
      var timeout1 = 1700;
      var timeout2 = 1600;
      var timeout3 = 1300;
      
      if ($('html.no-cssanimations').length > 0) {
        timeout1 = 1;
        timeout2 = 1;
        timeout3 = 1;
      }
      
      if ($('body.mobile').length > 0) {
        setTimeout(function () {
          $('.nectar-box-roll').css('z-index', '1000');
        }, timeout3);
      } else {
        $('.nectar-box-roll').css('z-index', '1000');
      }
      
      //this.updateRowRightPadding(d);
      
      $('.nectar-box-roll').transition({
        'y': '0'
      }, 0);
      
      $('.nectar-box-roll canvas').show();
      
      setTimeout(function () {
        //that.updateRowRightPadding(1);
        that.animating = 'false';
        $('body').removeClass('box-animating');
        $('#page-header-bg').removeClass('topBoxIn');
        $('.overlaid-content').removeClass('topBoxIn2');
        $('body').removeClass('box-rolling');
        that.resumeVideoBG();
        $('.nectar-box-roll #page-header-bg, .nectar-box-roll .overlaid-content, .container-wrap').css('will-change', 'auto');
        
        // Perma trans coloring
        if ($('#header-outer[data-permanent-transparent="1"]').length > 0) {
          
          if ($('.nectar-box-roll[data-midnight="dark"]').length > 0) {
            $('#header-outer').addClass('dark-slide');
          } else {
            $('#header-outer').removeClass('dark-slide');
          }
          
        }
        
        // Mobile secondary
        if( $('#header-secondary-outer[data-mobile="display_full"]').length > 0 && $('body.mobile').length > 0 ) {
          $('#header-outer').css('transform', 'translateY(0px)');
        }
        
      }, timeout1);
      
      setTimeout(function () {
        if ($('.mobile #header-outer[data-permanent-transparent="1"]').length > 0 && 
        $('.mobile #header-outer[data-mobile-fixed="false"]').length == 1) {
          $('#header-outer').transition({
            'y': '0%'
          }, 400, 'easeOutCubic');
        }
        
      }, timeout2);
      
      $('body,html,#ajax-content-wrap, .container-wrap, .blurred-wrap').addClass('no-scroll');
      $(window).trigger('nectar-box-roll-scroll-disabled');
      $('#ajax-content-wrap, .blurred-wrap').removeClass('at-content');
      $('.container-wrap').addClass('nectar-box-roll-class');
      
      $('.nectar-box-roll #page-header-bg')
        .removeClass('topBoxOut')
        .addClass('topBoxIn')
        .css('will-change', 'transform');
      
      $('.container-wrap')
        .removeClass('bottomBoxIn')
        .addClass('bottomBoxOut')
        .css('will-change', 'transform');
      
      if ($('#header-outer[data-transparent-header="true"]').length > 0 && 
      $('#header-outer[data-permanent-transparent="1"]').length == 0) {
        $('#header-outer').addClass('transparent');
      }
      
      $('.nectar-box-roll .overlaid-content')
        .removeClass('topBoxOut2')
        .removeClass('topBoxOut')
        .addClass('topBoxIn2')
        .css('will-change', 'transform');
      
      
      $('.nectar-box-roll .trigger-scroll-down').removeClass('hovered');
    }
    
  };
  
  
  NectarBoxRoll.prototype.updateRowRightPadding = function(d) {
    
    
    $('.wpb_row.full-width-section').each(function () {
      if ($(this).hasClass('extraPadding') && d == 1) {
        $(this).css('padding-right', parseInt($(this).css('padding-right')) - parseInt($('body').attr('data-scrollbar-width')) + 'px').removeClass('extraPadding');
      } else {
        $(this).css('padding-right', parseInt($('body').attr('data-scrollbar-width')) + parseInt($(this).css('padding-right')) + 'px').addClass('extraPadding');
      }
    });
    
    $('.wpb_row.full-width-content').each(function () {
      if ($(this).find('.row-bg.using-image').length == 0) {
        if ($(this).hasClass('extraPadding') && d == 1) {
          $(this).find('.row-bg').css('width', parseInt($(this).width()) - parseInt($('body').attr('data-scrollbar-width')) + 'px').removeClass('extraPadding');
        } else {
          $(this).find('.row-bg').css('width', parseInt($('body').attr('data-scrollbar-width')) + $(this).width() + 'px').addClass('extraPadding');
        }
      }
    });
    
  };
  
  NectarBoxRoll.prototype.pauseVideoBG = function() {
    if ($('.nectar-box-roll video').length > 0 && !this.nectarDOMInfo.usingMobileBrowser) {
      $('.nectar-box-roll video')[0].pause();
    }
  };
  
  NectarBoxRoll.prototype.resumeVideoBG = function() {
    if ($('.nectar-box-roll video').length > 0 && !this.nectarDOMInfo.usingMobileBrowser) {
      $('.nectar-box-roll video')[0].play();
    }
  };
  
  window.NectarBoxRoll = NectarBoxRoll;


  function NectarBoxRollHelper() {
    this.setInitialSize = function() {

       // Change content pos
       var $overlaid = $('#page-header-bg .overlaid-content').clone();
       var $scrollDownOverlaid = $('.scroll-down-wrap').clone();
       
       $('#page-header-bg .overlaid-content, #page-header-bg .scroll-down-wrap').remove();

       if( $overlaid ) {
         $('.nectar-box-roll').append($overlaid);
       }
       
       if( $scrollDownOverlaid ) {
         $('.overlaid-content').append($scrollDownOverlaid);
       }


      var $headerNavSpace = ($('body[data-header-format="left-header"]').length > 0 && $(window).width() > 1000) ? 0 : $('#header-space').height();
    
      if ($('#header-outer[data-transparent-header="true"]').length == 0) {
        $('.nectar-box-roll .overlaid-content, .nectar-box-roll .canvas-bg, .container-wrap').css({
          'height': window.innerHeight - $headerNavSpace,
          'min-height': window.innerHeight - $headerNavSpace
        });
        if ($('.mobile').length == 0 && $('body[data-header-format="left-header"]').length == 0) {
          $('#ajax-content-wrap').css('margin-top', $headerNavSpace);
          $('#slide-out-widget-area.fullscreen').css('margin-top', '-' + $headerNavSpace + 'px');
        } else {
          $('#ajax-content-wrap, #slide-out-widget-area.fullscreen').css('margin-top', '0');
        }
      } else {
        
        if ($('.mobile').length > 0 && $('body[data-permanent-transparent="1"]').length == 0) {
          $('.nectar-box-roll .overlaid-content, .nectar-box-roll .canvas-bg, .container-wrap').css('height', window.innerHeight - $headerNavSpace);
        } else {
          $('.nectar-box-roll .overlaid-content, .nectar-box-roll .canvas-bg, .container-wrap').css('height', window.innerHeight);
        }
        
      }
    };
  }
  window.NectarBoxRollHelper = NectarBoxRollHelper;
  
}( jQuery ));