
(function( $ ) {

  "use strict";

  function NectarCustomWidgetLocations() {

    this.$el = $('.nectar-custom-widget-locations');
    this.$locationList = this.$el.find('.custom-widget-location-list');
    this.$form = this.$el.find('.nectar-user-defined-widget-locations');

    this.state = {
      processing: false
    }
    this.events();

    $(window).on('resize', this.overflow.bind(this));
    this.overflow();
  }

  NectarCustomWidgetLocations.prototype.overflow = function() {

    var locationListHeight = this.$locationList.height();

    if( locationListHeight > 245 ) {
      this.$locationList.removeClass('no-overflow');
    } else {
      this.$locationList.addClass('no-overflow');
    }

  };

  NectarCustomWidgetLocations.prototype.events = function() {

    var that = this;

    // Save Locations
    $('body').on('click','.nectar-custom-widget-locations .add-new-button', function() {

      if( that.state.processing ) {
        return false;
      }

      var $form = $('.nectar-custom-widget-locations form.nectar-user-defined-widget-locations');
      var $that = $(this);

      $form.find('#widget_location_name').removeClass('error');

      // Get menu info to pass.
      var widgetLocationInfo = {
          name: $form.find('#widget_location_name').val(),
          desc: $form.find('#widget_location_desc').val()
      };

      if( widgetLocationInfo.name == 0 ) {

        $form.find('#widget_location_name').addClass('error');
        setTimeout(function(){
          $form.find('#widget_location_name').removeClass('error');
        },1500);

        return false;
      }

      that.state.processing = true;

      $that.addClass('saving');

      // Get Form Data.
      $.ajax({
          type: 'POST',
          url: nectar_widgets.ajaxurl,
          data: {
              action: "nectar_custom_widget_locations_save",
              name: widgetLocationInfo.name,
              desc: widgetLocationInfo.desc,
              nonce: nectar_widgets.nonce
          },
          cache: false,
          success: function (response) {

            that.state.processing = false;

            if( response.message == 'success' ) {
              window.location.reload();
            } else {
              $that.removeClass('saving');

              that.$form.append('<span class="error-message">'+response.message+'</span>');
              setTimeout(function(){
                that.$form.find('.error-message').remove();
              },3000);

            }

          }
      }); // end ajax.

      return false;

    });


    // Remove Location
    $('body').on('click','.nectar-custom-widget-locations .custom-widget-location-list .remove', function() {

      if( window.confirm(nectar_widgets_i18n.confirm_delete) ) {
        // Proceed...
      } else {
        return false;
      }

      if( that.state.processing ) {
        return false;
      }

      var $that = $(this);

      that.state.processing = true;
      $(this).parents('.location').addClass('removing');

      // Get Form Data.
      $.ajax({
          type: 'POST',
          url: nectar_widgets.ajaxurl,
          data: {
              action: "nectar_custom_widget_location_remove",
              id: $that.parents('.location').attr('data-id'),
              nonce: nectar_widgets.nonce
          },
          cache: false,
          success: function (response) {
            that.state.processing = false;

              if( response.message == 'success' ) {
                window.location.reload();
              }
              else {

                $that.parents('.location').removeClass('removing');

                that.$form.append('<span class="error-message">'+response.message+'</span>');
                setTimeout(function(){
                  that.$form.find('.error-message').remove();
                },3000);

              }

          }
      }); // end ajax.

      return false;

    });



    // Toggle Display
    $('body').on('click','.nectar-custom-widget-locations > h2', function() {

      $(this).parent().toggleClass('closed');

      $.ajax({
          type: 'POST',
          url: nectar_widgets.ajaxurl,
          data: {
              action: "nectar_custom_widget_locations_vis_save",
              open: $('.nectar-custom-widget-locations.closed').length === 0 ? 'true' : 'false',
              nonce: nectar_widgets.nonce
          },
          cache: false,
          success: function (response) {

            console.log(response)

          }
      }); // end ajax.

    });

    // Form input placeholders
    $('body').on('focus','.nectar-user-defined-widget-locations input[type="text"]', function() {
      $(this).parent().addClass('active');
    });
    $('body').on('blur','.nectar-user-defined-widget-locations input[type="text"]', function() {
      if( $(this).val().length == 0 ) {
        $(this).parent().removeClass('active');
      }
    });

    $('body').on('keyup','.nectar-user-defined-widget-locations input[type="text"]', function() {
      if( $(this).val().length > 0 ) {
        $(this).parent().addClass('active');
      } else {
        $(this).parent().removeClass('active');
      }
    });

  };

  // Document ready.
  jQuery(document).ready(function($) {
    var nectarCustomWidgetLocationsInstance = new NectarCustomWidgetLocations();
  });

}( jQuery ));
