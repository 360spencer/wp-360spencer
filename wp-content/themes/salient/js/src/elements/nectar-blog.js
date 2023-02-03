/**
 * Salient Blog script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global imagesLoaded */

(function( $ ) {

  "use strict";

  function NectarMasonryBlog(el,fullWidthSections,blogLoadIn) {

    this.el                 = el;
    this.fullWidthSections  = fullWidthSections;
    this.blogLoadIn         = blogLoadIn;
    this.blogMediaQuerySize = '';

    if( this.el.find('img.nectar-lazy').length > 0 ) {

      var that = this;
      setTimeout(function(){
        that.init();
        that.resizeBind();
      },100);

    } else {
      this.init();
      this.resizeBind();
    }

  }


  NectarMasonryBlog.prototype.init = function() {

    var that = this;

    this.el.find('article').addClass('masonry-blog-item');

    if(this.el.parent().hasClass('masonry') && this.el.parents('.blog-fullwidth-wrap').length > 0){

      if( this.el.parents('.wpb_row').length > 0 ) {
        this.el.parents('.wpb_row').css('z-index',100);
      }

      if(!this.el.parent().hasClass('meta_overlaid') &&
      !this.el.parent().hasClass('auto_meta_overlaid_spaced')) {

        if( $('#salient-delay-js-js').length == 0 ) {
          if(this.el.parent().hasClass('classic_enhanced')) {
            this.el.parent().parents('.full-width-content').css({
              'padding' : '0px 0.2% 0px 2.4%'
            });
          } else {
            this.el.parent().parents('.full-width-content').css({
              'padding' : '0px 0.2% 0px 3.2%'
            });
          }
        }

      } else {
        this.el.parent().parents('.full-width-content').addClass('meta-overlaid');
        $('.container-wrap').addClass('meta_overlaid_blog');
      }

      this.fullWidthSections();
    }

    var $cols    = 3;
    var $element = this.el;
    var $rtlLayout = ( $('body.rtl').length > 0 ) ? false : true;

    if( this.el.find('img').length == 0) {
      $element = $('<img />');
    }

    imagesLoaded($element,function(instance) {

      var $multiplier;

      if( $('body').hasClass('mobile') || that.el.parents('.post-area').hasClass('span_9')) {
        $cols = 2;
      }

      // Set img as BG if masonry classic enhanced
      if(that.el.parent().hasClass('classic_enhanced')){

        that.el.find('.large_featured.has-post-thumbnail .post-featured-img, .wide_tall.has-post-thumbnail .post-featured-img').each(function(){
          var $src = $(this).find('img').attr('src');
          $(this).css('background-image','url('+$src+')');
        });

        that.el.find('.large_featured .nectar-flickity, .wide_tall .nectar-flickity').each(function(){

          $(this).find('.cell').each(function(){
            var $src = $(this).find('img').attr('src');
            $(this).css('background-image','url('+$src+')');
          });

        });
      }

      $cols = that.blogColumnNumbCalcs();
      that.blogHeightCalcs($cols);

      if(that.el.parents('.post-area.meta_overlaid').length > 0) {
        that.el.isotope({
          itemSelector: 'article',
          transitionDuration: '0s',
          layoutMode: 'packery',
          isOriginLeft: $rtlLayout,
          packery: {
            gutter: 0
          }
        }).isotope( 'layout' );


      } else {
        if(that.el.parent().hasClass('classic_enhanced')) {
          if(that.el.parents('.span_9.masonry').length == 0) {
            $multiplier = (window.innerWidth >= 1600) ? .015 : .02;
          } else {
            $multiplier = .04;
          }
        }
        else {
          $multiplier = (that.el.parents('.span_9.masonry').length == 0) ? .03: .055;
          if(that.el.parents('.blog-fullwidth-wrap').length > 0) {
            $multiplier = .02;
          }
        }

        that.el.isotope({
          itemSelector: 'article',
          transitionDuration: '0s',
          layoutMode: 'packery',
          isOriginLeft: $rtlLayout,
          packery: {
            gutter: that.el.parents('.post-area').width()*$multiplier
          }
        }).isotope( 'layout' );
      }

      that.blogLoadIn(that.el);
      that.flickityBlogInit();

      $(window).trigger('resize');


    });


    // Set z-index / animation order only once
    setTimeout(that.blogMasonryZindex.bind(that),700);

  };


  NectarMasonryBlog.prototype.flickityBlogInit = function() {

    if($('.nectar-flickity.masonry.not-initialized').length == 0 || !$().flickity ) {
      return false;
    }

    $('.nectar-flickity.masonry.not-initialized').each(function(){

      // Move pos for large_featured
      if( $(this).parents('article').hasClass('large_featured') ) {
        $(this).insertBefore( $(this).parents('article').find('.content-inner') );
      }

    });

    $('.nectar-flickity.masonry.not-initialized').flickity({
      contain: true,
      draggable: false,
      lazyLoad: false,
      imagesLoaded: true,
      percentPosition: true,
      prevNextButtons: true,
      pageDots: false,
      resize: true,
      setGallerySize: true,
      wrapAround: true,
      accessibility: false
    });

    $('.nectar-flickity.masonry').removeClass('not-initialized');

    // Add count
    $('.nectar-flickity.masonry:not(.not-initialized)').each(function() {

      if( $(this).find('.item-count').length == 0) {

        $('<div class="item-count"/>').insertBefore($(this).find('.flickity-prev-next-button.next'));

        $(this).find('.item-count')
          .html('<span class="current">1</span>/<span class="total">' + $(this).find('.flickity-slider .cell').length + '</span>');

        $(this)
          .find('.flickity-prev-next-button, .item-count')
          .wrapAll('<div class="control-wrap" />');

        // Move pos for wide_tall
        if($(this).parents('article').hasClass('wide_tall') && $(this).parents('.masonry.material').length == 0) {
          $(this).find('.control-wrap').insertBefore( $(this) );
        }
      }

    });

    // Update count
    $('.masonry .flickity-prev-next-button.previous, .masonry .flickity-prev-next-button.next').on('click',function(){
      if($(this).parents('.wide_tall').length > 0) {
        $(this).parent()
          .find('.item-count .current')
          .html($(this).parents('article').find('.nectar-flickity .cell.is-selected').index()+1);
      }
      else {
        $(this).parent()
          .find('.item-count .current')
          .html($(this).parents('.nectar-flickity').find('.cell.is-selected').index()+1);
      }
    });

    $('body').on('mouseover','.flickity-prev-next-button.next',function(){
      $(this).parent()
        .find('.flickity-prev-next-button.previous, .item-count')
        .addClass('next-hovered');
    });

    $('body').on('mouseleave','.flickity-prev-next-button.next',function(){
      $(this).parent()
        .find('.flickity-prev-next-button.previous, .item-count')
        .removeClass('next-hovered');
    });

  };

  NectarMasonryBlog.prototype.blogHeightCalcs = function(cols) {

    var tallColHeight;

    if( this.el.parent().hasClass('meta_overlaid') &&
    this.el.find('article[class*="regular"]:not(.format-link):not(.format-quote)').length > 0) {

      // Widths
      $.each(this.el,function(i,v){

        var $mult = (cols == 1) ? 1 : 2;

        // Check if higher than IE9 -- bugs out with width calc
        if($('html.no-csstransitions').length == 0) {

          $(v)
            .find('article[class*="regular"]')
            .css('width',Math.floor($(v).width()/cols) +'px');
          $(v)
            .find('article[class*="tall"]')
            .css('width',Math.floor($(v).width()/cols*$mult) +'px');
        }

        else {
          $('.post-area.masonry').css('width','100%');
        }


      });

      // Reset height for calcs
      this.el.find('article[class*="regular"] img:not([data-nectar-img-src])').css('height','auto');

      tallColHeight = Math.ceil(this.el.find('article[class*="regular"]:not(".format-link"):not(".format-quote") img').first().height());
      var multipler = (window.innerWidth > 690) ? 2 : 1;

      this.el
        .find('article[class*="tall"] img, .article.wide img, article.regular img')
        .removeClass('auto-height');
      this.el
        .find('article[class*="tall"] img')
        .css('height',(tallColHeight*multipler));
      this.el
        .find('article[class*="regular"] img')
        .css('height',(tallColHeight));

      // Quote/links
      this.el.find('article.regular.format-link, article.regular.format-quote').each(function(){

        if(window.innerWidth > 690) {
          $(this).css({
            'height': tallColHeight
          });
        } else {
          $(this).css({
            'height': 'auto'
          });
        }

      });

      this.el.find('article.wide_tall.format-link, article.wide_tall.format-quote, article.large_featured.format-link, article.large_featured.format-quote').each(function(){

        if(window.innerWidth > 690) {
          $(this).css({
            'height': tallColHeight*multipler
          });
        } else {
          $(this).css({
            'height': 'auto'
          });
        }

      });


    } else {
      this.el.find('article[class*="tall"] img, article.regular img').addClass('auto-height');

      if(this.el.parent().hasClass('meta_overlaid')) {
        // Quote/links
        this.el.find('article.regular.format-link, article.regular.format-quote').each(function(){

          if(window.innerWidth > 690) {
            $(this).css({
              'height': $(this).width()
            });
          } else {
            $(this).css({
              'height': 'auto'
            });
          }

        });
      }

    }


    if( this.el.parent().hasClass('classic_enhanced') && this.el.find('article[class*="regular"]').length > 0) {

      if($(window).width() > 690 ) {
        this.classicEnhancedSizing(this.el.find('article:not(.large_featured):not(.wide_tall)'));
      }
      else {
        this.classicEnhancedSizing(this.el.find('article:not(.wide_tall)'));
      }

      tallColHeight = (this.el.find('article[class*="regular"]:not(".format-link"):not(".format-quote").has-post-thumbnail').first().length > 0) ? Math.ceil(this.el.find('article[class*="regular"]:not(".format-link"):not(".format-quote").has-post-thumbnail').first().css('height','auto').height()) : 600;

      if($(window).width() > 690 ) {
        this.el.find('article.large_featured, article.regular, article[class*="wide_tall"]').css('height',(tallColHeight));
      }
      else {
        this.el.find('article.regular, article[class*="wide_tall"]').css('height',(tallColHeight));
      }

    }

    else if( this.el.parent().hasClass('classic_enhanced') && this.el.find('article[class*="regular"]').length == 0) {

      tallColHeight = (this.el.find('article[class*="regular"]:not(".format-link"):not(".format-quote").has-post-thumbnail').first().length > 0) ? Math.ceil(this.el.find('article[class*="regular"]:not(".format-link"):not(".format-quote").has-post-thumbnail').first().css('height','auto').height()) : 600;

      if($(window).width() > 690 ) {
        this.el.find('article.large_featured, article.regular, article[class*="wide_tall"]').css('height',(tallColHeight));
      }
      else {
        this.el.find('article.regular, article[class*="wide_tall"]').css('height',(tallColHeight));
      }
    }

    // IE9 fix
    if($('html.no-csstransitions').length > 0) 	{
      $('.post-area.masonry').css('width','100%');
    }


  };



  NectarMasonryBlog.prototype.classicEnhancedSizing = function(elements) {

    var tallestCol = 0;
    elements.find('.article-content-wrap').css('height','auto');
    elements.filter('.has-post-thumbnail').each(function(){

      ($(this).find('.article-content-wrap').outerHeight(true) > tallestCol) ? tallestCol = $(this).find('.article-content-wrap').outerHeight(true) : tallestCol = tallestCol;

    });

    elements.filter('.has-post-thumbnail').find('.article-content-wrap').css('height',(tallestCol));

  };

  NectarMasonryBlog.prototype.resizeBind = function() {

    var that = this;
    $(window).on( 'resize', function(){
      setTimeout(that.resize.bind(that),30);
    });

    $(window).on('smartresize', function(){
      setTimeout(that.blogMasonryZindex.bind(that),700);
    });

  };


  NectarMasonryBlog.prototype.resize = function() {

    var $multiplier;
    var $cols = this.blogColumnNumbCalcs();

    this.blogHeightCalcs($cols);

    if(this.el.parents('.post-area.meta_overlaid').length > 0) {

      this.el.isotope({
        layoutMode: 'packery',
        packery: {
          gutter: 0
        }
      });

    } else {

      if(this.el.parent().hasClass('classic_enhanced')) {

        if(this.el.parents('.span_9.masonry').length == 0) {
          $multiplier = (window.innerWidth >= 1600) ? .015 : .02;
        } else {
          $multiplier = .04;
        }
      }

      else {

        $multiplier = (this.el.parents('.span_9.masonry').length == 0) ? .03: .055;
        if(this.el.parents('.blog-fullwidth-wrap').length > 0) {
          $multiplier = .02;
        }
      }

      this.el.isotope({
        layoutMode: 'packery',
        packery: {
          gutter: this.el.parents('.post-area').width()*$multiplier
        }
      });
    }


  };

  NectarMasonryBlog.prototype.removeDuplicates = function(inputArray) {

    var i;
    var len         = inputArray.length;
    var outputArray = [];
    var temp        = {};

    for (i = 0; i < len; i++) {
      temp[inputArray[i]] = 0;
    }
    for (i in temp) {
      outputArray.push(i);
    }
    return outputArray;
  };

  NectarMasonryBlog.prototype.blogMasonryZindex = function() {

    // Wscape if no browser support
    if($('body .post-area .masonry-blog-item').length > 0 &&
    $('body .post-area .masonry-blog-item').offset().left) {

      var $coords     = {},
      $zindexRelation = {},
      $that           = this.el;

      this.el.find('.masonry-blog-item').each(function(){

        var $itemOffset = $(this).offset();
        $itemOffset = $itemOffset.left;

        $coords[$(this).index()] = $itemOffset;
        $(this).css('z-index',Math.abs(Math.floor($(this).offset().left/20)));

      });

      var $corrdsArr = $.map($coords, function (value) { return value; });

      $corrdsArr = this.removeDuplicates($corrdsArr);
      $corrdsArr.sort(function(a,b){ return a-b; });

      for(var i = 0; i < $corrdsArr.length; i++){
        $zindexRelation[$corrdsArr[i]] = i*1;
      }

      $.each($coords,function(k,v){

        var $zindex;
        var $coordCache = v;
        $.each($zindexRelation,function(k,v){
          if($coordCache == k) {
            $zindex = v;
          }
        });

        $that.find('.masonry-blog-item:eq('+k+')')
          .css('z-index',$zindex)
          .attr('data-delay-amount',$zindex);

      });

    }

  };



  NectarMasonryBlog.prototype.blogColumnNumbCalcs = function(){

    var $cols = 3;

    if($('body').hasClass('mobile') && window.innerWidth < 990 ||
    this.el.parents('.post-area').hasClass('span_9') && this.el.parents('.post-area.meta_overlaid').length == 0) {

      $cols = 2;
    }

    else if( this.el.parents('.post-area').hasClass('full-width-content') ||
    this.el.parents('.post-area').parent().hasClass('full-width-content') && $('#boxed').length == 0 ||
    this.el.parents('.post-area.meta_overlaid').length > 0 ){

      if(window.innerWidth >= 1600){
        this.blogMediaQuerySize = (this.el.parents('.post-area.meta_overlaid').length > 0) ? 'four' :'five';
      } else if(window.innerWidth < 1600 && window.innerWidth >= 1300){
        this.blogMediaQuerySize = 'four';
      } else if(window.innerWidth < 1300 && window.innerWidth >= 990){
        this.blogMediaQuerySize = (this.el.parents('.post-area.meta_overlaid').length > 0) ? 'four' :'three';
      } else if(window.innerWidth < 990 && window.innerWidth >= 470){
        this.blogMediaQuerySize = 'two';
      } else if(window.innerWidth < 470){
        this.blogMediaQuerySize = (this.el.parents('.post-area.meta_overlaid').length > 0) ? 'two' :'one';
      }


      //boxed
      if($('#boxed').length > 0) {
        if(window.innerWidth > 1300){
          this.blogMediaQuerySize = 'four';
        } else if(window.innerWidth < 1300 && window.innerWidth > 990){
          this.blogMediaQuerySize = (this.el.parents('.post-area.meta_overlaid').length > 0) ? 'four' :'three';
        } else if(window.innerWidth < 990){
          this.blogMediaQuerySize = (this.el.parents('.post-area.meta_overlaid').length > 0) ? 'two' :'one';
        }

      }


      switch (this.blogMediaQuerySize) {
        case 'five':
        $cols = 5;
        break;

        case 'four':
        $cols = 4;
        break;

        case 'three':
        $cols = 3;
        break;

        case 'two':
        $cols = 2;
        break;

        case 'one':
        $cols = 1;
        break;
      }


    } else {

      $cols = 3;
    }

    return $cols;

  };

  window.NectarMasonryBlog = NectarMasonryBlog;

}( jQuery ));
