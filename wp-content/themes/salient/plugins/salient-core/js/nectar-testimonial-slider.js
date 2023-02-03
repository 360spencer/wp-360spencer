/**
 * Salient "Testimonial Slider" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */

(function( $ ) {
	
	"use strict";

  function NectarTestimonialSlider(el,type,resizeVideoToCover,fullWidthContentColumns) {
		
    this.el = el;
    this.type = type;
		this.resizeVideoToCover = resizeVideoToCover;
		this.fullWidthContentColumns = fullWidthContentColumns;
    this.flickityEl = null;
    
    this.createTestimonialControls();
  }


  // create controls
  NectarTestimonialSlider.prototype.createTestimonialControls = function() {
    
    var $frontEndEditorTestimonialDiv =  ($('body.vc_editor').length > 0) ? '> div': 'blockquote';
    var $that, slide_interval, objectStore;
    
    if( this.type != 'multiple_visible' && this.type != 'multiple_visible_minimal' ) {
      
      // fadeIn
      this.el.animate({'opacity':'1'},800);
      

      if(this.el.find('blockquote').length > 1) {
        this.el.find('.controls, .testimonial-next-prev').remove();
        this.el.append('<div class="controls"><ul></ul></div>');
        
        var slideNum = this.el.find('blockquote').length;
        $that = this.el;
        
        for(var i=0;i<slideNum;i++) {
          
          if( !this.el.is('[data-style="minimal"]') ) {
            $that.find('.controls ul').append('<li><span class="pagination-switch"></span></li>');
          } else {
            $that.find('.controls ul').append('<li>'+(i+1)+'</li>');
          }
        }
        
        // minimal
        if( this.el.is('[data-style="minimal"]') ) {
          
          // add next/prev
          this.el.append('<div class="testimonial-next-prev"><a href="#" class="prev fa fa-angle-left"></a><a href="#" class="next fa fa-angle-right"></a></div>');
          
          // bind controls
          this.el.find('.testimonial-next-prev a').on('click',this.minimalNextPrevSelect);
          
          // start on first
          if(this.el.find('.active').length == 0) {
            this.el.find('.slides '+$frontEndEditorTestimonialDiv +':first-child').addClass('active').css({'opacity':'1', 'transform': 'translateX(0px)'}).css('z-index','20');
            if(	!this.el.hasClass('disable-height-animation') ) {
              this.el.find('.slides').css({'height' : this.el.find('.slides '+$frontEndEditorTestimonialDiv +':first-child').height() + 40 + 'px' });
            }
          }
          
          // autorotate
          if(this.el.attr('data-autorotate').length > 0) {
            $that = this.el;
            slide_interval = (parseInt(this.el.attr('data-autorotate')) < 100) ? 4000 : parseInt(this.el.attr('data-autorotate'));
            objectStore = this;
            var $rotate = setInterval(function(){ objectStore.testimonialRotate($that); },slide_interval);
          }
          this.el.find('.testimonial-next-prev a').on('click',function(e){
            if(typeof e.clientX != 'undefined') {
							clearInterval($rotate);
						}
          });
          
          // wrap bullets
          this.el.find('.controls ul').wrap('<div class="control-wrap" />');
          this.el.find('.controls ul').css('width', ((this.el.find('.controls ul li').length * 20) +1) + 'px');
          this.el.find('.controls').append('<span class="out-of">/</span><span class="total">'+ this.el.find('blockquote').length+'</span>');
          
          //// swipe for testimonials
          this.el.swipe({
            
            swipeLeft : function(e) {
              $that.find('.testimonial-next-prev .next').trigger('click');
              e.stopImmediatePropagation();
              clearInterval($rotate);
              return false;
            },
            swipeRight : function(e) {
              $that.find('.testimonial-next-prev .prev').trigger('click');
              e.stopImmediatePropagation();
              clearInterval($rotate);
              return false;
            }    
          });
          
          
        }
        
        // non minimal
        if( !this.el.is('[data-style="minimal"]') ) {
          
          // bind controls
          this.el.find('.controls ul li').on('click',this.defaultPaginationSelect);
          
          // activate first slide
          this.el.find('.controls ul li').first().trigger('click');
          
          // autorotate
          if(this.el.attr('data-autorotate').length > 0) {
            slide_interval = (parseInt(this.el.attr('data-autorotate')) < 100) ? 4000 : parseInt(this.el.attr('data-autorotate'));
            $that = this.el;
            objectStore = this;
            var $rotate = setInterval(function(){ objectStore.testimonialRotate($that); },slide_interval);
          }
          
          this.el.find('.controls li').on('click',function(e){
            if(typeof e.clientX != 'undefined') clearInterval($rotate);
          });
          
          //// swipe for testimonials
          this.el.swipe({
            
            swipeLeft : function(e) {
              $that.find('.controls ul li span.active').parent().next('li').find('span').trigger('click');
              e.stopImmediatePropagation();
              clearInterval($rotate);
              return false;
            },
            swipeRight : function(e) {
              $that.find('.controls ul li span.active').parent().prev('li').find('span').trigger('click');
              e.stopImmediatePropagation();
              clearInterval($rotate);
              return false;
            }    
          });
          
        }
      } 
      
      // only one testimonial
      else if(this.el.find('.controls').length == 0) {
        
        var currentHeight = this.el.find('.slides blockquote').height();
        
        this.el.find('.slides blockquote')
          .css({'opacity':'0', 'transform': 'translateX(-25px)', 'z-index': '1'});
          
        this.el.find('.slides blockquote')
          .css({'opacity':'1', 'transform': 'translateX(0px)'})
          .css('z-index','20');
          
        this.el.find('.slides')
          .stop(true,true)
          .animate({'height' : currentHeight + 20 + 'px' },450,'easeOutCubic');
      }
      
      
    } //non multiple vis
    
    
    
    if( this.type == 'multiple_visible' || this.type == 'multiple_visible_minimal' ) {
      
      objectStore = this;
      $that = this.el; 
      var $element = $that;
      var $autoplay = ($that.attr('data-autorotate').length > 1 && parseInt($that.attr('data-autorotate')) > 100) ? parseInt($that.attr('data-autorotate')) : false;
      if($that.find('img').length == 0) { $element = $('body'); }
      
      // move img pos
      if( this.el.attr('data-style') != 'multiple_visible_minimal') {
        this.el.find('blockquote').each(function(){
          $(this).find('.image-icon').insertAfter($(this).find('p'));
        });
      } else {
        // has alf class
        if(this.el.find('blockquote').length > 4) {
          this.el.addClass('has-alf');
        }
      }
      
      var $testimonialGroupCells = (this.el.attr('data-style') == 'multiple_visible_minimal') ? true : false;
      var $frontEndEditorDrag =  ($('body.vc_editor').length > 0) ? false: true;
      var $frontEndEditorPause =  ($('body.vc_editor').length > 0) ? true: false;
      
      this.flickityEl = $that.find('.slides').flickity({
        contain: true,
        draggable: $frontEndEditorDrag,
        groupCells: $testimonialGroupCells,
        lazyLoad: false,
        imagesLoaded: true,
        percentPosition: true,
        prevNextButtons: false,
        pageDots: true,
        resize: true,
        setGallerySize: true,
        wrapAround: true,
        autoPlay: $autoplay,
        pauseAutoPlayOnHover: $frontEndEditorPause,
        accessibility: false
      });
      
      if(this.flickityEl.find('.vc_element.is-selected > blockquote').length > 0) {
        
        // starting
        this.flickityEl.find('.vc_element.is-selected > blockquote').addClass('is-selected');
        
        // changed
        this.flickityEl.on( 'select.flickity', function() {
          objectStore.flickityEl.find('.vc_element > blockquote').removeClass('is-selected');
          objectStore.flickityEl.find('.vc_element.is-selected > blockquote').addClass('is-selected');
        });
      }
      
      
      $that.css('opacity','1');
      
      
    }
		
		var testimonialObj = this;
		$('body').on('click', '.testimonial_slider:not([data-style*="multiple_visible"]):not([data-style="minimal"]) .controls li, .testimonial_slider[data-style="minimal"] .testimonial-next-prev a', function () {
			testimonialObj.resizeVideoToCover();
			return false;
		});
    
    
  };


  NectarTestimonialSlider.prototype.defaultPaginationSelect = function(clicked) {
    
    var $target = $(clicked.currentTarget);
    
    if($target.find('span').hasClass('active')) { 
      return false; 
    }
    
    var $frontEndEditorTestimonialDiv = ($('body.vc_editor').length > 0) ? '> div': 'blockquote';
    var $index = $target.index();
    var currentHeight = $target.parents('.testimonial_slider').find('.slides blockquote').eq($index).height();
    
    $target.parents('.testimonial_slider').find('li span').removeClass('active');
    $target.find('span').addClass('active');
    
    $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).addClass('no-trans');
    $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).css({'opacity':'0', 'transform': 'translateX(-25px)', 'z-index': '1'});
    
    $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv)
      .eq($index)
      .removeClass('no-trans')
      .css({'opacity':'1', 'transform': 'translateX(0px)'})
      .css('z-index','20');
      
    $target.parents('.testimonial_slider:not(.disable-height-animation)').find('.slides')
      .stop(true,true)
      .animate({'height' : currentHeight + 40 + 'px' },450,'easeOutCubic');
    
  };

  NectarTestimonialSlider.prototype.minimalNextPrevSelect = function(clicked) {
    
    var $target = $(clicked.currentTarget);
    
    var $frontEndEditorTestimonialDiv =  ($('body.vc_editor').length > 0) ? '> div': 'blockquote';
    var $index = $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv+'.active').index();
    var $actualIndex = $index;
    var currentHeight;
    
    $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).addClass('no-trans');
    $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).css({'opacity':'0', 'transform': 'translateX(-25px)', 'z-index': '1'});
    
    
    $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).eq($index).removeClass('active');
    
    if($target.hasClass('next')) {
      if($index+1 >= $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).length) { 
        $actualIndex = 0; 
      } else {
        $actualIndex = $index+1; 
      }
      currentHeight = $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).eq($actualIndex).height();
      
      // show slide
      $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).eq($actualIndex)
        .addClass('active')
        .removeClass('no-trans')
        .css({'opacity':'1', 'transform': 'translateX(0px)'})
        .css('z-index','20');
      
      // change pag #
      $target.parents('.testimonial_slider').find('.control-wrap ul').css({'transform':'translateX(-'+(20*$actualIndex)+'px)'});
      
    } else {
      if($index-1 == -1) { 
        $actualIndex = $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).length-1; 
      } else {
        $actualIndex = $index-1; 
      }
      currentHeight = $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv).eq($index-1).height();
      
      // show slide
      $target.parents('.testimonial_slider').find('.slides '+$frontEndEditorTestimonialDiv)
        .eq($index-1)
        .addClass('active')
        .removeClass('no-trans')
        .css({'opacity':'1', 'transform': 'translateX(0px)'})
        .css('z-index','20');
        
      // change pag #
      $target.parents('.testimonial_slider')
        .find('.control-wrap ul')
        .css({'transform':'translateX(-'+(20*$actualIndex)+'px)'});
        
    }
    
    
    $target.parents('.testimonial_slider:not(.disable-height-animation)')
      .find('.slides')
      .stop(true,true)
      .animate({'height' : currentHeight + 40 + 'px' },450,'easeOutCubic');
			
		return false;
    
  };


  NectarTestimonialSlider.prototype.testimonialRotate = function(){
    
    var $testimonialLength = this.el.find('li').length;
    var $currentTestimonial = this.el.find('.pagination-switch.active').parent().index();
    
    // stop the rotation when toggles are closed
    if( this.el.parents('.toggle').length > 0 && this.el.parents('.toggle').hasClass('open') ) {
      
      if( !this.el.is('[data-style="minimal"]') ) {
        if( $currentTestimonial+1 == $testimonialLength) {
          this.el.find('ul li:first-child').trigger('click');
        } else {
          this.el.find('.pagination-switch.active').parent().next('li').trigger('click');
        }
      } else {
        this.el.find('.testimonial-next-prev .next').trigger('click');
      }
      
    } else {
      
      if( !this.el.is('[data-style="minimal"]') ) {
        if( $currentTestimonial+1 == $testimonialLength) {
          this.el.find('ul li:first-child').trigger('click');
        } else {
          this.el.find('.pagination-switch.active').parent().next('li').trigger('click');
        }
      } else {
        this.el.find('.testimonial-next-prev .next').trigger('click');
      }
      
    }
    
  };


  NectarTestimonialSlider.prototype.testimonialHeightResize = function() {
    
    if(!this.el.is('.disable-height-animation') && !this.el.is('[data-style*="multiple_visible"]') ) {
      
      var $frontEndEditorTestimonialDiv = ($('body.vc_editor').length > 0) ? '.slides > div': '.slides blockquote';
      var $index;
      
      if( this.el.is('[data-style="minimal"]') ) {
        $index = this.el.find($frontEndEditorTestimonialDiv + '.active').index();
      } else {
        $index = this.el.find('.controls ul li span.active').parent().index();
      }
      
      var currentHeight = this.el.find($frontEndEditorTestimonialDiv).eq($index).height();
      this.el.find('.slides').stop(true,true).css({'height' : currentHeight + 40 + 'px' });
      
    }
    
  };


  NectarTestimonialSlider.prototype.testimonialSliderHeight = function() {
    
    if( this.el.is('.disable-height-animation') && !this.el.is('[data-style*="multiple_visible"]') ) {
      
      var $tallestQuote = 0;
      
      this.el.find('blockquote').each(function(){
        ($(this).height() > $tallestQuote) ? $tallestQuote = $(this).height() : $tallestQuote = $tallestQuote;
      });	
      
      // safety net incase height couldn't be determined
      if($tallestQuote == 0) {
				$tallestQuote = 100;
			}
      
      // set even height
      this.el.find('.slides').css('height',$tallestQuote+40+'px');
      
      // show the slider once height is set
      this.el.animate({'opacity':'1'});
      
      this.fullWidthContentColumns();
      
    }	
    
  };

  NectarTestimonialSlider.prototype.testimonialSliderHeightMinimalMult = function() {
    
    if( this.type == 'multiple_visible_minimal') {
      
      var $tallestQuote = 0;
      
      this.el.find('blockquote > .inner p').css('height','auto');
      
      this.el.find('blockquote > .inner p').each(function(){
        ($(this).height() > $tallestQuote) ? $tallestQuote = $(this).height() : $tallestQuote = $tallestQuote;
      });	
      
      // safety net incase height couldn't be determined
      if($tallestQuote == 0) { $tallestQuote = 200; }
      
      // set even height
      this.el.find('blockquote > .inner p').css('height',$tallestQuote+'px');
      
    }
    
    
  };
  
  window.NectarTestimonialSlider = NectarTestimonialSlider;

}( jQuery ));