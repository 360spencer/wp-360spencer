/**
 * Simplified JS for basic element functionality.
 *
 * @package Salient WPBakery Addons
 * @author ThemeNectar
 */
 
 /* global jQuery */
 /* global Waypoint */
 /* global imagesLoaded */

jQuery(document).ready(function($){
  
  "use strict";
  
  var $body = $('body'),
  $window   = $(window);
  
  /**
  * Tabbed Section.
  *
  * @since 1.0
  */
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
      if($(this).find('.swiper-container').length === 0 && $(this).find('.testimonial_slider').length === 0 && $(this).find('.portfolio-items:not(".carousel")').length === 0 && $(this).find('.wpb_gallery .portfolio-items').length == 0 && $(this).find('iframe').length == 0){
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
  
  
  
  /**
  * Toggles.
  *
  * @since 1.0
  */
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
  
  // Accordion.
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
  
  // accordion start open
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
  
  
  
  /**
  * Testimonial Slider.
  *
  * @since 1.0
  */
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
  
  
  /**
  * Progress Bars
  *
  * @since 1.0
  */
  function progressBars() {
    
    $('.nectar-progress-bar').parent().each(function () {
      
      var $that = $(this);
      

        $that.find('.nectar-progress-bar .bar-wrap').css('opacity', '1');
      
        $that.find('.nectar-progress-bar').each(function (i) {
          
          var percent = $(this).find('span').attr('data-width'),
          $endNum 		= parseInt($(this).find('span strong i').text()),
          $that 			= $(this);
          
          $that.find('span').css({
            'width': percent + '%'
          });
          
          setTimeout(function () {
            
            $that.find('span strong').css({
              'opacity': 1
            });
            
          }, (i * 90));
          
          ////100% progress bar 
          if (percent === '100') {
            $that.find('span strong').addClass('full');
          }
        });
        
        $that.addClass('completed');
        
      
    });
  }
  progressBars();
  
  
  /**
  * Image Comparison.
  *
  * @since 1.0
  */
  function twentytwentyInit() {
    $('.twentytwenty-container').each(function () {
      var $that = $(this);
      
      if ($that.find('.twentytwenty-handle').length === 0) {
        $(this).imagesLoaded(function () {
          $that.twentytwenty();
        });
      }
      
    });
  }
  twentytwentyInit();
  
  
  
  // Team Member Fullscreen.
  function teamMemberFullscreen() {
    
    if ( $('.team-member').length === 0 ) {
      return;
    }
    
    // Open click event
    $body.on('click', '.team-member[data-style="bio_fullscreen"]', function () {
      
      if ($('.nectar_team_member_overlay').length > 0) {
        return;
      }
      
      var $usingBoxedClass  = ($('body > #boxed').length > 0) ? 'in-boxed' : null,
      $teamMemberMeta       = $(this).find('.nectar_team_bio').html(),
      $teamMemberImg        = ($(this).find('.nectar_team_bio_img[data-img-src]').length > 0) ? $(this).find('.nectar_team_bio_img').attr('data-img-src') : '';
      
      $body.append('<div class="nectar_team_member_overlay ' + $usingBoxedClass + '"><div class="inner-wrap"><div class="team_member_details"><div class="bio-inner"><span class="mobile-close"></span><h2>' + $(this).find('.team-meta h3').html() + '</h2><div class="title">' + $(this).find('.team-meta p').html() + '</div><div class="team-desc">' + $teamMemberMeta + '</div></div></div><div class="team_member_picture"><div class="team_member_image_bg_cover"></div><div class="team_member_picture_wrap"><div class="team_member_image"></div></div></div></div></div><div class="nectar_team_member_close ' + $usingBoxedClass + '"><div class="inner"></div></div>');
      
      if ($teamMemberImg.length > 0) {
        
        // Fade in img on load
        var teamTmpImg = new Image();
        teamTmpImg.src = $teamMemberImg;
        teamTmpImg.onload = function () {
          $('.nectar_team_member_overlay .team_member_image').css('opacity', '1');
        };
        $('.nectar_team_member_overlay .team_member_image').css({
          'background-image': 'url("' + $teamMemberImg + '")'
        });
      }
      
      var $headerNavSpace = 0;
      $('.nectar_team_member_overlay .inner-wrap').css({
        'padding-top': $headerNavSpace
      });
      
      // No-scroll class - ios ready
      if ($('.using-mobile-browser').length > 0) {
        $('body,html').addClass('nectar-no-scrolling');
      }
      
      teamFullscreenResize();
      
      // Transition in
      $('.nectar_team_member_overlay')
        .addClass('open')
        .addClass('animating');
      
      setTimeout(function () {
        $('.nectar_team_member_close').addClass('visible');
        $('.nectar_team_member_overlay').removeClass('animating');
      }, 500);
      
      // Bind close mousemove
      $(document).on('mousemove', teamMousemoveOn);
      
      
      if ($('.team-member[data-style="bio_fullscreen"]').length > 0 && navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/) ) {
        $('.nectar_team_member_overlay').addClass('on-mobile');
      }
      
    });
    
    // Close click event
    $body.on('click', '.nectar_team_member_overlay', function () {
      
      if (!$(this).hasClass('animating')) {
        
        $('.nectar_team_member_overlay').removeClass('open');
        $('.nectar_team_member_close').removeClass('visible');
        
        if ($('.using-mobile-browser').length > 0) {
          $('body,html').removeClass('nectar-no-scrolling');
        }
        
        setTimeout(function () {
          
          // Unbind close mousemove
          $(document).off('mousemove', teamMousemoveOn);
          
          $('.nectar_team_member_overlay, .nectar_team_member_close').remove();
          
        }, 820);
      }
    });
    
    if ($('.team-member[data-style="bio_fullscreen"]').length > 0) {
      $window.on('resize', teamFullscreenResize);
    }

  }
  
  
  /**
  * Team member element fullscreen resize event.
  *
  * @since 1.0
  */
  function teamFullscreenResize() {
    var $leftHeaderSize = ($('body[data-header-format="left-header"]').length > 0 && $window.width() > 1000) ? 275 : 0;
    $('.nectar_team_member_overlay').css({
      'width': $window.width() - $leftHeaderSize,
      'left': $leftHeaderSize
    });
  }
  
  
  /**
  * Team member element fullscreen close button follow on mousemove.
  *
  * @since 1.0
  */
  function teamMousemoveOn(e) {
    
    if ($('a:hover').length > 0) {
      $('.nectar_team_member_close .inner').removeClass('visible');
    } else {
      $('.nectar_team_member_close .inner').addClass('visible');
    }
    $('.nectar_team_member_close').css({
      left: e.pageX - 26,
      top: e.pageY - $window.scrollTop() - 29
    });
  }
  
  teamMemberFullscreen();
  
  
  /**
  * Page builder full height row option.
  *
  * @since 8.0
  */
  
  function vcFullHeightRow() {
    
    var $element = $(".vc_row-o-full-height:first");
    if ($element.length) {
      
      var windowHeight, offsetTop, fullHeight;
      windowHeight = $window.height();
      
      $(".vc_row-o-full-height").each(function () {
        
        offsetTop = $(this).offset().top;
        
        if (offsetTop < windowHeight && 
          $(this).hasClass('top-level')) {
            
          fullHeight = 100 - offsetTop / (windowHeight / 100);
          $(this).css("min-height", fullHeight + "vh");
          $(this).find('> .col.span_12').css("min-height", fullHeight + "vh");
          
        } else {
          
          $(this).css("min-height", windowHeight);
          $(this).find('> .col.span_12').css("min-height", windowHeight);
          
        }
        
      });
      
    }
    
  }
  
  
  /**
  * Page builder full height row init.
  *
  * @since 10.1
  */
  
  function vcFullHeightRowInit() {
    
    if( $('.vc_row-o-full-height').length > 0 ) {
      vcFullHeightRow();
      $window.on('smartresize', vcFullHeightRow);
    }
    
  }
  
  vcFullHeightRowInit();
  
  
  
});