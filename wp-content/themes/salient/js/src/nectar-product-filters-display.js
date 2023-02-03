/**
 *
 * JS required to toggle the intial display
 * of the filter area based on LS
 *
 * @package Salient
 * @author ThemeNectar
 * @see init.js - NectarWooCommerceFilters
 */


(function(window, document) {

	"use strict";

  function NectarProductFiltersDisplay() {

      this.display = null;

      this.getLS();
      this.setDisplay();
  }

  NectarProductFiltersDisplay.prototype.getLS = function() {

    if( typeof(Storage) !== "undefined" ) {
      this.display = localStorage.getItem("nectar_product_filters_vis");
    }

  };

  NectarProductFiltersDisplay.prototype.setDisplay = function() {
    
    // Check for default state.
    if( this.display != 'true' && this.display != 'false' ) {
      
      this.display = 'true'; 
      
      if( window.nectarProductFilterOptions && window.nectarProductFilterOptions.startingState == 'closed' ) {
        this.display = 'false'; 
        
        if( typeof(Storage) !== "undefined" ) {
          localStorage.setItem("nectar_product_filters_vis", 'false');
        }
      } 
  
    }

    var styles = '@media only screen and (min-width: 1000px) {';

    // Open.
    if( this.display == 'true' ) {
      styles += '#sidebar { display: block; } \
      .nectar-shop-filter-trigger .toggle-icon .top-line { transform: translateX(10px); } \
      .nectar-shop-filter-trigger .toggle-icon .bottom-line { transform: translateX(-10px); }\
      .nectar-shop-filter-trigger .text-wrap .dynamic .show { display: none; }';
    }
    // Closed.
    else {

      styles += '.archive.woocommerce .container-wrap > .main-content #sidebar { opacity: 0; } \
      .archive.woocommerce .container-wrap > .main-content #sidebar > .inner { -webkit-transform: translateX(100%); transform: translateX(100%); } \
      .archive.woocommerce .container-wrap > .main-content #sidebar.col_last { margin-left: -25%; } \
      .archive.woocommerce .container-wrap > .main-content #sidebar:not(.col_last) > .inner { -webkit-transform: translateX(-100%); transform: translateX(-100%); } \
      .archive.woocommerce .container-wrap > .main-content #sidebar:not(.col_last) { margin-right: -25%; } \
      .nectar-shop-filter-trigger .text-wrap .dynamic .hide { display: none; }';
    }

    styles += '}';

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = styles;
    } else {
      style.appendChild(document.createTextNode(styles));
    }

    style.setAttribute('id', 'nectar-product-filters-display-critical');
    head.appendChild(style);

  }

  new NectarProductFiltersDisplay();


}(window, document));
