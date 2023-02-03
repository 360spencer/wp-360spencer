(function($){

    "use strict";

    function SalientReduxOptions() {
        
        this.container = $('.redux-container')
        this.events();
    }

    SalientReduxOptions.prototype.events = function() {

      var that = this;

        // Changing header color scheme.
        $('#header-color-select').on('change', function() {
          var val = $(this).val();
          that.colorGrid(val);
        });

        if( $('#header-color-select').length > 0 ) {
          this.colorGrid($('#header-color-select').val());
        }
        
    };

    SalientReduxOptions.prototype.colorGrid = function(val) {

      if( val === 'custom' ) {
        $('.salient-color-grid, .salient-color-grid + table').removeClass('inactive');
      } else {
          $('.salient-color-grid, .salient-color-grid + table').addClass('inactive');
      }

    }

    $(document).ready(function(){
        new SalientReduxOptions();
    });

}(jQuery));