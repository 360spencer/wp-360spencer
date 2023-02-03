/**
 * Salient "Sticky Media Sections" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global Waypoint */
/* global anime */

(function ($) {

  "use strict";

  function NectarStickyMedia(el) {

    this.$el = el;
    this.$mediaSections = this.$el.find('.nectar-sticky-media-section__featured-media');
    this.$contentSections = this.$el.find('.nectar-sticky-media-section__content');

    this.usingFrontEndEditor = (window.nectarDOMInfo && window.nectarDOMInfo.usingFrontEndEditor) ? true : false;
    this.direction = 'down';
    this.prevScroll = 0;
    this.activeIndex = 0;
    this.prevIndex = -1;
    this.timeout = '';

    this.events();

  }

  var proto = NectarStickyMedia.prototype;

  proto.events = function () {

    if (this.usingFrontEndEditor) {
      this.rebuildMedia();
    }

    this.observe();

    if (!(window.nectarDOMInfo && window.nectarDOMInfo.usingMobileBrowser && window.nectarDOMInfo.winW < 1000)) {
      this.trackDirection();
      this.verticallyCenter();
      $(window).on('resize', this.verticallyCenter.bind(this));
    }

  };

  proto.verticallyCenter = function() {

    if( !window.nectarDOMInfo ) {
      return;
    }

    var navHeight = 0;

    if( $('body').is('[data-header-format="left-header"]') ||
        $('body').is('[data-hhun="1"]') ||
        $('#header-outer').length > 0 && $('#header-outer').is('[data-permanent-transparent="1"]') ||
        $('.page-template-template-no-header-footer').length > 0 ||
        $('.page-template-template-no-header').length > 0) {

      navHeight = 0;

    } else {
       navHeight = ( $('#header-space').length > 0 ) ? $('#header-space').height() : 0;
    }

    if( window.nectarDOMInfo.adminBarHeight > 0 ) {
      navHeight += window.nectarDOMInfo.adminBarHeight;
    }


    var vertCenter = (window.nectarDOMInfo.winH - this.$mediaSections.height())/2 + navHeight/2;
    this.$el[0].style.setProperty('--nectar-sticky-media-sections-vert-y', vertCenter + "px");
  };

  proto.isSafari = function() {
    if (navigator.userAgent.indexOf('Safari') != -1 && 
      navigator.userAgent.indexOf('Chrome') == -1) {
        return true;
    } 

    return false;
  };


  proto.trackDirection = function() {

    if( window.nectarDOMInfo.scrollTop == this.prevScroll ) {
      window.requestAnimationFrame(this.trackDirection.bind(this));
      return;
    }

    if (window.nectarDOMInfo.scrollTop > this.prevScroll) {
      this.direction = 'down';
    } else {
      this.direction = 'up';
    }
    
    this.prevScroll = window.nectarDOMInfo.scrollTop;

    window.requestAnimationFrame(this.trackDirection.bind(this));
  };


  proto.observe = function() {

    var that = this;

    this.sections = Array.from(this.$contentSections.find('> div'));
    
    if ('IntersectionObserver' in window) {

      if (!(window.nectarDOMInfo.usingMobileBrowser && window.nectarDOMInfo.winW < 1000)) {
        
        this.observer = new IntersectionObserver(function (entries) {

          entries.forEach(function (entry) {

            if (entry.isIntersecting ) {

                var index = $(entry.target).index();
                that.activeIndex = index;

                var $activeSection = that.$mediaSections.find('> .nectar-sticky-media-section__media-wrap:eq(' + index + ')');
                var $activeMobileSection = that.$contentSections.find('> .nectar-sticky-media-section__content-section:eq(' + index + ')');
                var $allSections = that.$mediaSections.find('> .nectar-sticky-media-section__media-wrap');

          

                if( that.activeIndex == that.prevIndex ) {
                  return;
                }

                clearTimeout(that.timeout);
                that.timeout = setTimeout(function(){
                  $allSections.removeClass('active');
                  $activeSection.addClass('active');
                }, 100);

                
                if( !$activeSection.hasClass('pause-trigger') || 
                    that.prevIndex == 1 && that.activeIndex == 0 ||
                    that.prevIndex == $allSections.length - 2 && that.activeIndex == $allSections.length - 1) {

                  if( $activeSection.find('video').length > 0 && window.nectarDOMInfo.winW > 999 ) {
                    that.playSectionVideo($activeSection.find('video')[0]);
                  }
                  if( $activeMobileSection.find('video').length > 0 && window.nectarDOMInfo.winW < 1000 ) {
                    var vid = $activeMobileSection.find('video')[0];
                    if( vid.currentTime == 0 ) {
                      that.playSectionVideo($activeMobileSection.find('video')[0]);
                    }
                    
                  }
                }
              
                // Add flag to skip retriggering of videos on first/last items when scrolled past.
                if(index == 0 || index == that.$contentSections.find('> div').length - 1) {
                  $activeSection.addClass('pause-trigger');
                } else {
                  $allSections.removeClass('pause-trigger');
                }

                that.prevIndex = index;

            }

          });

        }, {
          root: (this.isSafari()) ? null : document,
          rootMargin: '-40% 0% -40% 0%',
          threshold: 0
        });


        // Observe each section.
        this.$contentSections.find('> div').each(function () {
          that.observer.observe($(this)[0]);
        });


      } // don't trigger on mobile.

      else {
        // Mobile.
        this.mobileObserver = new IntersectionObserver(function (entries) {

          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
           
              
              var index = $(entry.target).index();
              var $activeSection = that.$contentSections.find('> .nectar-sticky-media-section__content-section:eq(' + index + ')');

              if( $activeSection.find('video').length > 0 ) {

                var vid = $activeSection.find('video')[0];
                if( vid.currentTime == 0) {
                  that.playSectionVideo($activeSection.find('video')[0]);
                }
              }
              that.mobileObserver.unobserve(entry.target);
            }

          });

        },{
          rootMargin: '-5% 0% -5% 0%',
          threshold: 0
        });

        // Observe each section.
        this.$contentSections.find('> div').each(function () {
          that.mobileObserver.observe($(this)[0]);
        });

      }

    } // if intersection observer. 
  };


  proto.playSectionVideo = function(video) {
    var that = this;
    if( video.readyState >= 2 ) {
      video.pause();
      video.currentTime = 0;
      video.play();
    } else {
      setTimeout(function(){
        that.playSectionVideo(video);
      }, 70);
    }
    
  };



  proto.shouldUpdate = function (entry) {

    if (this.direction === 'down' && !entry.isIntersecting || 
        this.direction === 'down' && entry.isIntersecting && $(entry.target).index() == 0) {
      return true;
    }

    if (this.direction === 'up' && entry.isIntersecting) {
      return true;
    }

    return false;
  }


  proto.rebuildMedia = function () {

    var that = this;
    var mediaSections = [];

    this.$contentSections.find('.nectar-sticky-media-section__content-section').each(function (i) {
      // WPBakery duplicates media so we need to reduce it back to the current latest chosen item.
      if ($(this).find('.nectar-sticky-media-content__media-wrap').length > 1) {
        $(this).find('.nectar-sticky-media-content__media-wrap').each(function (i) {
          if (i > 0) {
            $(this).remove();
          }
        });
      }
      mediaSections[i] = $(this).find('.nectar-sticky-media-content__media-wrap').clone();
      mediaSections[i].removeClass('nectar-sticky-media-content__media-wrap').addClass('nectar-sticky-media-section__media-wrap');
    });

    that.$mediaSections.html(' ');

    mediaSections.forEach(function (el) {
      that.$mediaSections.append(el);
    });

    $(window).trigger('salient-lazyloading-image-reinit');

  };


  var mediaSections = [];
  function nectarStickyMediaInit() {

    mediaSections = [];

    $('.nectar-sticky-media-sections').each(function (i) {
      mediaSections[i] = new NectarStickyMedia($(this));
    });
  }

  $(document).ready(function () {

    nectarStickyMediaInit();

    $(window).on('vc_reload', function () {
      setTimeout(nectarStickyMediaInit, 200);
    });

  });


})(jQuery);