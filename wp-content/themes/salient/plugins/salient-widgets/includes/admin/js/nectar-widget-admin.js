jQuery(document).ready(function($) {

  "use strict";

  // image upload
  $("body").on('click', '.nectar-upload-widget-img-btn', function(e) {

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

    image_add_frame.on( "close" ,function(){
      $('body').removeClass('page-header-edit');
    });

    image_add_frame.on( "select", function() {

      var image_attachment = image_add_frame.state().get("selection").first();
      var image_attachment_url = image_attachment.attributes.url;

      $that.closest('p').find('.nectar-media-preview').attr('src', image_attachment_url);
      $('#' + $that.attr('rel-image-preview') ).val(image_attachment_url).trigger('change');
      $('#' + $that.attr('rel-image-id') ).val(image_attachment.attributes.id).trigger('change');

      $that.closest('p').find('.nectar-upload-widget-img-btn').hide();
      $that.closest('p').find('.nectar-media-preview').show();
      $that.closest('p').find('.nectar-remove-widget-img-btn').show();

    });

    image_add_frame.open();


  });

  $("body").on('click', '.nectar-remove-widget-img-btn', function(e) {

    e.preventDefault();

    $('#' + $(this).attr('rel-image-preview')).val('').trigger('change');
    $('#' + $(this).attr('rel-image-id')).val('').trigger('change');
    $(this).prev().fadeIn();

    $(this).closest('p').find('.nectar-media-preview').fadeOut();
    $(this).hide();

  });

  // position selection
  $("body").on('click', '.widget-inside .content-alignment-select .selection > span', function(e) {
    // class
    var $parent = $(this).closest('.content-alignment-select');
    $parent.find('.selection > span').removeClass('active');
    $(this).addClass('active');

    // update hidden val
    $parent.find('input[type="hidden"][id*="widget-nectar_image"]').val($(this).attr('data-pos')).trigger('change');

  });

  // colorpicker
  function nectarWidgetColorPicker() {
    $('.widget-inside .nectar-widget-colorpicker input.popup-colorpicker').wpColorPicker({
      change: function(event, ui){
        var element = event.target;
        var color = ui.color.toString();
        $(element).val(color);
        $(this).trigger('change');
      },
      palettes: [nectarColors.color1, nectarColors.color2, nectarColors.color3, nectarColors.color4, nectarColors.color5, nectarColors.color6]
    });
  }
  nectarWidgetColorPicker();
  $(document).on('widget-updated widget-added', function() {

    //remove existing to re-init - wp does not offer a destroy method.
    $('.nectar-widget-colorpicker .wp-picker-container').each(function(){
      var $input = $(this).find('input.popup-colorpicker').clone();
      var $parent = $(this).parent();

      $(this).remove();
     $parent.append($input);
    })

    nectarWidgetColorPicker();
  });


});
