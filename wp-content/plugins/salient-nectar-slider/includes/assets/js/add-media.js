
jQuery(document).ready(function($) {
  
  "use strict";
  
  $(".nectar-add-btn").on('click', function(e) {
    
    var $that = $(this);  
    
    e.preventDefault();
    
    var image_add_frame = null;
    image_add_frame = wp.media.frames.customHeader = wp.media({
      title: $(this).attr('data-title'),
      library: {
        type: 'image'
      },
      button: {
        text: $(this).attr('data-update')
      }
    });
    
    image_add_frame.on( "select", function() {
      
      var image_attachment = image_add_frame.state().get("selection").first();
      var image_attachment_url = image_attachment.attributes.url;
      
      $that.parent().find('.nectar-media-preview').attr('src', image_attachment_url);
      $('#' + $that.attr('rel-id') ).val(image_attachment_url).trigger('change');
      
      $that.parent().find('.nectar-add-btn').hide();
      $that.parent().find('.nectar-media-preview').show();
      $that.parent().find('.nectar-remove-btn').show();
      
      toggleParallaxOption();
      
    });
    
    image_add_frame.open();
    
  });
  
  $(".nectar-remove-btn").on('click', function(e) {
    
    e.preventDefault();
    
    $('#' + $(this).attr('rel-id')).val('');
    $(this).prev().fadeIn();
    
    $(this).parent().find('.nectar-media-preview').fadeOut();
    $(this).fadeOut();
    
    toggleParallaxOption();
  });
  
  
  
  
  
  //media upload
  $(".nectar-add-media-btn").on('click',  function(e) {
    
    e.preventDefault();
    
    var $that = $(this);  
    
    var custom_file_frame = null;
    
    custom_file_frame = wp.media.frames.customHeader = wp.media({
      title: $(this).data("choose"),
      library: {
        type: 'video'
      },
      button: {
        text: $(this).data("update")
      }
    });
    
    custom_file_frame.on( "select", function() {
      
      var file_attachment = custom_file_frame.state().get("selection").first();
      
      $('#' + $that.attr('rel-id') ).val(file_attachment.attributes.url).trigger('change');
      
      $('#_nectar_video_embed').trigger('keyup');
      
      $that.parent().find('.nectar-add-media-btn').hide();
      $that.parent().find('.nectar-remove-media-btn').show();
      
    });
    
    custom_file_frame.open();
    
  });
  
  
  $(".nectar-remove-media-btn").on('click',  function(e) {
    
    e.preventDefault();
    
    $('#' + $(this).attr('rel-id')).val('');
    $(this).prev().fadeIn();
    
    $(this).parent().find('.nectar-media-preview').fadeOut();
    $(this).fadeOut();
    
  });
  
  
  //only show parallax when using bg image
  function toggleParallaxOption(){
    if($('#_nectar_header_bg').length > 0){
      if($('#_nectar_header_bg').attr('value').length > 0 || $('#_nectar_header_bg_color').length > 0 && $('#_nectar_header_bg_color').attr('value').length > 0){
        $('#_nectar_header_parallax').parents('tr').show();
      } else {
        $('#_nectar_header_parallax').parents('tr').hide();
        $('#_nectar_header_parallax').prop('checked', false);
      }
    }
  }
  
  
  // Gallery Upload
  var selector = $( document ).find( '.nectar-media-gallery' );
  
   $( selector ).each(function() {
  
       var el = $( this );
  
       el.on({
         
           click: function( event ) {
  
               var galleryInstance = $( this ).closest( 'fieldset' );
  
               if ( event.currentTarget.id === 'remove-gal' ) {
  
                   galleryInstance.find( '.gallery_values' ).val( '' );
                   galleryInstance.find( ".screenshot" ).html( "" );
  
                   return;
  
               }
            
               if ( typeof wp === 'undefined' || 
                 !wp.media || 
                 !wp.media.gallery ) {
                   return;
               }
               event.preventDefault();
  
               var val = galleryInstance.find( '.gallery_values' ).val();
               var final;
  
               if ( !val ) {
                   final = '[gallery ids="0"]';
               } else {
                   final = '[gallery ids="' + val + '"]';
               }
  
               var frame = wp.media.gallery.edit( final );
               
               if( $('body.particle-edit').length > 0 ) {
  
                 $(frame.title.view.el).find('.media-frame-title h1').text('Edit Particle Shapes');
                 $(frame.title.view.el).find('.media-frame-menu .media-menu a:contains(Add to Gallery)').text('Add to Particle Shapes');
                 $(frame.title.view.el).find('.media-frame-menu .media-menu a:contains(Edit Gallery)').text('Edit');
                 $(frame.title.view.el).find('.media-frame-menu .media-menu a:contains(Cancel Gallery)').text('Cancel');
                 $(frame.title.view.el).find('.media-toolbar-primary a:contains(Update gallery)').text('Update Particle Shapes');
                 setTimeout(function(){ $(frame.title.view.el).find('.media-toolbar-primary a:contains(Update gallery)').text('Update Particle Shapes'); },400);
                 var $cssString = '.collection-settings, input[type="text"].describe, .attachment-details label[data-setting="alt"], .attachment-details label[data-setting="description"] { display: none!important;} .compat-item .label {max-width: 30%; } p.help { font-size: 12px; font-style: normal; color: #888; } .compat-item tr.compat-field-shape-bg-color, .compat-item tr.compat-field-shape-color-alpha, .compat-item tr.compat-field-shape-color-mapping, .compat-item tr.compat-field-shape-particle-color,  .compat-item tr.compat-field-shape-density, .compat-item tr.compat-field-shape-max-particle-size { display: block;} ';
                 $('style#remove-gallery-els').remove();
  
                 var head = document.head || document.getElementsByTagName('head')[0];
                 var style = document.createElement('style');
  
                 style.type = 'text/css';
                 style.id = 'remove-gallery-els';
              
                 if (style.styleSheet){
                   style.styleSheet.cssText = $cssString;
                 } else {
                   style.appendChild(document.createTextNode($cssString));
                 }
                 head.appendChild(style);
   
  
                $('.media-menu-item:contains(Add to Particle Shapes)').on('click',function(){
                  $ (frame.title.view.el).find('.media-frame-title h1, .media-frame-toolbar .media-button-insert').text('Add to Particle Shapes');
                });
                
                $('.media-menu-item:contains(Edit Particle Shapes)').on('click',function(){
                  $ (frame.title.view.el).find('.media-frame-title h1').text('Edit Particle Shapes');
                  $('.media-frame-toolbar .media-button-insert').text('Update Particle Shapes');
                });
                
                $('body').on('click','.media-frame:not(.hide-router) .attachments-browser li.attachment .attachment-preview',function(){
       
                  $(frame.title.view.el).find('.media-frame-toolbar .media-button-insert').text('Add to Particle Shapes');
                  $(frame.title.view.el).find('.media-frame-title h1').text('Add to Particle Shapes');
                });
                
                $('body').on('mousedown','.media-toolbar-primary .button:contains(Add to Particle Shapes)',function(){
                  
                     setTimeout(function(){
                           $(frame.title.view.el).find('.media-frame-toolbar .media-button-insert').text('Update Particle Shapes');
                           $(frame.title.view.el).find('.media-frame-title h1').text('Edit Particle Shapes');
                     },200);
                    
                });
              }
  
            
               frame.state( 'gallery-edit' ).on('update', function( selection ) {
  
                galleryInstance.find( ".screenshot" ).html( "" );
   
                //remove temp stylesheet that shows extra fields
                $('style#remove-gallery-els').remove();
                $('body').removeClass('particle-edit');
                 var element, preview_html = "", preview_img;
                 var ids = selection.models.map(
                     function( e ) {
                         element = e.toJSON();
                         preview_img = typeof element.sizes.thumbnail !== 'undefined' ? element.sizes.thumbnail.url : element.url;
                         preview_html = "<img class='nectar-media-preview' src='" + preview_img + "'  />";
                         galleryInstance.find( ".screenshot" ).append( preview_html );
  
                         return e.id;
                     }
                 );
  
                 galleryInstance.find( '.gallery_values' ).val( ids.join( ',' ) );
  
                 }); // on update.
  
                   return false;
               } // click event
            }, '.gallery-attachments'
        );
     }
  );
  
  
});

