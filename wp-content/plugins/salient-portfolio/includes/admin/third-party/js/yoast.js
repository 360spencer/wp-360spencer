/**
 * Salient Yoast SEO Portfolio Analysis
 *
 * @author ThemeNectar
 */
 
(function( $ ) {
  
  "use strict";
  
  function SalientPortfolioYoast() {
    
   // Ensure YoastSEO.js is present and can access the necessary features.
   if ( typeof YoastSEO === "undefined" || typeof YoastSEO.analysis === "undefined" || typeof YoastSEO.analysis.worker === "undefined" ) {
        return;
    }
    
    YoastSEO.app.registerPlugin( "SalientPortfolioPostTypePlugin", { status: "ready" } );
    
    this.relevantData = {};
    this.registerModifications();
    this.vcEvents();
    
  }
  
  SalientPortfolioYoast.prototype.vcEvents = function() {
    
    var that = this;

    // Initial.
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
    
    // Updating.
    if( vc && vc.events ) {
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
    }
    
  }
  
  
  SalientPortfolioYoast.prototype.registerModifications = function() {
    
    const callback = this.addContent.bind( this );
    YoastSEO.app.registerModification( "content", callback, "SalientPortfolioPostTypePlugin", 10 );
    
  };
  
  
  SalientPortfolioYoast.prototype.addContent = function ( data ) {
    
    $.each(this.relevantData, function(i,obj) {
      if( obj.text ) {
        data += obj.text;
      }
    });

		return data;
	} 
  
/**
 * Adds eventlistener to load the plugin.
 */
if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
  new SalientPortfolioYoast();
} else {
  jQuery( window ).on(
    "YoastSEO:ready",
    function() {
      new SalientPortfolioYoast();
    }
  );
}

}( jQuery ));
