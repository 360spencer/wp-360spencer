 /**
 * Salient priority script.
 *
 * @package Salient
 * @author ThemeNectar
 */
 /* global jQuery */


jQuery(function($) {
 /**
  * Nectar Slider mobile font sizing override options.
  *
  * @since 9.0
  */
	function sliderFontOverrides() {

		var $overrideCSS = '';

		$('.nectar-slider-wrap').each(function(){

			if($(this).find('.swiper-container[data-tho]').length > 0) {

				var $tho = $(this).find('.swiper-container').attr('data-tho');
				var $tco = $(this).find('.swiper-container').attr('data-tco');
				var $pho = $(this).find('.swiper-container').attr('data-pho');
				var $pco = $(this).find('.swiper-container').attr('data-pco');

				// Tablets Viewport.
				if( $tho != 'auto' || $tco != 'auto' ) {

					$overrideCSS += '@media only screen and (max-width: 1000px) and (min-width: 690px) {';
					if($tho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content .ns-heading-el, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content .ns-heading-el, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content .ns-heading-el, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content .ns-heading-el, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content .ns-heading-el { font-size:' + $tho + 'px!important; line-height:' + (parseInt($tho) + 10) + 'px!important;  }';
					if($pho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content p, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content p, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content p, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p { font-size:' + $tco + 'px!important; line-height:' + (parseInt($tco) + 10) + 'px!important;  }';
					$overrideCSS += '}';

				}


				// Phone Viewport.
				if( $pho != 'auto' || $pco != 'auto' ) {

					$overrideCSS += '@media only screen and (max-width: 690px) {';
					if($pho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content .ns-heading-el, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content .ns-heading-el, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content .ns-heading-el, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content .ns-heading-el, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content .ns-heading-el { font-size:' + $pho + 'px!important; line-height:' + (parseInt($pho) + 10) + 'px!important;  }';
					if($pho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content p, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p,  body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content p, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content p, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p { font-size:' + $pco + 'px!important; line-height:' + (parseInt($pco) + 10) + 'px!important;  }';
					$overrideCSS += '}';
				}

			}

		});


		if( $overrideCSS.length > 1 ) {

			var head = document.head || document.getElementsByTagName('head')[0];
			var style = document.createElement('style');

			style.type = 'text/css';
			if (style.styleSheet){
				style.styleSheet.cssText = $overrideCSS;
			} else {
				style.appendChild(document.createTextNode($overrideCSS));
			}

			head.appendChild(style);

			$('.nectar-slider-wrap .content').css('visibility','visible');
		}

	}

	sliderFontOverrides();

});