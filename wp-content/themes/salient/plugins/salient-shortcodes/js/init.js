/**
 * Salient Shortcodes Basic.
 *
 * @author ThemeNectar
 */
 /* global jQuery */
 
 
jQuery(document).ready(function($){
  
  "use strict";
  
  /* Tabs */
  $('body').on('click','.tabbed > ul li:not(.cta-button) a',function(e){
    
    e.preventDefault();
    
    var $id = $(this).parents('li').index()+1;
    
    var $frontEndEditorTabDiv =  ($('body.vc_editor').length > 0) ? '> .wpb_tab ': '';
    
    if(!$(this).hasClass('active-tab') && !$(this).hasClass('loading')){
      $(this).parents('ul').find('a').removeClass('active-tab');
      $(this).addClass('active-tab');
      
      $(this).parents('.tabbed').find('> div:not(.clear)' + $frontEndEditorTabDiv).css({'visibility':'hidden','position':'absolute','opacity':'0','left':'-9999px', 'display': 'none'}).removeClass('visible-tab');
      
      if($('body.vc_editor').length > 0) {
        //front end editor locate tab by modal id
        var $data_m_id = ($(this).parent().is('[data-m-id]')) ? $(this).parent().attr('data-m-id') : '';
        $(this).parents('.tabbed').find('> div[data-model-id="'+$data_m_id+'"]' + $frontEndEditorTabDiv).css({'visibility':'visible', 'position' : 'relative','left':'0','display':'block'}).stop().animate({'opacity':1},400).addClass('visible-tab');
        //update padding
        
      } else {
        $(this).parents('.tabbed').find('> div:nth-of-type('+$id+')' + $frontEndEditorTabDiv).css({'visibility':'visible', 'position' : 'relative','left':'0','display':'block'}).stop().animate({'opacity':1},400).addClass('visible-tab');
      }
      
      if($(this).parents('.tabbed').find('> div:nth-of-type('+$id+') .iframe-embed').length > 0 || $(this).parents('.tabbed').find('> div:nth-of-type('+$id+') .portfolio-items').length > 0) setTimeout(function(){ $(window).resize(); },10); 
    }
    

    return false;
    
  });
  
  
  
  function tabbedInit(){ 
    
    $('.tabbed').each(function(){

      //make sure the tabs don't have a nectar slider - we'll init this after the sliders load in that case
      if($(this).find('.swiper-container').length === 0 && $(this).find('.testimonial_slider').length === 0 && $(this).find('.portfolio-items:not(".carousel")').length === 0 && $(this).find('.wpb_gallery .portfolio-items').length === 0 && $(this).find('iframe').length == 0){
        $(this).find('> ul li:first-child a').trigger('click');
      }	
      if($(this).find('.testimonial_slider').length > 0 || $(this).find('.portfolio-items:not(".carousel")').length > 0 || $(this).find('.wpb_gallery .portfolio-items').length > 0 || $(this).find('iframe').length > 0 ){
        var $that = $(this);
        
        $(this).find('.wpb_tab').show().css({'opacity':0,'height':'1px'});
        $(this).find('> ul li a').addClass('loading');
        
        setTimeout(function(){ 
          $that.find('.wpb_tab').hide().css({'opacity':1,'height':'auto'}); 
          $that.find('> ul li a').removeClass('loading');
          $that.find('> ul li:first-child a').trigger('click'); 
        },900);
      }
      
    });
  }
  setTimeout(tabbedInit,60);
  
  
  
  /* Toggles */
  $('body').on('click','.toggle h3 a', function(){
    
    if(!$(this).parents('.toggles').hasClass('accordion')) { 
      $(this).parents('.toggle').find('> div').slideToggle(300);
      $(this).parents('.toggle').toggleClass('open');
      
      //switch icon
      if( $(this).parents('.toggle').hasClass('open') ){
        $(this).find('i').attr('class','icon-minus-sign');
      } else {
        $(this).find('i').attr('class','icon-plus-sign');
      }
      
      return false;
    }
  });
  
  //accordion
  $('body').on('click','.accordion .toggle h3 a', function(){
    
    if($(this).parents('.toggle').hasClass('open')) return false;
    
    $(this).parents('.toggles').find('.toggle > div').slideUp(300);
    $(this).parents('.toggles').find('.toggle h3 a i').attr('class','icon-plus-sign');
    $(this).parents('.toggles').find('.toggle').removeClass('open');
    
    $(this).parents('.toggle').find('> div').slideDown(300);
    $(this).parents('.toggle').addClass('open');
    
    //switch icon
    if( $(this).parents('.toggle').hasClass('open') ){
      $(this).find('i').attr('class','icon-minus-sign');
    } else {
      $(this).find('i').attr('class','icon-plus-sign');
    }
    
    if($('#nectar_fullscreen_rows').length > 0) {
      clearTimeout($t);
      var $t = setTimeout(function(){ $(window).trigger('smartresize'); },400);
    }
    
    return false;
  });
  
  //accordion start open
  function accordionInit(){ 
    $('.accordion').each(function(){
      $(this).find('> .toggle').first().addClass('open').find('> div').show();
      $(this).find('> .toggle').first().find('a i').attr('class','icon-minus-sign');
    });
    
    
    $('.toggles').each(function() {
      
      var $isAccordion = ($(this).hasClass('accordion')) ? true : false;
      
      $(this).find('.toggle').each(function(){
        if($(this).find('> div .testimonial_slider').length > 0 || $(this).find('> div iframe').length > 0) {
          var $that = $(this);
          $(this).find('> div').show().css({'opacity':0,'height':'1px', 'padding':'0'});
          
          setTimeout(function(){
            $that.find('> div').hide().css({'opacity':1,'height':'auto', 'padding':'10px 14px'}); 
            if($isAccordion === true && $that.index() === 0) $that.find('> div').slideDown(300);
          },900);
        } 
      });
    });
    
  }
  accordionInit();
  
  
  
  /* Testimonial Slider */
  
  function nectarTestimonialSliders() {
    
    var $testimonialSliders = [];
    
    if( typeof NectarTestimonialSlider == 'undefined' ) { 
      return; 
    }
    
    $('.testimonial_slider').each(function(i){
      
      var $that_el = $(this);
      var $type = ( $(this).is('[data-style]') ) ? $(this).attr('data-style') : 'none';
      
      $testimonialSliders[i] = new NectarTestimonialSlider($that_el, $type);
      
      
      if( $(this).is('.disable-height-animation:not([data-style*="multiple_visible"])') ) {
        $testimonialSliders[i].testimonialSliderHeight(); 
        setTimeout($testimonialSliders[i].testimonialSliderHeight.bind($testimonialSliders[i]),500);
      }
      
      if( $(this).is('.testimonial_slider[data-style="multiple_visible_minimal"]') ) {
        $testimonialSliders[i].testimonialSliderHeightMinimalMult();
        setTimeout($testimonialSliders[i].testimonialSliderHeightMinimalMult.bind($testimonialSliders[i]),500);
      }
      
    });
  }
  nectarTestimonialSliders();
  
  
  
});