/* global vc, YoastSEO, _, jQuery */
(function ( $ ) {
	'use strict';
	var imageEventString, vcYoast, relevantData, eventsList;

	relevantData = {};
	eventsList = [
		'sync',
		'add',
		'update'
	];
	
	// nectar addition - alter how memoize is used.
	var imageFlag = false;
	
	function nectarAnalyzeContent(data) {

		var content = data;
		content = contentModification(data);
		return content;
		
	}
	
	function contentModification(data) {
		
		data = _.reduce( relevantData, function ( memo, value, key ) {

			if( value.html && value.append ) {
				memo += value.html;
			}
			else if ( value.html && value.insertAtLocation ) {
				memo = memo.replace( '"' + value.text + '"', '""]' + value.html + '[' );
			}
			else if ( value.html ) {
				memo = memo.replace( '"' + value.text + '"', value.html );
			}
      
      /* nectar addition */
      /* All image processing is handled in bulk in the imageEventString event */
      
			return memo;
			
		}, data );

		return data;
		
	}
	
	var cachedContentModification = _.memoize( function ( data ) {
		return contentModification(data);
	});
	// nectar addition end.
	

	function getImageEventString( e ) {
		/* nectar addition - add fws_image */
		return ' shortcodes:' + e + ':param:type:attach_image' + ' shortcodes:' + e + ':param:type:attach_images' + ' shortcodes:' + e + ':param:type:fws_image';
		// nectar addition end.
	}

	// add relevant data for images
	imageEventString = _.reduce( eventsList, function ( memo, e ) {
		return memo + getImageEventString( e );
	}, '' );
	vc.events.on( imageEventString, function ( model, param, settings ) {
    
		// nectar addition.
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
          relevantData[model.get( 'id' ) + settings.param_name ] = {
            html: htmlData,
            append: true
          };

          if ( window.YoastSEO && typeof YoastSEO.app.refresh != 'undefined' ) {
            YoastSEO.app.refresh();
          }
          if( window.rankMathEditor && typeof rankMathEditor.refresh != 'undefined' ) {
            rankMathEditor.refresh( 'content' );
          }
          
        }
      });
     

		}
	} );

	vc.events.on( getImageEventString( 'destroy' ), function ( model, param, settings ) {
		delete relevantData[ model.get( 'id' ) + settings.param_name ];
	} );
	
	// Add relevant data to headings
	vc.events.on( 'shortcodes:vc_custom_heading', function ( model, event ) {
		var params, tagSearch;
		params = model.get( 'params' );
		params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );

		if ( 'destroy' === event ) {
			delete relevantData[ model.get( 'id' ) ];
		} else if ( params.text && params.font_container ) {
			tagSearch = params.font_container.match( /tag:([^\|]+)/ );
			if ( tagSearch[ 1 ] ) {
				relevantData[ model.get( 'id' ) ] = {
					html: '<' + tagSearch[ 1 ] + '>' + params.text + '</' + tagSearch[ 1 ] + '>',
					text: params.text,
					insertAtLocation: true
				};
			}
		}
	} );

	/* nectar addition - split line heading */
	vc.events.on( 'shortcodes:split_line_heading', function ( model, event ) {
		var params, tagSearch;
		params = model.get( 'params' );
		params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );

		if ( 'destroy' === event ) {
			delete relevantData[ model.get( 'id' ) ];
		} else if ( params.animation_type && 
							params.animation_type === 'line-reveal-by-space' && 
							params.font_style && 
							params.text_content ) {
			
			var headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

			if ( headingTags.indexOf(params.font_style) >= 0 ) {
				relevantData[ model.get( 'id' ) ] = {
					html: '<' + params.font_style + '>' + params.text_content + '</' + params.font_style + '>',
					text: params.text_content,
					insertAtLocation: true
				};
			}
		}
	} );

	/* nectar addition - custom elements */
	// Button.
	vc.events.on( 'shortcodes:nectar_btn', function ( model, event ) {

		var params = model.get( 'params' );
		params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );

		if ( 'destroy' === event ) {
			delete relevantData[ model.get( 'id' ) ];
		} 
		else if ( params.url && params.text ) {
				relevantData[model.get( 'id' )] = {
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
			delete relevantData[ model.get( 'id' ) ];
		} 
		else if ( params.url && params.link_text ) {
				relevantData[model.get( 'id' )] = {
					html: '<a href="'+ params.url +'">' + params.link_text + '</a>',
					append: true
			}
		
		}
		
	});
	
	
	// Fancy Box.
	vc.events.on( 'shortcodes:fancy_box', function ( model, event ) {

		var params = model.get( 'params' );
		params = _.extend( {}, vc.getDefaults( model.get( 'shortcode' ) ), params );
		
		if ( 'destroy' === event ) {
			delete relevantData[ model.get( 'id' ) ];
		} 
		else if ( params.link_url ) {
				relevantData[model.get( 'id' )] = {
					html: '<a href="'+ params.link_url +'"></a>',
					append: true
			}
			
		
		}
		
	});
	
	/* nectar addition end */

	$( window ).on( 'YoastSEO:ready', function () {
		var VcVendorYoast = function () {
			// init
			YoastSEO.app.registerPlugin( 'wpbVendorYoast', { status: 'ready' } );
			YoastSEO.app.pluginReady( 'wpbVendorYoast' );
			YoastSEO.app.registerModification( 'content', nectarAnalyzeContent, 'wpbVendorYoast', 5 );
		};

		vcYoast = new VcVendorYoast();
	} );
	$( document ).ready( function () {
		if ( window.wp && wp.hooks && wp.hooks.addFilter ) {
			wp.hooks.addFilter( 'rank_math_content', 'wpbRankMath', nectarAnalyzeContent );
		}
	} );
})( window.jQuery );
