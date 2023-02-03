/* global vc, _, jQuery */
/**
 * Salient Yoast SEO Portfolio Analysis
 *
 * @author ThemeNectar
 */
 
 (function( $ ) {
  
    "use strict";
    
    function SalientPortfolioRankMath() {

        this.relevantData = {};

        this.getContent();
        this.events();

        wp.hooks.addFilter( 'rank_math_content', 'rank-math', this.addContent.bind(this) );
     
    }  

    SalientPortfolioRankMath.prototype.getContent = function() {
    
        var that = this;
    
        if( vc && vc.shortcodes.models ) {
          
          $.each(vc.shortcodes.models, function(i, el) {
            
            
            // Text.
            if( el.attributes.shortcode === 'vc_column_text' || 
                el.attributes.shortcode === 'nectar_highlighted_text' ||
                el.attributes.shortcode === 'fancy_box' ||
                el.attributes.shortcode === 'nectar_flip_box' ) {

                that.relevantData[el.attributes.id] = {
                  text: el.attributes.params.content
                }
            }
       
          });
        }
        
      }

      SalientPortfolioRankMath.prototype.getImageEventString = function( e ) {
		return ' shortcodes:' + e + ':param:type:attach_image' + ' shortcodes:' + e + ':param:type:attach_images' + ' shortcodes:' + e + ':param:type:fws_image';
	  }

      SalientPortfolioRankMath.prototype.events = function() {

        var that = this;

        // Update stored content string on WPBakery interactions.
        if( vc && vc.events ) {

            //// Text.
            vc.events.on( 'shortcodes:vc_column_text shortcodes:nectar_highlighted_text shortcodes:fancy_box shortcodes:nectar_flip_box', function ( model, event ) {
              
              var params = model.get( 'params' );
              params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );
          
              if ( 'destroy' === event ) {
                      delete that.relevantData[ model.get( 'id' ) ];
                  } 
              else {
                  that.relevantData[model.get( 'id' )] = {
                    text: model.get( 'params' ).content
                }
              
              }
              
            });

            // Button.
            vc.events.on( 'shortcodes:nectar_btn', function ( model, event ) {

                var params = model.get( 'params' );
                params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );

                if ( 'destroy' === event ) {
                    delete that.relevantData[ model.get( 'id' ) ];
                } 
                else if ( params.url && params.text ) {
                    that.relevantData[model.get( 'id' )] = {
                            html: '<a href="'+ params.url +'">' + params.text + '</a>',
                            append: true
                    }
                
                }
                
            });
            
            // CTA.
            vc.events.on( 'shortcodes:nectar_cta', function ( model, event ) {
                
                var params = model.get( 'params' );
                params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );
            
                if ( 'destroy' === event ) {
                    delete that.relevantData[ model.get( 'id' ) ];
                } 
                else if ( params.url && params.link_text ) {
                    that.relevantData[model.get( 'id' )] = {
                            html: '<a href="'+ params.url +'">' + params.link_text + '</a>',
                            append: true
                    }
                
                }
                
            });


            //// Images.
            var eventsList = [
                'sync',
                'add',
                'update'
            ];
            var imageEventString = _.reduce( eventsList, function ( memo, e ) {
                return memo + that.getImageEventString( e );
            }, '' );
            vc.events.on( imageEventString, function ( model, param, settings ) {

                if ( param && param.length > 0 && param.indexOf('http') == -1) {

                    $.ajax({
                    type: "POST",
                    url: window.ajaxurl,
                    data: {
                        action: "wpb_gallery_html",
                        content: param,
                        _vcnonce: window.vcAdminNonce
                    },
                    dataType: "json",
                    context: this,
                    success: function (html) {
                        
                        var htmlData = html.data;
                        that.relevantData[model.get( 'id' ) + settings.param_name ] = {
                            html: htmlData,
                            append: true
                        };
             
                    }
                    });
           
      
                }

            });

          }


          // Periodically update content based on current data set
          setInterval(function(){
            rankMathEditor.refresh( 'content' );
          }, 2000);

      }

      SalientPortfolioRankMath.prototype.addContent = function ( data ) {
        
        var data = '';

        $.each(this.relevantData, function(i,obj) {
           if( obj.text ) {
             data += obj.text;
           } 
           else if( obj.html && obj.append ) {
            data += obj.html;
           }
        });

        return data;
    } 

    // Document ready.
    jQuery( function() {
        setTimeout( function() {
            if( window.ajaxurl && window.vcAdminNonce ) {
                new SalientPortfolioRankMath();
            }
        }, 1000);
    } );

})(jQuery);