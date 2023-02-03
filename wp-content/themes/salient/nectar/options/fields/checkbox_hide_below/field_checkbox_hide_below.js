jQuery(document).ready(function(){
	jQuery('.redux-opts-checkbox-hide-below').each(function(){
		var amount = jQuery(this).data('amount');
		if(!jQuery(this).is(':checked')){
			jQuery(this).closest('tr').nextAll('tr').slice(0,amount).hide();
		}
	});
	jQuery('.redux-opts-checkbox-hide-below').on('click',function(){
		var amount = jQuery(this).data('amount');
		jQuery(this).closest('tr').nextAll('tr').slice(0,amount).fadeToggle('slow');
	});
});
