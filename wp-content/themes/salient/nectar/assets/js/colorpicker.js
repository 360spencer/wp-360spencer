/**
 * Salient colorpicker init.
 *
 * @package Salient
 * @author ThemeNectar
 */
 /* global jQuery */
 
jQuery(document).ready(function ($) {
  "use strict";
  var colorScheme = ['#27CCC0', '#f6653c', '#2ac4ea', '#ae81f9', '#FF4629', '#78cd6e'];

  if( window.nectar_theme_colors ) {
    window.nectar_theme_colors.forEach(function(element, index){
      if(element.value) {
        colorScheme[index] = element.value;
      }
    });
  }

  $('[id*="nectar-metabox-"] input.popup-colorpicker:not(.sc-gen), .nectar-term-colorpicker').wpColorPicker({
    palettes: colorScheme
  });
});
