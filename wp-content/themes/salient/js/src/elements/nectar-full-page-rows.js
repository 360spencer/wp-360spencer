/**
 * Salient "Page Full Screen Rows" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global Waypoint */
/* global vc_pieChart */

(function( $ ) {

  "use strict";
  
  function NectarFullScreenRows(waypoints,$mouseParallaxScenes,nectarLiquidBGFP,nectarDOMInfo,responsiveTooltips,$standAnimatedColTimeout,$svgIcons,animeAnimations) {
    
    this.$mouseParallaxScenes     = $mouseParallaxScenes;
    this.nectarDOMInfo            = nectarDOMInfo;
    this.waypoints                = waypoints;
    this.nectarLiquidBGFP         = nectarLiquidBGFP;
    this.responsiveTooltips       = responsiveTooltips;
    this.$standAnimatedColTimeout = $standAnimatedColTimeout;
    this.animeAnimations          = animeAnimations;
    this.$svgIcons                = $svgIcons;
    this.$usingFullScreenRows     = false;
    this.$frontEndEditorFPRDiv    = (window.vc_iframe) ? '> .vc_element': '> .wpb_row';
    this.$fpAnimationSpeed        = 850;
    this.overallHeight            = $(window).height();
    this.overallWidth             = $(window).width();
    this.$fpAnimation             = $('#nectar_fullscreen_rows').attr('data-animation');
    this.$svgResizeTimeout        = null;
    this.$disableFPonMobile       = ($('#nectar_fullscreen_rows[data-mobile-disable]').length > 0) ? $('#nectar_fullscreen_rows').attr('data-mobile-disable') : 'off';
    this.$onMobileBrowser         = navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/);
    this.activeIndex              = 0;
    this.prevIndex                = 0;

    if(!this.$onMobileBrowser) {
      this.$disableFPonMobile = 'off';
    }
    
    if(this.$disableFPonMobile != 'on') {
      
      this.$usingFullScreenRows = true;
      this.$names = [];
      this.$anchors = [];
      this.setFPNames();
      this.initFullPageFooter();
      this.fullscreenRowLogic();
      this.setAnimationSpeed();
      this.beforeInit();
      this.initNectarFP();
      this.bindSmartResize();
      this.afterInit();
      
    } else {
      
      this.mobileNameAlter();
      $('html,body').css({'height':'auto','overflow-y':'auto'});
      
    }
    
    
  }
  
  
  NectarFullScreenRows.prototype.setFPNavColoring = function(index,direction) {
    
    // Add classname onto header nav for custom state management.
    $('#header-outer').removeClass (function (index, className) {
        return (className.match (/(^|\s)fp-section-\S+/g) || []).join(' ');
    });
    $('#header-outer').addClass('fp-section-'+index);
    
    if($('#boxed').length > 0 && this.overallWidth > 750) { 
      return; 
    }
    
    if($('#nectar_fullscreen_rows '+ this.$frontEndEditorFPRDiv+':nth-child('+index+')').find('.span_12.light').length > 0) {
      
      $('#fp-nav').addClass('light-controls');
      if(direction == 'up') {
        $('#header-outer.dark-slide').removeClass('dark-slide');
      }
      else {
        setTimeout(function(){ 
          $('#header-outer.dark-slide').removeClass('dark-slide'); 
        },520);
      }
      
    } 
    
    else {
      
      $('#fp-nav.light-controls').removeClass('light-controls');
      
      if(direction == 'up') {
        $('#header-outer').addClass('dark-slide');
      }
      else {
        setTimeout(function(){ 
          $('#header-outer').addClass('dark-slide'); 
        },520);
      }
    }
    
    // Handle nectar slider coloring
    if($('#nectar_fullscreen_rows '+ this.$frontEndEditorFPRDiv+':nth-child('+index+')').find('.nectar-slider-wrap[data-fullscreen="true"]').length > 0) {
      
      var $currentSlider = $('#nectar_fullscreen_rows '+ this.$frontEndEditorFPRDiv+':nth-child('+index+')').find('.nectar-slider-wrap[data-fullscreen="true"]');

      if($currentSlider.find('.swiper-slide-active[data-color-scheme="light"]').length > 0) {
        $('#header-outer').removeClass('dark-slide');
      } else if($currentSlider.find('.swiper-slide-active[data-color-scheme="dark"]').length > 0) {
        $('#header-outer').addClass('dark-slide');
      }
      
    } 
    
  };
  
  NectarFullScreenRows.prototype.setFPNames = function() {
    
    this.$anchors = [];
    this.$names = [];
    var that = this;
    
    $('#nectar_fullscreen_rows '+ this.$frontEndEditorFPRDiv).each(function(i){
      
      var $id = ($(this).is('[data-fullscreen-anchor-id]')) ? $(this).attr('data-fullscreen-anchor-id') : '';
      
      // Anchor checks
      if($('#nectar_fullscreen_rows[data-anchors="on"]').length > 0) {
        if($id.indexOf('fws_') == -1) { 
          that.$anchors.push($id); 
        }
        else { 
          that.$anchors.push('section-'+(i+1)); 
        }
      }
      
      // Name checks
      if($(this).find('.full-page-inner-wrap[data-name]').length > 0) {
        that.$names.push($(this).find('.full-page-inner-wrap').attr('data-name'));
      }
      else {
        that.$names.push(' ');
      }
      
    });
  };
  
  
  NectarFullScreenRows.prototype.mobileNameAlter = function() {
    
    // Change anchor link IDs for when disabled on mobile
    if(this.$disableFPonMobile == 'on' && $('#nectar_fullscreen_rows').length > 0) {
      
      $('#nectar_fullscreen_rows > .wpb_row[data-fullscreen-anchor-id]').each(function(){
        if($(this).attr('data-fullscreen-anchor-id').length > 0)
        $(this).attr('id',$(this).attr('data-fullscreen-anchor-id'));
      });
      
      
      // Remove main content row padding
      $('.container-wrap .main-content > .row').css({'padding-bottom':'0'});
      
      // Extra padding for first row is using transparent header
      if( $('#nectar_fullscreen_rows > .wpb_row:nth-child(1)').length > 0 && 
      $('#header-outer[data-transparent-header="true"]').length > 0 && 
      !$('#nectar_fullscreen_rows > .wpb_row:nth-child(1)').hasClass('full-width-content') ) {
        $('#nectar_fullscreen_rows > .wpb_row:nth-child(1)').addClass('extra-top-padding');
      }
    }
    
  };
  
  
  
  NectarFullScreenRows.prototype.initFullPageFooter = function() {
    var $footerPos = $('#nectar_fullscreen_rows').attr('data-footer');
    
    if($footerPos == 'default') {
      
      $('#footer-outer')
        .appendTo('#nectar_fullscreen_rows')
        .addClass('fp-auto-height')
        .addClass('fp-section')
        .addClass('wpb_row')
        .attr('data-anchor','')
        .wrapInner('<div class="span_12" />')
        .wrapInner('<div class="container" />')
        .wrapInner('<div class="full-page-inner" />')
        .wrapInner('<div class="full-page-inner-wrap" />')
        .wrapInner('<div class="full-page-inner-wrap-outer" />');
      
      // Set BG img.
      var $footerBG = $('#footer-outer').css('background-image');
      if( $footerBG.length > 0 && $footerBG !== 'none' && $('#footer-outer').find('.full-page-inner-wrap').length > 0 ) {

        var $footerBGOpacity = ( $('#footer-outer[data-bg-img-overlay]').length > 0 ) ? parseFloat($('#footer-outer').attr('data-bg-img-overlay')) : 0.5;
        
        $('#footer-outer').find('.full-page-inner-wrap').prepend('<div class="footer-bg-wrap"></div>');
        
        $('#footer-outer .full-page-inner > .container').css('z-index','10');
        $('#footer-outer .footer-bg-wrap').css({
          'background-image': $footerBG,
          'background-size': 'cover',
          'background-position' : 'center',
          'position' : 'absolute',
          'left' : '0',
          'top' : '0',
          'width' : '100%',
          'height' : '100%',
          'display': 'block',
          'content': ' ',
          'z-index' : '1',
          'opacity' : 1 - $footerBGOpacity
        });
      } 
       
    }
    
    else if($footerPos == 'last_row') {
      
      $('#footer-outer').remove();
      $('#nectar_fullscreen_rows > .wpb_row:last-child')
        .attr('id','footer-outer')
        .addClass('fp-auto-height');
    } 
    
    else {
      $('#footer-outer').remove();
    }
    
  };	 
  
  
  NectarFullScreenRows.prototype.fullscreenRowLogic = function() {
    
    var $rowNum;
    
    $('.full-page-inner-wrap .full-page-inner > .span_12 > .wpb_column').each(function(){
      if($(this).find('> .vc_column-inner > .wpb_wrapper').find('> .wpb_row').length > 0) {
        
        // Add class for css
        $(this).find('> .vc_column-inner > .wpb_wrapper').addClass('only_rows');
        
        // Set number of rows for css
        $rowNum = $(this).find('> .vc_column-inner > .wpb_wrapper').find('> .wpb_row').length;
        $(this).find('> .vc_column-inner > .wpb_wrapper').attr('data-inner-row-num',$rowNum);
      } 
      
      else if($(this).find('> .column-inner-wrap > .column-inner > .wpb_wrapper').find('> .wpb_row').length > 0) {
        
        // Add class for css
        $(this).find('> .column-inner-wrap > .column-inner > .wpb_wrapper').addClass('only_rows');
        
        // Set number of rows for css
        $rowNum = $(this).find('> .column-inner-wrap > .column-inner > .wpb_wrapper').find('> .wpb_row').length;
        $(this).find('> .column-inner-wrap > .column-inner > .wpb_wrapper').attr('data-inner-row-num',$rowNum);
      }
    });
    
  };
  
  
  
  NectarFullScreenRows.prototype.fullHeightRowOverflow = function() {
    
    var that = this;
    
    // Handle rows with full height that are larger than viewport
    if($(window).width() >= 1000) {
      
      $('#nectar_fullscreen_rows > .wpb_row .full-page-inner-wrap[data-content-pos="full_height"]').each(function(){
        
        // Reset mobile calcs incase user plays with window resize
        $(this).find('> .full-page-inner').css('height','100%');
        
        var maxHeight       = that.overallHeight,
        columnPaddingTop    = 0,
        columnPaddingBottom = 0;
        
        
        if($('#nectar_fullscreen_rows').attr('data-animation') == 'none') {
          $(this).find('> .full-page-inner > .span_12 ').css('height','100%');
        }
        else {
          $(this).find('> .full-page-inner > .span_12 ').css('height',that.overallHeight);
        }
        
        $(this).find('> .full-page-inner > .span_12 > .wpb_column > .vc_column-inner > .wpb_wrapper').each(function(){
          columnPaddingTop = parseInt($(this).parents('.wpb_column').css('padding-top'));
          columnPaddingBottom = parseInt($(this).parents('.wpb_column').css('padding-bottom'));
          
          maxHeight = maxHeight > $(this).height() + columnPaddingTop + columnPaddingBottom ? maxHeight : $(this).height() + columnPaddingTop + columnPaddingBottom;
        });
        
        
        if(maxHeight > that.overallHeight) {
          $(this).find('> .full-page-inner > .span_12').height(maxHeight).css('float','none');
        }
        
      });
      
    }
    
    else {
      
      // Mobile min height set
      $('#nectar_fullscreen_rows > .wpb_row').each(function(){
        
        var $totalColHeight = 0;
        
        $(this).find('.fp-scrollable > .fp-scroller > .full-page-inner-wrap-outer > .full-page-inner-wrap[data-content-pos="full_height"] > .full-page-inner > .span_12 > .wpb_column').each(function(){
          $totalColHeight += $(this).outerHeight(true);
        });
        
        $(this).find('.fp-scrollable > .fp-scroller > .full-page-inner-wrap-outer > .full-page-inner-wrap > .full-page-inner').css('height','100%');
        
        if($totalColHeight > $(this).find('.fp-scrollable > .fp-scroller > .full-page-inner-wrap-outer > .full-page-inner-wrap > .full-page-inner').height()) {
          $(this).find('.fp-scrollable  > .fp-scroller > .full-page-inner-wrap-outer > .full-page-inner-wrap > .full-page-inner').height($totalColHeight);
        }
        
      });
    }
    
  };
  
  NectarFullScreenRows.prototype.recalculateScrollable = function() {
    
    setTimeout(function(){
      
      $('.wpb_row:not(.last-before-footer) .fp-scrollable').each(function(){
        var $scrollable = $(this).data('iscrollInstance');
        $scrollable.refresh();
      });
      
    },200);
    
    this.fullHeightRowOverflow();
    
  };
  
  NectarFullScreenRows.prototype.bindSmartResize = function() {
    
    $(window).off('smartresize.nectarFullScreenCalcs'); 
    $(window).on('smartresize.nectarFullScreenCalcs',this.recalculateScrollable.bind(this));
    
  };
  
  
  NectarFullScreenRows.prototype.fullscreenElementSizing = function() {
    
    // Nectar slider
    var $nsSelector = '.nectar-slider-wrap[data-fullscreen="true"][data-full-width="true"], .nectar-slider-wrap[data-fullscreen="true"][data-full-width="boxed-full-width"]';
    if($('.nectar-slider-wrap[data-fullscreen="true"][data-full-width="true"]').length > 0 || $('.nectar-slider-wrap[data-fullscreen="true"][data-full-width="boxed-full-width"]').length > 0) {
      
      if($('#nectar_fullscreen_rows .wpb_row').length > 0) {
        $($nsSelector).find('.swiper-container').attr('data-height',$('#nectar_fullscreen_rows .wpb_row').height()+1);
      }
      
      $(window).trigger('resize.nsSliderContent');
      
      $($nsSelector).parents('.full-page-inner').addClass('only-nectar-slider');
    }
    
  };
  
  NectarFullScreenRows.prototype.setAnimationSpeed = function() {
    
    switch($('#nectar_fullscreen_rows').attr('data-animation-speed')) {
      case 'slow':
      this.$fpAnimationSpeed = 1150;
      break;
      case 'medium':
      this.$fpAnimationSpeed = 850;
      break;
      case 'fast':
      this.$fpAnimationSpeed = 650;
      break;
      default:
      this.$fpAnimationSpeed = 850;
    }
    
  };
  
  
  NectarFullScreenRows.prototype.firefoxDrawEl = function() {
    
    var $drawTheEl = $('#nectar_fullscreen_rows > div:first-child').height();
    if($('#nectar_fullscreen_rows.trans-animation-active').length > 0){
      requestAnimationFrame(this.firefoxDrawEl.bind(this));
    }
    
  };
  
  NectarFullScreenRows.prototype.beforeInit = function() {
    
    // Kenburns first slide 
    $('#nectar_fullscreen_rows[data-row-bg-animation="ken_burns"] > .wpb_row:first-child .row-bg.using-image').addClass('kenburns');
    
    setTimeout(function(){
      // Ken burns first slide
      $('#nectar_fullscreen_rows[data-row-bg-animation="ken_burns"] > .wpb_row:first-child .row-bg.using-image').removeClass('kenburns');
    },500);
    
    // Remove kenburns from safari
    if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
      $('#nectar_fullscreen_rows[data-row-bg-animation="ken_burns"]').attr('data-row-bg-animation','none');
    }
    
  };
  
  NectarFullScreenRows.prototype.afterInit = function() {
    
    var that = this;
    
    if(window.vc_iframe) { 
      setTimeout(function(){
        that.setFPNavColoring(1,'na'); 
      },500);
    }
    else {
      this.setFPNavColoring(1,'na');
    }
    
    this.fullscreenElementSizing();
    
    // Slide out right OCM material nav compat
    if($('body[data-slide-out-widget-area-style="slide-out-from-right"].material').length > 0) {
      
      $('#slide-out-widget-area .off-canvas-menu-container').find("a[href*='#']").on('click',function(){
        
        var $link_hash = $(this).prop("hash");	
        
        if($link_hash != '#' && 
        $link_hash.indexOf("#") != -1 && 
        $('div[data-fullscreen-anchor-id="'+$link_hash.substr($link_hash.indexOf("#")+1)+'"]').length > 0) {
          
          if($('body.material-ocm-open').length > 0) {
            
            $('body > .slide_out_area_close').addClass('non-human-allowed').trigger('click');
            
            setTimeout(function(){
              $('body > .slide_out_area_close').removeClass('non-human-allowed');
            },100);
            
          } 
          
        } // if a section has been found
        
      }); // click
    }
    
    
  };
  
  
  
  NectarFullScreenRows.prototype.FPActiveMenuItems = function(index) {
    
    if(!$('#nectar_fullscreen_rows[data-anchors="on"]').length > 0 || !index) {
      return;
    }
    
    var $hash = window.location.hash;
    var $hashSubstrng = ($hash && $hash.length > 0) ? $hash.substring(1,$hash.length) : '';
    
    if($('body:not(.mobile) #header-outer[data-has-menu="true"]').length > 0 && 
    $('#nectar_fullscreen_rows > .wpb_row:nth-child('+index+')[data-fullscreen-anchor-id]').length > 0 && 
    $('header#top nav > ul.sf-menu > li').find('> a[href$="#'+$hashSubstrng+'"]').length > 0 ) {
      
      $('header#top nav > ul.sf-menu > li').removeClass('current-menu-item');
      
      $('header#top nav > ul.sf-menu > li')
        .find('> a[href$="'+$hashSubstrng+'"]')
        .parent()
        .addClass('current-menu-item');
      
    }
    
  };
  
  
  NectarFullScreenRows.prototype.resetWaypoints = function() {

    var that = this;
    
    // General
    $('.nectar-waypoint-el, .nectar-waypoint-el *').removeClass('animated-in');

    // Animated columns / imgs
    $('img.img-with-animation.animated-in:not([data-animation="none"])').css({'transition':'none'});
    $('img.img-with-animation.animated-in:not([data-animation="none"]), .img-with-aniamtion-wrap:not([data-animation="none"]) .hover-wrap').css({'opacity':'','transform':''}).removeClass('animated-in');
    $('.img-with-aniamtion-wrap[data-animation*="reveal-from-"]').removeClass('animated-in');
    $('.img-with-aniamtion-wrap[data-animation*="reveal-from-"] img.img-with-animation').css({'transition':''});
    $('.col.has-animation.animated-in:not([data-animation*="reveal"]), .wpb_column.has-animation.animated-in:not([data-animation*="reveal"])').css({'transition':'none'});
    $('.col.has-animation.animated-in:not([data-animation*="reveal"]), .wpb_column.has-animation.animated-in:not([data-animation*="reveal"]), .nectar_cascading_images .cascading-image:not([data-animation="none"]) .inner-wrap').css({'opacity':'0','transform':'none','left':'auto','right':'auto'}).removeClass('animated-in');	
    $('.col.has-animation.boxed:not([data-animation*="reveal"]), .wpb_column.has-animation.boxed:not([data-animation*="reveal"])').addClass('no-pointer-events');
    $('.column-image-bg-wrap[data-bg-animation*="ro-reveal-from-"]').parents('.vc_column-inner').removeClass('revealed-bg');
    
    // Row BG animations
    $('.row-bg-wrap[data-bg-animation]:not([data-bg-animation="none"]) .inner-wrap.using-image').removeClass('animated-in');
    $('.row-bg-wrap[data-bg-animation]:not([data-bg-animation="none"]) .inner-wrap.using-image .row-bg').removeClass('animated-in');
    $('.column-image-bg-wrap[data-bg-animation]:not([data-bg-animation="none"]) .inner-wrap').removeClass('animated-in');
    
    // Reveal columns
    $('.wpb_column.has-animation[data-animation*="reveal"], .nectar_cascading_images').removeClass('animated-in');
    if(this.overallWidth > 1000 && $('.using-mobile-browser').length == 0 && $('body[data-flex-cols="true"]').length == 0 ) {
      $('.wpb_column.has-animation[data-animation="reveal-from-bottom"] > .column-inner-wrap').css({'transition':'none','transform':'translate(0, 100%)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-bottom"] > .column-inner-wrap > .column-inner').css({'transition':'none','transform':'translate(0, -90%)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-top"] > .column-inner-wrap').css({'transition':'none','transform':'translate(0, -100%)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-top"] > .column-inner-wrap > .column-inner').css({'transition':'none','transform':'translate(0, 90%)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-left"] > .column-inner-wrap').css({'transition-duration':'0s','transform':'translate(-100%, 0)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-left"] > .column-inner-wrap > .column-inner').css({'transition-duration':'0s','transform':'translate(90%, 0)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-right"] > .column-inner-wrap').css({'transition-duration':'0s','transform':'translate(100%, 0)'});
      $('.wpb_column.has-animation[data-animation="reveal-from-right"] > .column-inner-wrap > .column-inner').css({'transition-duration':'0s','transform':'translate(-90%, 0)'});
    } else if( this.overallWidth > 1000 && $('.using-mobile-browser').length == 0 && $('body[data-flex-cols="true"]').length > 0) {
      $('.wpb_column.has-animation[data-animation*="reveal"] > .vc_column-inner').css({'transform':''});
    }
    
    $('.wpb_column.has-animation[data-animation*="reveal"] > .column-inner-wrap, .wpb_column.has-animation[data-animation*="reveal"] > .column-inner-wrap > .column-inner').removeClass('no-transform');
    
    // WPBakery waypoints
    $('.wpb_animate_when_almost_visible.animated').removeClass('wpb_start_animation').removeClass('animated');
    
    // Column borders
    $('.wpb_column[data-border-animation="true"] .border-wrap.animation').removeClass('animation').removeClass('completed');
    
    // Milestone
    $('.nectar-milestone.animated-in').removeClass('animated-in').removeClass('in-sight');
    $('.nectar-milestone .symbol').removeClass('in-sight');
    
    // Fancy ul
    $('.nectar-fancy-ul[data-animation="true"]').removeClass('animated-in');
    $('.nectar-fancy-ul[data-animation="true"] ul li').css({'opacity':'0','left':'-20px'});
    
    // Fancy box.
    $('.nectar-fancy-box.has-animation').removeClass('animated-in');

    // Progress bars
    $('.nectar-progress-bar').removeClass('completed');
    $('.nectar-progress-bar .bar-wrap > span').css({'width':'0px'});
    $('.nectar-progress-bar .bar-wrap > span > strong').css({'opacity':'0'});
    
    // Clients
    $('.clients.fade-in-animation').removeClass('animated-in');
    $('.clients.fade-in-animation > div').css('opacity','0');
    
    // Carousel
    $('.owl-carousel[data-enable-animation="true"]').removeClass('animated-in');
    $('.owl-carousel[data-enable-animation="true"] .owl-stage > .owl-item').css({'transition':'none','opacity':'0','transform':'translate(0, 70px)'});
    
    // Dividers
    $('.divider-small-border[data-animate="yes"], .divider-border[data-animate="yes"]').removeClass('completed').css({'transition':'none','transform':'scale(0,1)'});
    
    // Icon list
    $('.nectar-icon-list').removeClass('completed');
    $('.nectar-icon-list-item').removeClass('animated');
    
    // Portfolio
    $('.portfolio-items .col').removeClass('animated-in');
    
    // Split line
    $('.nectar-split-heading').removeClass('animated-in');
    $('.nectar-split-heading .heading-line > div').css({'transform':'translate(0,200%)'});
    $('.nectar-split-heading[data-animation-type="line-reveal-by-space"] .inner').css({'transform':'translate(0,1.2em)'});
    $('.nectar-split-heading[data-animation-type="line-reveal-by-space"][data-text-effect="letter-reveal-top"] .inner').css({'transform':''});
    $('.nectar-split-heading[data-animation-type="line-reveal-by-space"][data-text-effect="letter-reveal-bottom"] .inner').css({'transform':''});
    $('.nectar-text-inline-images__marker').removeClass('animated-in');
    
    // Rotating Text.
    $('.nectar-rotating-words-title.element_stagger_words').removeClass('animated-in');
    $('.nectar-rotating-words-title.element_stagger_words .text-wrap > span').css({'transform':'translate(0,1.2em)'});
    
    // Woo Carousel
    $('.nectar-woo-flickity[data-animation*="fade"]').removeClass('animated-in');
    $('.nectar-woo-flickity[data-animation="fade-in-bottom"] ul.products .flickity-cell .product').css({'opacity':'0','transform':'translate3d(0,70px,0)'});
    $('.nectar-woo-flickity[data-animation="fade-in-side"] ul.products .flickity-cell .product').css({'opacity':'0','transform':'translate3d(70px,0,0)'});
    
    // Image with hotspots
    $('.nectar_image_with_hotspots[data-animation="true"]').removeClass('completed');
    $('.nectar_image_with_hotspots[data-animation="true"] .nectar_hotspot_wrap').removeClass('animated-in');
    
    // Animated titles
    $('.nectar-animated-title').removeClass('completed');
    
    // Highlighted text
    $('.nectar-highlighted-text em').removeClass('animated');
    
    // Post grid.
    $('.nectar-post-grid-filters:not([data-animation="none"])').removeClass('animated-in');
    $('.nectar-post-grid:not([data-animation="none"]) .nectar-post-grid-item').removeClass('animated-in');
    $('.nectar-post-grid-wrap').removeClass('finished-animating');
    
    if($('.vc_pie_chart').length > 0) {
      vc_pieChart();
    }
    
    $('.col.has-animation:not([data-animation*="reveal"]), .wpb_column.has-animation:not([data-animation*="reveal"])').each(function(i) {
      // Clear previous timeout (needed for fullscreen rows)
      clearTimeout(that.$standAnimatedColTimeout[i]); 
    });

    if( this.animeAnimations && this.animeAnimations.length > 0 ) {
      $.each(this.animeAnimations, function(k, el){
       el.reset();
      });
    }
    
    
  };
  
  
  NectarFullScreenRows.prototype.fullscreenFooterCalcs = function() {
    if($('#footer-outer.active').length > 0) {
      
      $('.last-before-footer')
        .addClass('fp-notransition')
        .css('transform','translateY(-'+$('#footer-outer').height()+'px)');
        
      setTimeout(function(){
        $('.last-before-footer').removeClass('fp-notransition');
      },10);
      
    }
  };
  
  
  NectarFullScreenRows.prototype.stopMouseParallax = function() {
    $.each(this.$mouseParallaxScenes,function(k,v){
      v.parallax('disable');
    });
  };
  
  NectarFullScreenRows.prototype.startMouseParallax = function() {
    if($('#nectar_fullscreen_rows > .wpb_row.active .nectar-parallax-scene').length > 0) {
      $.each(this.$mouseParallaxScenes,function(k,v){
        v.parallax('enable');
      });
    }
  };
  
  
  
  NectarFullScreenRows.prototype.initNectarFP = function() {
    
    var that = this;
    
    if(window.vc_iframe) {
      setTimeout(function(){
        $('html,body').css({
          'height':'100%',
          'overflow-y':'hidden'
        });
      },100);
      
      // Remove scrolling to help performance of FE editor
      $('body,html').on("mousewheel.removeScroll", function() {
        return false;
      });
      
    }
    
    // Move row IDs onto parents for front end editor
    if($('body.vc_editor').length > 0) {
      
      $('#nectar_fullscreen_rows > .vc_empty-placeholder').remove();
      
      $('#nectar_fullscreen_rows > .vc_element').each(function(){
        var innerRowID = $(this).find('> .wpb_row').attr('id');
        $(this).attr('id',innerRowID);
      });
    }
    
    
    $('.container-wrap, .container-wrap .main-content > .row').css({
      'padding-bottom':'0', 
      'margin-bottom': '0'
    });
    
    var autoScrollBool = true;

    if( that.$fpAnimation == 'free-scroll' ) {
      autoScrollBool = false;
    }

    var canTriggerAfterLoad = true;

    $('#nectar_fullscreen_rows').fullpage({
      sectionSelector: '#nectar_fullscreen_rows '+this.$frontEndEditorFPRDiv,
      navigation: true,
      css3: true,
      scrollingSpeed: this.$fpAnimationSpeed,
      anchors: this.$anchors,
      scrollOverflow: true,
      navigationPosition: 'right',
      navigationTooltips: this.$names,
      autoScrolling: autoScrollBool,
      afterLoad: function(anchorLink, index){ 
        
        if( canTriggerAfterLoad == false ) {
          return;
        }
        that.activeIndex = index;
        
        if($('#nectar_fullscreen_rows').hasClass('afterLoaded')) {
          
          // Ensure no scrolling body occurs
          if( that.$fpAnimation != 'free-scroll' ) {
            if(that.nectarDOMInfo.scrollTop != 0) {
              window.scrollTo(0,0);
            }
            
            // Reset slim scroll to top
            $('.wpb_row:not(.last-before-footer):not(:nth-child('+index+')) .fp-scrollable').each(function(){
              var $scrollable = $(this).data('iscrollInstance');
              $scrollable.scrollTo(0,0);
            });
         }
          
          // Reset carousel
          $('.wpb_row:not(:nth-child('+index+')) .owl-carousel').trigger('to.owl.carousel',[0]);
          
          var $row_id = $('#nectar_fullscreen_rows > .wpb_row:nth-child('+index+')').attr('id');
          
          $('#nectar_fullscreen_rows '+that.$frontEndEditorFPRDiv)
            .removeClass('transition-out')
            .removeClass('trans');
          
          
          $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':nth-child('+index+')').removeClass('next-current');
          $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':nth-child('+index+') .full-page-inner-wrap-outer').css({'height': '100%'});
          $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +' .full-page-inner-wrap-outer').css({'transform':'none'});
          
          // Handle waypoints
          if($row_id != 'footer-outer' && 
             $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':nth-child('+index+').last-before-footer').length == 0
             && that.activeIndex !== that.prevIndex ) {
              
              that.waypoints();
              
              if(!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/) && !that.nectarDOMInfo.usingFrontEndEditor) {
            
                that.resetWaypoints();
                Waypoint.destroyAll();
                that.startMouseParallax();
              }

              if(!that.nectarDOMInfo.usingFrontEndEditor) {
                that.nectarLiquidBGFP();
              }

              that.responsiveTooltips();
              $(window).trigger('nectar-waypoints-reinit');
              $(window).trigger('fp-section-init');
          }
          
          if($row_id !='footer-outer') {
            $('#nectar_fullscreen_rows ' + that.$frontEndEditorFPRDiv).removeClass('last-before-footer').css('transform','initial');
            
            // Reset animation attrs
            if(!window.vc_iframe) {
              
              $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':not(.active):not(#footer-outer)').css({
                'transform':'translateY(0)',
                'left':'-9999px', 
                'transition': 'none', 
                'opacity':'1', 
                'will-change':'auto'
              });
              $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':not(#footer-outer)').find('.full-page-inner-wrap-outer').css({
                'transition': 'none',  
                'transform':'none', 
                'will-change':'auto'
              });
              $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':not(#footer-outer)').find('.fp-tableCell').css({
                'transition': 'none', 
                'transform':'none', 
                'will-change':'auto'
              });
              
            }
            
            // Stacking fix
            $('#nectar_fullscreen_rows '+ that.$frontEndEditorFPRDiv +':not(#footer-outer)')
            .find('.full-page-inner-wrap-outer > .full-page-inner-wrap > .full-page-inner > .container')
            .css({'backface-visibility':'visible', 'z-index':'auto'});
            
          }
        } else {
          
          that.fullHeightRowOverflow();
          that.overallHeight = $('#nectar_fullscreen_rows').height();
          $('#nectar_fullscreen_rows').addClass('afterLoaded');
          
          // For users that have scrolled down prior to turning on full page
          setTimeout(function(){ window.scrollTo(0,0); },1800);
          
          // Ken burns first slide fix
          $('#nectar_fullscreen_rows[data-row-bg-animation="ken_burns"] '+ that.$frontEndEditorFPRDiv +':first-child .row-bg.using-image').removeClass('kenburns');
          
          // Handle fullscreen elements
          that.fullscreenElementSizing();
          
          
        }
        
        
        $('#nectar_fullscreen_rows').removeClass('nextSectionAllowed');
        
        canTriggerAfterLoad = false;

        setTimeout(function(){
          canTriggerAfterLoad = true;
        }, 200);
        
      },
      onLeave: function(index, nextIndex, direction){ 
        
        if($('.fp-section.active').length > 0) {
          that.prevIndex = index;
        }
        
        $('#nectar_fullscreen_rows').addClass('trans-animation-active');
        
        var $row_id = $('#nectar_fullscreen_rows ' + that.$frontEndEditorFPRDiv + ':nth-child('+nextIndex+')').attr('id');
        var $indexRow = $('#nectar_fullscreen_rows ' + that.$frontEndEditorFPRDiv + ':nth-child('+index+')');
        var $nextIndexRow = $('#nectar_fullscreen_rows ' + that.$frontEndEditorFPRDiv + ':nth-child('+nextIndex+')');
        var $nextIndexRowInner = $nextIndexRow.find('.full-page-inner-wrap-outer');
        var $nextIndexRowFpTable = $nextIndexRow.find('.fp-tableCell');
        
        // Mobile/safari fix
        var $transformProp = (!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) ? 'transform' : 'all'; 
        
        if( $row_id == 'footer-outer') {
          $indexRow.addClass('last-before-footer'); 
          $('#footer-outer').css('opacity','1');
        } else {
          $('#nectar_fullscreen_rows '+that.$frontEndEditorFPRDiv+'.last-before-footer').css('transform','translateY(0px)');
          $('#footer-outer').css('opacity','0');
        }
        if( $indexRow.attr('id') == 'footer-outer') {
          
          $('#footer-outer').css({
            'transition': $transformProp+' 460ms cubic-bezier(0.60, 0.23, 0.2, 0.93)', 
            'backface-visibility': 'hidden'
          });
          $('#footer-outer').css({'transform': 'translateY(45%) translateZ(0)'});
        }
        
        
        // Stacking fix
        if($nextIndexRow.attr('id') != 'footer-outer') {
          $nextIndexRowFpTable.find('.full-page-inner-wrap-outer > .full-page-inner-wrap > .full-page-inner > .container').css({'backface-visibility':'hidden', 'z-index':'110'});
        }
        
        // Animation
        if($nextIndexRow.attr('id') != 'footer-outer' &&
         $indexRow.attr('id') != 'footer-outer' && 
         $('#nectar_fullscreen_rows[data-animation="none"]').length == 0 &&
         $('#nectar_fullscreen_rows[data-animation="free-scroll"]').length == 0 ) {
          
          // Scrolling down
          if(direction == 'down') {
            
            if(that.$fpAnimation == 'parallax') {
              
              $indexRow.css({'transition': $transformProp+' '+that.$fpAnimationSpeed+'ms cubic-bezier(.29,.23,.13,1)', 'will-change':'transform', 'transform':'translateZ(0)' ,'z-index': '100'});
              setTimeout(function() { 
                $indexRow.css({'transform': 'translateY(-50%) translateZ(0)'});
              }, 60);
              
              $nextIndexRow.css({
                'z-index':'1000',
                'top':'0',
                'left':'0'
              });
              $nextIndexRowFpTable.css({
                'transform':'translateY(100%) translateZ(0)', 
                'will-change':'transform'
              });
              $nextIndexRowInner.css({
                'transform':'translateY(-50%) translateZ(0)', 
                'will-change':'transform'
              });
              
            } else if(that.$fpAnimation == 'zoom-out-parallax') {
              
              $indexRow.css({
                'transition': 'opacity '+that.$fpAnimationSpeed+'ms cubic-bezier(0.37, 0.31, 0.2, 0.85), transform '+that.$fpAnimationSpeed+'ms cubic-bezier(0.37, 0.31, 0.2, 0.85)', 
                'z-index': '100', 
                'will-change':'transform'
              });
              
              setTimeout(function() { 
                $indexRow.css({
                  'transform': 'scale(0.77) translateZ(0)', 
                  'opacity': '0'
                });
                
              }, 60);
              
              $nextIndexRow.css({
                'z-index':'1000',
                'top':'0',
                'left':'0'
              });
              $nextIndexRowFpTable.css({
                'transform':'translateY(100%) translateZ(0)', 
                'will-change':'transform'
              });
              
              $nextIndexRowInner.css({
                'transform':'translateY(-50%) translateZ(0)',  
                'will-change':'transform'
              });
              
            } 
            
          }
          
          //scrolling up
          else {
            
            if( that.$fpAnimation == 'parallax' ) {
              $indexRow.css({
                'transition': $transformProp+' '+that.$fpAnimationSpeed+'ms cubic-bezier(.29,.23,.13,1)', 
                'z-index': '100', 
                'will-change':'transform'
              });
              
              setTimeout(function() { 
                $indexRow.css({'transform': 'translateY(50%) translateZ(0)'});
              }, 60);
              
              $nextIndexRow.css({'z-index':'1000','top':'0','left':'0'});
              $nextIndexRowFpTable.css({'transform':'translateY(-100%) translateZ(0)','will-change':'transform'});
              $nextIndexRowInner.css({'transform':'translateY(50%) translateZ(0)','will-change':'transform'});
            }
            
            else if(that.$fpAnimation == 'zoom-out-parallax') {
              
              $indexRow.css({'transition': 'opacity '+that.$fpAnimationSpeed+'ms cubic-bezier(0.37, 0.31, 0.2, 0.85), transform '+that.$fpAnimationSpeed+'ms cubic-bezier(0.37, 0.31, 0.2, 0.85)', 'z-index': '100', 'will-change':'transform'});
              
              setTimeout(function() { 
                $indexRow.css({'transform': 'scale(0.77) translateZ(0)', 'opacity': '0'});
              }, 60);
              
              $nextIndexRow.css({
                'z-index':'1000',
                'top':'0',
                'left':'0'
              });
              $nextIndexRowFpTable.css({
                'transform':'translateY(-100%) translateZ(0)', 
                'will-change':'transform'
              });
              $nextIndexRowInner.css({
                'transform':'translateY(50%) translateZ(0)', 
                'will-change':'transform'
              });
            } 
            
          }
          
          setTimeout(function() { 
            
            $nextIndexRowFpTable.css({
              'transition':$transformProp+' '+that.$fpAnimationSpeed+'ms cubic-bezier(.29,.23,.13,1) 0ms', 
              'transform':'translateY(0%) translateZ(0)'
            });
            
            if(that.$fpAnimation != 'none') { 
              $nextIndexRowInner.css({
                'transition':$transformProp+' '+that.$fpAnimationSpeed+'ms cubic-bezier(.29,.23,.13,1) 0ms', 
                'transform':'translateY(0%) translateZ(0)'
              });
            }

          },60);
          
        }
        
        // Adjust transform if larger than row height for parallax
        if($('#nectar_fullscreen_rows[data-animation="none"]').length == 0 &&
           $('#nectar_fullscreen_rows[data-animation="free-scroll"]').length == 0 && 
           $nextIndexRow.find('.fp-scrollable').length > 0) {
          
          $nextIndexRow
            .find('.full-page-inner-wrap-outer')
            .css('height',that.overallHeight);
        }
        
        setTimeout(function() { 
          
          if( $row_id == 'footer-outer') {
            
            $indexRow.css('transform','translateY(-'+($('#footer-outer').height()-1)+'px)');
            
            $('#footer-outer').css({
              'transform': 'translateY(45%) translateZ(0)'
            });
            $('#footer-outer').css({
              'transition-duration': '0s', 
              'backface-visibility': 'hidden'
            });
            
            setTimeout(function() { 
              
              $('#footer-outer').css({
                'transition': $transformProp+' 500ms cubic-bezier(0.60, 0.23, 0.2, 0.93)', 
                'backface-visibility': 'hidden'
              });
              $('#footer-outer').css({
                'transform': 'translateY(0%) translateZ(0)'
              });
            },30);
            
          }
        },30);
        
        if( $row_id !='footer-outer' ) {
          
          that.stopMouseParallax();
          
          // Take care of nav/control coloring
          that.setFPNavColoring(nextIndex,direction);
          
          // Handle main nav link highlight
          setTimeout(function(){
            that.FPActiveMenuItems(nextIndex);
          },50);
          
          
        }
        
      },
      
      afterResize: function(){
        
        that.overallHeight = $('#nectar_fullscreen_rows').height();
        that.overallWidth = $(window).width();
        that.fullHeightRowOverflow();
        that.fullscreenElementSizing();
        that.fullscreenFooterCalcs();
        
        if( $('#footer-outer.active').length > 0) {
          setTimeout(function(){
            $('.last-before-footer').css('transform','translateY(-'+$('#footer-outer').height()+'px)');
          },200);
        } 
        
        // SVG animations when resizing and iscroll wraps/unwraps
        clearTimeout(that.$svgResizeTimeout);
        that.$svgResizeTimeout = setTimeout(function(){ 
          
          if(that.$svgIcons.length > 0) {
            $('.svg-icon-holder.animated-in').each(function(i){
              $(this).css('opacity','1');
              that.$svgIcons[$(this).find('svg').attr('id').slice(-1)].finish();
            });
          }
          
        },300);
      }
      
    });
    
  };

  window.NectarFullScreenRows = NectarFullScreenRows;
  
}( jQuery ));
