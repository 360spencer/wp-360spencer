/**
 * Salient "Text With Inline Images" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global Waypoint */
/* global anime */

(function( $ ) {

    "use strict";

    function NectarTextInlineImages(el) {
        this.$el = el;
        this.$markers = this.$el.find('.nectar-text-inline-images__marker');
        this.positionImages();
        this.events();
    }

    NectarTextInlineImages.prototype.positionImages = function() {

        var that = this;
  
        this.$markers.each(function(i) {

            var selector = ( $(this).find('img').length > 0 ) ? 'img' : 'video';
            if( selector == 'video' ) {
                var height = $(this).height();
                $(this).find(selector).css({
                  'width': (height*1.7) + "px"
                });
            }

            var $image = $(this).find(selector);

            if( $image.length > 0 ) {

              var imageRect = $image[0].getBoundingClientRect();
     
              $(this)[0].style.width = imageRect.width  + 'px';

            }
        });

        this.$el.addClass('nectar-text-inline-images--calculated');

    };

    NectarTextInlineImages.prototype.events = function () {
        
      var that = this;

        $(window).on('resize', this.positionImages.bind(this));
        $(window).on('nectar-waypoints-reinit', this.waypoint.bind(this));

        //$(document).ready(function(){
            if( window.Waypoint ) {
                that.waypoint();
            }
            else {
                $(window).on('salient-delayed-js-loaded', that.waypoint.bind(that));
            }
        //});
    };

    NectarTextInlineImages.prototype.waypoint = function () {

        var waypoints = [];
        var that = this;

        if(this.$el.hasClass('nectar-text-inline-images--stagger-animation')) {
            waypoints = new Waypoint({
                element: that.$el[0],
                handler: function () {
    
                    that.$markers.each(function(i){

                        var $that = $(this);
                        setTimeout(function() {
                            $that.addClass('animated-in');
                        }, (i * 150));
                    });

                    waypoints.destroy();
                },
                offset: 'bottom-in-view'
            });
        } 
        
        else {

            this.$markers.each(function(i) {
                var $that = $(this);
                waypoints[i] = new Waypoint({
                    element: $(this)[0],
                    handler: function () {
        
                        $that.addClass('animated-in');
                        waypoints[i].destroy();
                    },
                    offset: 'bottom-in-view'
                });
            });
        }

    };


   // $(document).ready(function(){
        
        var textWithImgEls = [];

        function lazyInitInlineImages($el, index) {
    
            var observer = new IntersectionObserver(function(entries) {
        
                entries.forEach(function(entry){
                var isIntersecting = entry.isIntersecting;
        
                if (isIntersecting) {
                    textWithImgEls[index] = new NectarTextInlineImages($el);
                    observer.unobserve(entry.target);
                } 
                });
        
            }, {
                rootMargin: '300px 0px 300px 0px',
                threshold: 0
            });
            
            observer.observe($el[0]);
        }

        function initInlineImages() {
            textWithImgEls = [];

            var usingFrontEndEditor = (typeof window.vc_iframe === 'undefined') ? false : true;

            $('.nectar-text-inline-images').each(function(i){

                if( usingFrontEndEditor == false ) {
                    lazyInitInlineImages($(this), i);
                }
                else {
                    textWithImgEls[i] = new NectarTextInlineImages($(this));
                }
                
            });
        }
        initInlineImages();
        $(window).on('vc_reload', function(){
            setTimeout(initInlineImages,200); 
        });

        
    //});

})( jQuery );