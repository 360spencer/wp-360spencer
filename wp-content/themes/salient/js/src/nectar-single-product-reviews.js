/**
 * Salient Single Product Reviews.
 *
 * @package Salient
 * @author ThemeNectar
 */

 (function( $ ) {
  
  "use strict";

  
  /**
  * Nectar Modal Product Reviews
  *
  */
   function NectarWooReviewsModal() {

    this.$el = $('#tab-reviews #review_form_wrapper');
    this.$button = $('#reviews .nectar-product-reviews-trigger');

    this.setup();

    this.state = {
      open: false
    };

  }

  NectarWooReviewsModal.prototype.setup = function() {

    var that = this;

    // DOM.
    this.$el.addClass('modal');
    if( $('body.material').length > 0 ) {
      this.$el.find('#review_form').prepend('<div class="nectar-close-btn-wrap"><a href="#" class="nectar-close-btn small"><span class="close-wrap"><span class="close-line close-line1"></span><span class="close-line close-line2"></span></span></a></div>');
    } 
    else {
      this.$el.find('#review_form').prepend('<div class="nectar-close-btn-wrap"><a href="#" class="nectar-close-btn small"><span class="icon-salient-m-close"></span></a></div>');
    }
    this.$el.detach();
    $('body').append(this.$el);
    
    if( $('body').find('.nectar-slide-in-cart-bg').length == 0 ) {
      $('body').append('<div class="nectar-slide-in-cart-bg"></div>');
    }
    
    this.$closeBtnEl = this.$el.find('.nectar-close-btn-wrap');
    this.$bgEl = $('.nectar-slide-in-cart-bg');
    
    this.timeout = '';
    
    // Events.
    this.$button.on('click', function() {
      that.open();
      return false;
    });
    
    $('#review_form .nectar-close-btn-wrap, .nectar-slide-in-cart-bg').on('click', function(e) {
      that.close();
      e.preventDefault();
    });

  };

  NectarWooReviewsModal.prototype.open = function() {
    
    clearTimeout(this.timeout);
    
    this.$closeBtnEl.addClass('open');
    this.$el.addClass('open');
    this.$bgEl.addClass('open').addClass('revealed');
    
    this.state.open = true;

  };
  
  NectarWooReviewsModal.prototype.close = function() {
    
    var that = this;
    
    this.$el.removeClass('open');
    this.$bgEl.removeClass('open');
    this.$closeBtnEl.removeClass('open');
    
    this.timeout = setTimeout(function() {
      that.$bgEl.removeClass('revealed');
    },400);
    
    this.state.open = false;

  };
  
  
  jQuery(document).ready(function($) {
    if( $('.nectar-product-reviews-trigger').length > 0 ) {
      var reviewsModal = new NectarWooReviewsModal();
    }
  });

 
 }(jQuery));