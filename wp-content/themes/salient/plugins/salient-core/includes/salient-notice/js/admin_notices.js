/**
 * Salient core notice
 *
 * @package Salient Core
 * @author ThemeNectar
 */
 /* global jQuery */
 /* global notice_params */
  
 (function($) { 
	 
	 "use strict";
	 
	 jQuery( document ).ready( function() {
		 
		 jQuery( document ).on( 'click', '.nectar-dismiss-notice-salient-core .notice-dismiss', function() {
			 
			 var data = {
				 action: 'salient_core_dismiss_plugin_notice',
			 };
			 
			 jQuery.post( notice_params.ajaxurl, data, function() {
				 
			 });
			 
		 })
		 
	 });
	 
 })(jQuery);