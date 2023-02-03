(function($) {

  "use strict";
  
  /* Element Sorting */
  function NectarWPBakeryElementSorting() {

    this.state = {
      sorting: false,
      mouseX: 0,
      mouseXLerp:0,
      mouseY: 0,
      mouseYLerp: 0
    }

    $('body').append('<div id="nectar-fe-sortable-indicator"><div class="inner"></div></div>');
    
    this.$indicator = $('#nectar-fe-sortable-indicator');
    this.$indicatorInner = $('#nectar-fe-sortable-indicator .inner');

    this.events();
  }

  NectarWPBakeryElementSorting.prototype.events = function() {

    var that = this;

    $(window).on('nectar-frontend-sorting-start', this.sortingStart.bind(this));
    $(window).on('nectar-frontend-sorting-stop', this.sortingStop.bind(this));
    $(window).on('mousemove', function(e) {
      that.state.mouseX = e.clientX;
      that.state.mouseY = e.clientY;
    });



    // Column outlines.

    //// Element
    var activateColOutline = true;
    
    $('body').on( 'mouseover', '.vc_element.vc_vc_column', function() {

      if(activateColOutline) {
        $(this).addClass('nectar-vc-el-outline-active');
        activateColOutline = false;
      }

    });

    $('body').on( 'mouseenter', '.vc_element.vc_vc_column_inner', function() {
      activateColOutline = false;
      $(this).parents().removeClass('nectar-vc-el-outline-active');
      $(this).addClass('nectar-vc-el-outline-active');
    });

    $('body').on( 'mouseleave', '.vc_element.vc_vc_column, .vc_element.vc_vc_column_inner', function() {
      $(this).removeClass('nectar-vc-el-outline-active');
      activateColOutline = true;
    });

    //// Controls
    $('body').on( 'mouseenter', '.vc_controls-out-tl > .element-vc_column_inner', function() {
      var $parent = $(this).parents('.vc_element.vc_vc_column_inner');
      $('.vc_element.vc_vc_column, .vc_element.vc_vc_column_inner').removeClass('nectar-vc-el-outline-active');
      $parent.addClass('nectar-vc-el-outline-active');
      activateColOutline = false;
    });



    // Row outlines.

    //// Controls
    $('body').on( 'mouseenter', '.vc_controls-out-tl > .parent-vc_row', function() {
      var $parent = $(this).parents('.vc_element.vc_vc_row');
      $('.vc_element.vc_vc_column, .vc_element.vc_vc_column_inner').removeClass('nectar-vc-el-outline-active');
      $parent.addClass('nectar-vc-el-outline-active');
      activateColOutline = false;
    });

    $('body').on( 'mouseleave', '.vc_controls-out-tl > .parent-vc_row', function() {
      var $parent = $(this).parents('.vc_element.vc_vc_row');
      $parent.removeClass('nectar-vc-el-outline-active');
      activateColOutline = true;
    });

    $('body').on( 'mouseenter', '.vc_controls-out-tl > .parent-vc_row_inner', function() {
      var $parent = $(this).parents('.vc_element.vc_vc_row_inner');
      $('.vc_element.vc_vc_column, .vc_element.vc_vc_column_inner').removeClass('nectar-vc-el-outline-active');
      $parent.addClass('nectar-vc-el-outline-active');
    });
    
    $('body').on( 'mouseleave', '.vc_controls-out-tl > .parent-vc_row_inner', function() {
      var $parent = $(this).parents('.vc_element.vc_vc_row_inner');
      $parent.removeClass('nectar-vc-el-outline-active');
      activateColOutline = true;
    });


  };

  NectarWPBakeryElementSorting.prototype.renderIcon = function() {
    var hiddenHelper = $('.vc_helper');
    var color = hiddenHelper.css('background-color');
    var icon = hiddenHelper.find('i').clone();
    
    this.$indicatorInner.css({'background-color': color});
    if( color == '#f9b418' ) {
      icon.addClass('vc_helper-vc_column');
    } 
    else if( color == '#3353fc' ) {
      icon.addClass('vc_helper-vc_row');
    }
    this.$indicatorInner.html(icon);
  }

  NectarWPBakeryElementSorting.prototype.sortingStart = function() {
    this.state.sorting = true;

    this.state.mouseXLerp = this.state.mouseX;
    this.state.mouseYLerp = this.state.mouseY;

    this.renderIcon();
    this.$indicatorInner[0].style.opacity = '1';
    this.$indicatorInner[0].style.transform = 'scale(1)';
    
    this.sortingIndicatorRAF();
  };

  NectarWPBakeryElementSorting.prototype.sortingStop = function() {
    this.$indicatorInner[0].style.opacity = '0';
    this.$indicatorInner[0].style.transform = 'scale(0.25)';
    this.state.sorting = false;
  };

  NectarWPBakeryElementSorting.prototype.sortingIndicatorRAF = function() {
    if( !this.state.sorting ) {
      return;
    }
    this.state.mouseXLerp = this.lerp(this.state.mouseXLerp, this.state.mouseX, 0.3 );
    this.state.mouseYLerp = this.lerp(this.state.mouseYLerp, this.state.mouseY, 0.3 );
    
    this.$indicator[0].style.transform = 'translateX('+this.state.mouseXLerp+'px) translateY('+this.state.mouseYLerp+'px)';

    requestAnimationFrame(this.sortingIndicatorRAF.bind(this));
  }

  NectarWPBakeryElementSorting.prototype.lerp = function(a,b,n) {
    return (1 - n) * a + n * b;
  }

  
  $(document).ready(function(){
    new NectarWPBakeryElementSorting();
  });
  
})(jQuery);