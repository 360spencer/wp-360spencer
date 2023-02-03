(function($) {

  "use strict";

  var nectarAdminStore = {
    mouseX: 0,
    mouseUp: false,
    bindEvents: function() {
      $(window).on('mousemove',function(e) {
        nectarAdminStore.mouseX = e.clientX;
      });
      $(window).on('mouseup',function() {
        nectarAdminStore.mouseUp = true;
        $('.wpb_edit_form_elements .wpb_el_type_nectar_numerical')
          .removeClass('scrubbing')
          .removeClass('no-scrubbing');
      });
    },
    init: function() {
      this.bindEvents();
    }
  };

  /* Global Sections */
  function SalientGlobalSections(el) {

    this.$el = el;
    this.$templates = this.$el.find('.templates');
    this.$hiddenInput = this.$el.find('input[name="id"][type="hidden"]');

    this.searchField();
    this.clickEvents();
  }

  SalientGlobalSections.prototype.clickEvents = function() {

    var that = this;

    this.$templates.find('.section').on('click',function() {
      var id = $(this).attr('data-id');
      that.$hiddenInput.val(id);

      that.$templates.find('.section').removeClass('active');
      $(this).addClass('active');

    });

  };


  SalientGlobalSections.prototype.searchField = function() {

    var that = this;

    this.$el.find('input[name="section_search"]').on('keyup', function() {

      var searchValue = $(this).val().toLowerCase();

      if( searchValue.length == 0 ) {
        that.$templates.find('.section').removeClass('hidden');
        return true;
      }

      that.$templates.find('.section').each(function() {

        var templateName = $(this).find('h4').text().toLowerCase();

        if( templateName.indexOf(searchValue) != -1 ) {
          $(this).removeClass('hidden');
        } else {
          $(this).addClass('hidden');
        }

      });
    });
  };


  /* Constrained Inputs */
  function ConstrainedInput(el) {

    this.$el = el;

    this.elements = [];
    this.$elements = '';
    this.className = false;
    this.active = false;

    this.createStyle();
    this.getInitialSet();
    this.trackActive();
    this.constrainEvents();

  }

  ConstrainedInput.prototype.createStyle = function() {
    this.$el.parents('.vc_checkbox-label').wrapInner('<div class="constrained-cb"></div>');
  }

  ConstrainedInput.prototype.getInitialSet = function() {

    var that = this;
    var classes = this.$el[0].className.split(/\s+/);

    // Store classname
    $.each(classes, function(i, name) {
      if (name.indexOf('constrain_group_') === 0 ) {
        that.className = name;
      }
    });

    // Store element set.
    $('.wpb_edit_form_elements .vc_wrapper-param-type-nectar_numerical[class*="constrain_group"]').each(function() {
      if( $(this).hasClass(that.className) ) {
        that.elements.push($(this).find('input.wpb_vc_param_value'));
      }
    });

    // Cache dom elements.
    that.$elements = $('.wpb_edit_form_elements').find('.' +that.className + ' input.wpb_vc_param_value');

  }

  ConstrainedInput.prototype.trackActive = function() {

    var that = this;

    this.active = this.$el.prop('checked');

    this.$el.on('change', function() {

      // Store state.
      that.active = $(this).prop('checked');

      // Alter icon.
      if( that.active == true ) {
        $(this).parents('.vc_checkbox-label').addClass('active');
      } else {
        $(this).parents('.vc_checkbox-label').removeClass('active');
      }

      // Trigger changes.
      if( that.elements.length > 0 ) {

        $.each(that.elements,function(i, element) {
          if( that.active == true ) {
            element.addClass('constrained');
          } else {
            element.removeClass('constrained');
          }
          element.trigger('keyup');
          element.trigger('change');
        });

      }

    });

    // Trigger on load.
    this.$el.trigger('change');

  }

  ConstrainedInput.prototype.constrainEvents = function() {

    if( this.className == false ) {
      return;
    }

    var that = this;

    // Bind event.
    $.each(this.elements, function(i, element) {

      element.on('change, keyup', function() {

        // Keep values in sync when constrain in active.
        if( that.active ) {
          var val = $(this).val();
          that.$elements.val(val).trigger('change');
        }

      });

    });

  };


  /* Numerical Inputs */
  function NectarNumericalInput(el) {

    this.$el = el;
    this.$scrubber = '';
    this.$scrubberIndicator = '';
    this.scrubberIndicatorX = 0;
    this.$editFormLine = el.parents('.edit_form_line');
    this.$placeHolder = el.parents('.edit_form_line').find('.placeholder');
    this.mouseDown = false;
    this.initialX = 0;
    this.calculatedVal = 0;
    this.scrubberCurrent = 0;
    this.currentVal = 0;
    this.divider = 3;
    this.zeroFloor = false;
    this.bottomFloor = 0;
    this.topCeil = 1000000;
    this.unit = '';

    if( el.is('[class*=padding]') || el.parents('.zero-floor').length > 0 ) {
      this.zeroFloor = true;
    } 

    if( el.is('[class*=_intensity]') ) {
      //this.zeroFloor = true;
      this.divider = 30;
      this.topCeil = 5;
      this.zeroFloor = true;
      this.bottomFloor = -5;
    }

    this.createMarkup();
    this.trackActive();
    this.scrubbing();

  }

  NectarNumericalInput.prototype.createMarkup = function() {

    var $parent = this.$el.parent();

    if($parent.find('.vc_description').length > 0) {
      $('<span class="scrubber relative" />').insertBefore($parent.find('.vc_description'));
    } else {
      $parent.append('<span class="scrubber" />');
    }
    

    this.$scrubber = this.$el.parents('.edit_form_line').find('.scrubber');
    this.$scrubber.append('<span class="inner"/>');
    this.$scrubber.find('.inner').append('<span />');
    this.$scrubber.append('<i class="dashicons dashicons-arrow-left-alt2" />');
    this.$scrubber.append('<i class="dashicons dashicons-arrow-right-alt2" />');

    this.$scrubberIndicator = this.$scrubber.find('.inner span');
  };


  NectarNumericalInput.prototype.trackActive = function() {

    var that = this;

    // focus
    this.$el.on('focus', function() {
      that.$placeHolder.addClass('focus');
    });

    // change
    this.$el.on('change',function() {
      if( that.$el.val().length > 0 ) {
        that.$placeHolder.addClass('focus');
      } else {
        that.$placeHolder.removeClass('focus');
      }
    });

    // blur
    this.$el.on('blur',function() {
      if( that.$el.val().length == 0 ) {
        that.$placeHolder.removeClass('focus');
      }

      that.$el.trigger('change');
    });


  };

  NectarNumericalInput.prototype.getUnit = function() {

    if( this.currentVal.indexOf('%') != -1 ) {
      this.unit = '%';
    } else if( this.currentVal.indexOf('px') != -1 ) {
      this.unit = 'px';
    } else if( this.currentVal.indexOf('vw') != -1 ) {
      this.unit = 'vw';
    } else if( this.currentVal.indexOf('vh') != -1 ) {
      this.unit = 'vh';
    } else {
      this.unit = '';
    }

  };

  NectarNumericalInput.prototype.scrubbing = function() {

    var that = this;

    this.$scrubber.on('mousedown',function() {

      $('.wpb_el_type_nectar_numerical').addClass('no-scrubbing');
      that.$el.parents('.wpb_el_type_nectar_numerical').removeClass('no-scrubbing').addClass('scrubbing');

      // Track that the mouse is down / store initial
      that.mouseDown = true;
      nectarAdminStore.mouseUp = false;

      // Starting pos
      that.initialX = nectarAdminStore.mouseX;

      // Empty
      if( that.$el.val().length == 0 ) {

        this.scrubberCurrent = 0;
        that.currentVal = 0;
        that.unit = '';

      } else {

        that.currentVal = that.$el.val();

        if( that.$scrubberIndicator.css('transform') != 'none' ) {
          var transformMatrix = that.$scrubberIndicator.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
          that.scrubberCurrent = transformMatrix[12] || transformMatrix[4];
        }

        if( isNaN( parseInt(that.currentVal) ) ) {
          that.currentVal = '0';
        }

        // Using units?
        that.getUnit();

      }

      // Change value RAF loop
      requestAnimationFrame(that.scrubbingAlter.bind(that));

    });


  };


  NectarNumericalInput.prototype.scrubbingAlter = function(e) {

    if( nectarAdminStore.mouseUp != true ) {
      requestAnimationFrame(this.scrubbingAlter.bind(this))
    }

    // Value

    //// Every x pixels moved, ++ or --
    this.calculatedVal = parseInt(this.currentVal) + parseInt(nectarAdminStore.mouseX - this.initialX)/this.divider;

    //// Who wants decimals??
    this.calculatedVal = Math.floor(this.calculatedVal);

    //// Stop number from going below 0
    if( this.zeroFloor && this.calculatedVal < this.bottomFloor) {
      
      this.$el.val(this.bottomFloor);
    } else {

      //// Ceil.
      if( this.calculatedVal > this.topCeil ) {
        this.$el.val(this.topCeil);
      } else {
        this.$el.val(this.calculatedVal + this.unit);

        // Indicator
        this.scrubberIndicatorX = linearInterpolate(this.scrubberIndicatorX, parseInt(this.scrubberCurrent) + parseInt(nectarAdminStore.mouseX - this.initialX)/4, 0.14);

        this.$scrubberIndicator.css({
          'transform': 'translate3d('+ this.scrubberIndicatorX +'px, 0px, 0px)'
        });
      }
    }

    this.$el.trigger('keyup');
    this.$el.trigger('focus');


  }





  function salientElementSettingsLoading() {

    var $modalContainer = $('div[data-vc-ui-element="panel-edit-element"] .vc_ui-panel-window-inner > .vc_ui-panel-content-container .vc_edit_form_elements');
    $('<div class="salient-element-settings-loading"></di>').insertAfter($modalContainer);

    var $loadingContainer = $modalContainer.parent().find('.salient-element-settings-loading');

    $loadingContainer.append('<div class="salient-element-loading"><i class="vc-composer-icon vc-c-icon-cog"></i></div>');

  }


  function createDeviceGroup($selector) {

    // Hide tabbed on load.
    $('body').find('.' + $selector + ':not(.desktop)').hide();

    var $title = $('body').find('.' + $selector).find('.group-title').clone();

    // Group Markup.
    $('body').find('.' + $selector).wrapAll('<div class="'+$selector+'-wrap nectar-device-group-wrap vc_column" />');

    // Header Markup.
    $('body').find('.' + $selector).find('.group-title').hide();
    $('.'+$selector+'-wrap').before('<div class="'+$selector+'-header nectar-device-group-header" />');



    var $header = $('.'+$selector+'-header');
    $header.append($title);
    $header.append('<span class="device-selection"><i class="dashicons-before dashicons-desktop active" data-filter="desktop" title="Desktop"></i> <i class="dashicons-before dashicons-tablet" data-filter="tablet" title="Tablet"></i> <i class="dashicons-before dashicons-smartphone" data-filter="phone" title="Phone"></i></span>');

  }


  function deviceHighlightInUse($input) {

    var $groupHeader = $input.parents('.nectar-device-group-wrap').prev('.nectar-device-group-header');
    var inUse        = false;
    var type         = 'select';

    if( $input.is('input[type="text"]') ) {
      type = 'text';
    } else if( $input.is('input[type="hidden"]') ) {
      type = 'hidden';
    }

    // Determine which icon is related
    var iconSelector = 'desktop';
    if( $input.parents('div[class*="vc_wrapper-param-type"].tablet').length > 0 ) {
       iconSelector = 'tablet';
    } else if( $input.parents('div[class*="vc_wrapper-param-type"].phone').length > 0 ) {
      iconSelector = 'phone';
    }

    $groupHeader.find('i[data-filter="'+iconSelector+'"]').removeClass('in-use');

    // Check each input in the group for value set.

    //// Text inputs.
    if( type == 'text' ) {
      $input.parents('.nectar-device-group-wrap').find('.'+iconSelector+' input[type="text"]').each(function(){
        if( $(this).parents('.vc_wrapper-param-type-textfield').length > 0 && $(this).val().length ) {
          inUse = true;
        } else if( $(this).parents('.vc_wrapper-param-type-nectar_numerical').length > 0 && $(this).val().length ) {
          inUse = true;
        }
      });
    }
    // Hidden inputs (images)
    else if( type == 'hidden' ) {
      $input.parents('.nectar-device-group-wrap').find('.'+iconSelector+' input[type="hidden"]').each(function(){
        if( $(this).parents('.vc_wrapper-param-type-fws_image').length > 0 && $(this).val().length ) {
          inUse = true;
        }
      });
    }
    //// Selects.
    else {
      $input.parents('.nectar-device-group-wrap').find('.'+iconSelector+' select').each(function() {

        if( iconSelector != 'desktop' && $(this).parents('.vc_wrapper-param-type-dropdown').length > 0 && $(this).val().length ) {

          if( $(this).val() != 'inherit' && $(this).val() != 'default' ) {
            inUse = true;
          }

        }
        else if( iconSelector == 'desktop' && $(this).parents('.vc_wrapper-param-type-dropdown').length > 0 && $(this).val().length ) {

          if( $(this).val() != 'no-extra-padding' && $(this).val() != 'default' ) {
            inUse = true;
          }

        }

      });
    }

    // If using value in group, highlight icon.
    if (inUse == true ) {
      $groupHeader.find('i[data-filter="'+iconSelector+'"]').addClass('in-use');
    }

  }



  function deviceGroupEvents() {

    $('.nectar-device-group-header i').on('click', function() {

      var filter = $(this).attr('data-filter');
      var group  = $(this).parents('.nectar-device-group-header').next('.nectar-device-group-wrap');

      // Already active.
      if( $(this).hasClass('active') ) {
        return;
      }

      // Active class.
      $(this).parents('.nectar-device-group-header').find('i').removeClass('active');
      $(this).addClass('active');

      // Display Grouping.
      group.find('> div').hide();
      group.find('> div.'+filter).fadeIn();

      // Trigger resize.
      if( group.find('.nectar_range_slider').length > 0 ) {
        $(window).trigger('resize');
      }

    });

    $('.nectar-device-group-header .device-selection i').each(function(){
      var $group = $(this).parents('.nectar-device-group-header').next('.nectar-device-group-wrap');

      // On change.
      $group.find('input[type="text"], select, input[type="hidden"]').on('change',function(){
        deviceHighlightInUse($(this));
      });

      // Inital Load.
      $group.find('input[type="text"], select, input[type="hidden"]').each(function(){
        deviceHighlightInUse($(this));
      })

    });

  }



  function colorOverlayImageUpdate() {

    var $tab      = $('div[data-vc-shortcode-param-name="color_overlay"]').parents('.vc_edit-form-tab');
    var $BGimage  = $tab.parents('.wpb_edit_form_elements').find('div[data-vc-shortcode-param-name="bg_image"].wpb_el_type_fws_image');

    if( $BGimage.length == 0 ) {
      // Look for column BG img instead
      $BGimage = $tab.parents('.wpb_edit_form_elements').find('div[data-vc-shortcode-param-name="background_image"].wpb_el_type_fws_image');
    }
    var $colorPreview = $('.nectar-color-overlay-preview');

    if( $BGimage.find('img[src]').length > 0 ) {

      var src = $BGimage.find('img[src]').attr('src');
      // full size preview.
      if( src.indexOf('-150x150') != -1 ) {
        src = src.replace('-150x150.','.');
      }
      $colorPreview.find('span.wrap').css('background-image','url('+ src +')').addClass('using-img');
    } else {
      $colorPreview.find('span.wrap').css('background-image','').removeClass('using-img');
    }

  }



  function colorOverlayPreview(el) {

    // Markup.
    var $tab = $('div[data-vc-shortcode-param-name="color_overlay"]').parents('.vc_edit-form-tab');

    var $colorPreview = $('<div class="nectar-color-overlay-preview"></div>');
    var inputName     = ('row' === el) ? 'bg_image' : 'background_image';

    $colorPreview.append('<span class="wrap" />');
    $colorPreview.find('.wrap').append('<span />');

    if( el != 'general') {
      $colorPreview.insertAfter($('.col-md-6-last[data-vc-shortcode-param-name="color_overlay_2"]'));
    } else {
      //inputName = 'none';
      $colorPreview.find('.wrap').addClass('hide-icon')
      $colorPreview.insertBefore($('.generate-color-overlay-preview'));
    }


    // Events.
    $('input[name="color_overlay"]').on('change', colorOverlayPreviewUpdate);
    $('input[name="color_overlay_2"]').on('change', colorOverlayPreviewUpdate);
    $('select[name="gradient_direction"]').on('change', colorOverlayPreviewUpdate);
    $('select[name="overlay_strength"]').on('change', colorOverlayPreviewUpdate);
    $('select[name="gradient_type"]').on('change', colorOverlayPreviewUpdate);
    $('input[name="enable_gradient"]').on('change', colorOverlayPreviewUpdate);

    $('input[name="'+inputName+'"].'+inputName+'.fws_image').on('change', colorOverlayImageUpdate);

    setTimeout(function() {
      $('div[data-vc-shortcode-param-name="color_overlay"] input.wp-picker-clear').on('mousedown', colorOverlayPreviewUpdate);
      $('div[data-vc-shortcode-param-name="color_overlay_2"] input.wp-picker-clear').on('mousedown', colorOverlayPreviewUpdate);
      $('div[data-vc-shortcode-param-name="color_overlay"] input[type="range"][name="alpha"]').on('change', colorOverlayPreviewUpdate);
      $('div[data-vc-shortcode-param-name="color_overlay_2"] input[type="range"][name="alpha"]').on('change', colorOverlayPreviewUpdate);
    },2000);

    colorOverlayPreviewUpdate();
    colorOverlayImageUpdate();

  }

  function colorOverlayPreviewUpdate() {

    setTimeout(function(){

      var $color1  = $('input[name="color_overlay"]');
      var $color2  = $('input[name="color_overlay_2"]');
      var $useGrad = $('input#enable_gradient-true');
      var $gradDir = $('select[name="gradient_direction"]');
      var $opacity = $('select[name="overlay_strength"]');
      var $gradientType = $('input[name="gradient_type"]').val();

      if( $useGrad.length > 0 && $useGrad.prop('checked') &&
      $color1.length > 0 &&
      $color2.length > 0 &&
      $gradDir.length > 0 &&
      $gradientType != 'advanced') {

        var gradientDirectionDeg = '90deg';
        var $gradDirVal = $gradDir.val();

        switch( $gradDirVal ) {
          case 'left_to_right' :
            gradientDirectionDeg = '90deg';
            break;
          case 'left_t_to_right_b' :
            gradientDirectionDeg = '135deg';
            break;
          case 'left_b_to_right_t' :
            gradientDirectionDeg = '45deg';
            break;
          case 'top_to_bottom' :
            gradientDirectionDeg = 'to bottom';
            break;
        }

        var $color1Val = ( $color1.val().length > 0 ) ? $color1.val() : 'rgba(255,255,255,0.001)';
        var $color2Val = ( $color2.val().length > 0 ) ? $color2.val() : 'rgba(255,255,255,0.001)';

        if( $gradDirVal != 'radial' ) {
          $('.nectar-color-overlay-preview .wrap span').css('background', 'linear-gradient('+gradientDirectionDeg+', '+ $color1Val +', '+ $color2Val +')');
        }
        else {
          $('.nectar-color-overlay-preview .wrap span').css('background', 'radial-gradient(50% 50% at 50% 50%, '+ $color1Val +' 0%, '+ $color2Val +' 100%)');
        }

        $('.nectar-color-overlay-preview .wrap span').css('opacity', $opacity.val());


      } else if($gradientType != 'advanced') {
        $('.nectar-color-overlay-preview .wrap span').css({
          'background': '',
          'background-color': $color1.val()
        });
        $('.nectar-color-overlay-preview .wrap span').css('opacity', $opacity.val());
        
      }
      

      

    }, 150); // settimeout

  }


  function columnDeviceGroupHeaderToggles() {
    $('select[name="border_type"]').on('change', function() {
      if( 'simple' === $(this).val() ) {
        $('.column-border-device-group-header').hide();
      } else {
        $('.column-border-device-group-header').show();
      }
    }).trigger('change');

    // Mask param group device group header toggle
    $('input#mask_enable-true').on('change', function() {
      if( $(this).prop('checked') != true ) {
        $('.mask-alignment-device-group-header').hide();
      } else {
        $('.mask-alignment-device-group-header').show();
      }
    }).trigger('change');

    // column padding device group header toggle
    $('input[name="column_padding_type"]').on('change', function() {
      if( $(this).val() === 'advanced' ) {
        $('.column-padding-adv-device-group-header').show();
        $('.column-padding-device-group-header').hide();
      } else {
        $('.column-padding-adv-device-group-header').hide();
        $('.column-padding-device-group-header').show();
      }
    }).trigger('change');

  }


  function nectarClipPathDependency() {
    $('select[name="bg_image_animation"]').on('change', function() {
      if( 'clip-path' !== $(this).val() ) {
        $('.clip-path-device-group-header, .clip-path-end-device-group-header').hide();
      } else {
        $('.clip-path-device-group-header, .clip-path-end-device-group-header').show();
      }
    }).trigger('change');
  }


  function nectarFancyRadioEvents() {

    $("body").on('change','.n_radio_html_val',function(){
      
      var group_id = $(this).parents('.nectar-radio-html').data("grp-id");
      $("#nectar-radio-html-"+group_id).val($(this).val()).trigger('change');
      $('.nectar-radio-html-list li').removeClass('active');
      $(this).parents('li').addClass('active');
      
    });

  }

  function nectarFancyCheckboxes() {

    $('.vc_edit_form_elements .vc_shortcode-param.salient-fancy-checkbox:not(.constrain-icon) input[type="checkbox"].wpb_vc_param_value.checkbox').each(function(){

      if( $(this).prop('checked') ) {
        var $checkboxMarkup = $('<label class="cb-enable selected"><span>On</span></label><label class="cb-disable"><span>Off</span></label>');
      } else {
        var $checkboxMarkup = $('<label class="cb-enable"><span>On</span></label><label class="cb-disable selected"><span>Off</span></label>');
      }

      // Remove desc.
      var $parent = $(this).parent();
      var $checkbox = $(this).detach();

      $parent.empty();
      $parent.append($checkbox);

      $checkbox = $parent.find('input[type="checkbox"].wpb_vc_param_value.checkbox');

      // Create HTML.
      $checkbox.wrap('<div class="switch-options salient" />');
      $parent.find('.switch-options').prepend($checkboxMarkup);

      var $switchOptions = $checkbox.parents('.switch-options');

      if( $switchOptions.parent().is('.vc_checkbox-label') ) {
        $switchOptions.unwrap();
      }

      $switchOptions.wrap('<div class="nectar-cb-enabled" />');


    });


    // Start activated.
    $('.vc_edit_form_elements .switch-options.salient').each(function(){
      if( $(this).find('.cb-enable.selected').length > 0 ) {
        $(this).addClass( 'activated');
      }
    });


  }

  var graPickers = [];
  
  function NectarGradientColorPickerAngle(el) {
    
    this.$el = el;
    this.$input = el.find('input[type="number"]');
    this.value = this.$input.val();
    this.centerPointX = 0;
    this.centerPointY = 0;
    this.active = false;

    this.events();
    this.update();
   
  }

  NectarGradientColorPickerAngle.prototype.events = function() {
    
    var that = this;

    this.$el.find('.nectar-angle-selection-input').on('mousedown', function() {
      that.active = true;

      var rect = that.$el.find('.nectar-angle-selection-input').offset();
      that.centerPointX = rect.left + 15;
      that.centerPointY = rect.top + 15;
    });

    this.$input.on('change keyup',function(){
      that.value = $(this).val();
      that.update();
    });

    $('body').on('mouseup', function() {
      that.active = false;
     
    });

    $(window).on('mousemove',function(e) {

      if(that.active) {

        var angle = Math.atan2(e.pageY - that.centerPointY, e.pageX - that.centerPointX);

        angle = angle + 1.5; // alter by 90 deg to match mouse
        if (angle < 0) { 
          angle += 2 * Math.PI; 
        }
        that.value = Math.floor(angle * 180 / Math.PI);

        that.update();
      } 
    });

  };

  NectarGradientColorPickerAngle.prototype.update = function() {
    var $gradientType = $('input[name="gradient_type"]').val();

    if( !this.value ) {
      this.value = '0';
      this.$input.val('');
    } else {
      this.$input.val(this.value);
    }
  
    
    this.$el.find('.inner').css('transform','rotate('+this.value+'deg)');
    if( graPickers[0] && $gradientType == 'advanced' || graPickers[0] && $('.generate-color-overlay-preview').length > 0 ) {
      graPickers[0].setDirection(this.value+'deg');
    }
  };

 

  function nectarGradientColorpicker() {

     // Grapick.
     if( $('.nectar-grapick-wrap').length > 0 ) {

      graPickers = [];


      $('.nectar-grapick-wrap').each(function(i){

        var id = $(this).attr('id');
        var input = $('.vc_shortcode-param input[type="hidden"][id="'+id+'"]');
        var savedColors = input.val();
        var savedDisplayType = $('input[name="advanced_gradient_display_type"]').val();
        var savedDir = ( savedDisplayType === 'radial' ) ? $('select[name="advanced_gradient_radial_position"]').val() : input.closest('.nectar_angle_selection').val();

        graPickers[i] = new Grapick({
          el: '.nectar-grapick-wrap',
          colorEl: '<input id="colorpicker"/>'
        });

        graPickers[i].setColorPicker(handler => {
          const el = handler.getEl().querySelector('#colorpicker');
          const $el = $(el);
      
          $el.spectrum({
              color: handler.getColor(),
              showAlpha: true,
              preferredFormat: "hex",
              showInput: true,
              change(color) {
                handler.setColor(color.toRgbString());
              },
              move(color) {
                handler.setColor(color.toRgbString(), 0);
              }
          });
      
          // return a function in order to destroy the custom color picker
          return () => {
            $el.spectrum('destroy');
          }
        });

        graPickers[i].on('change', function(complete) {
          var value = graPickers[i].getValue();
          var colorVal = graPickers[i].getColorValue();

          var bgPreviewEl = $('.nectar-color-overlay-preview span span');

          if(bgPreviewEl.length > 0) {
            $('.nectar-color-overlay-preview span span')[0].style.backgroundColor = '';
            $('.nectar-color-overlay-preview span span')[0].style.backgroundImage = value;
            $('.nectar-color-overlay-preview span span')[0].style.opacity = '1';
          }
          
          /* Dont save the default */
          if( colorVal != '#f3f3f3 10%, #f3f3f3 10%' && 
              colorVal != '#f3f3f3 10%, #f3f3f3 90%' ) {
            input.val(value);
          }
          
        });

        if( savedColors.length > 0 ) {
          graPickers[i].setValue(savedColors);
          if(savedDir) {
            graPickers[i].setDirection(savedDir);
          }
          if(savedDisplayType) {
            graPickers[i].setType(savedDisplayType);
          }
       
        } else {
          graPickers[i].addHandler(10, '#f3f3f3');
          graPickers[i].addHandler(90, '#f3f3f3');
        }
        
        graPickers[i].emit('change');
        
      });

     

      // Gradient type.
      $('input[name="advanced_gradient_display_type"]').on('change', function(){
        var val = $(this).val();
        for( var i=0; i<graPickers.length; i++) {
          graPickers[i].setType(val);
         
        }
      });

      // Radial direction
      // Note: Grapick needed a modification to support top left/right + bottom left/right
      $('select[name="advanced_gradient_radial_position"]').on('change', function(){

        if( $('input[name="advanced_gradient_display_type"]').val() == 'radial') {
          var val = $(this).val();
          for( var i=0; i<graPickers.length; i++) {
            graPickers[i].setDirection(val);
          }
        }
      });

      $('input[name="gradient_type"]').on('change', function(val){
        var val = $(this).val();
        if(val == 'advanced') {
          for( var i=0; i<graPickers.length; i++) {
            graPickers[i].emit('change');
          }
        }
      });

      if( $('input[name="gradient_type"]').val() == 'advanced' || $('.generate-color-overlay-preview').length > 0 ) {
        setTimeout(function(){
          $('input[name="advanced_gradient_display_type"], select[name="advanced_gradient_radial_position"]').trigger('change');
        },300);
       
      }
      
    }

      // Angles
      $('.nectar-angle-selection-wrap').each(function(i){
        new NectarGradientColorPickerAngle($(this));
      });
  }


  function nectarBoxShadowGeneratorInit() {
    $('div.nectar-box-shadow-generator').each(function(){
      new NectarBoxShadowGenerator($(this)); 
    });
  }

  function NectarBoxShadowGenerator(el) {
    this.el = el;
    this.input = el.find('.wpb_vc_param_value');
    this.state = {
      'horizontal': 0,
      'vertical': 0,
      'blur': 0,
      'spread': 0,
      'opacity': 0,
    };

    this.events();
  }

  NectarBoxShadowGenerator.prototype.events = function() {
    this.el.find('input.nectar-range-slider').on('change', this.calculateValue.bind(this));
  };

  NectarBoxShadowGenerator.prototype.calculateValue = function() {

    var that = this;

    this.el.find('.nectar-range-slider').each(function(){

      var name = $(this).attr('name');
      that.state[name] = $(this).val();      
    });

    this.input.val(this.parseToShortcodeAttr(this.state));
  };

  NectarBoxShadowGenerator.prototype.parseToShortcodeAttr = function() {

    var that = this;
    var string = '';

    Object.keys(this.state).forEach(function(key) {
      string += key + ':' + that.state[key] + ',';
    });

    string = string.slice(0, -1);
    return string;

  }

  

  function nectarRadioTabEvents() {

    $("body").on('change','.vc_edit_form_elements .n_radio_tab_val',function(){
      
      var group_id = $(this).parents('.nectar-radio-tab').data("grp-id");
      $("#nectar-radio-tab-"+group_id).val($(this).val()).trigger('change');
    });
    
    // Simulate save_always..
    $('.vc_edit_form_elements .wpb_el_type_nectar_radio_tab_selection .edit_form_line > input[type="hidden"]').each(function(){
      
      if( $(this).val().length == 0 ) {
        $(this).val($(this).attr('data-default-val')).trigger('change');
      }

    });

  }

  function nectarRangeSliders() {

    /* Single Range */
    var textContent = ('textContent' in document) ? 'textContent' : 'innerText';
    
    function valueOutput(element) {
      var value = element.value;
      var output = $(element).parent().siblings('.output');
      output = output.find('.number')[0];

      output[textContent] = value;
    }
    
    $('input[type="range"].nectar-range-slider').rangeslider({
      polyfill: false,
      onInit: function() {
        valueOutput(this.$element[0]);
      },
      onSlideEnd: function(position, value) {
        this.$element.val(value);
        var min = this.$element.attr('min');
        var max = this.$element.attr('max');

        // fix overflow on slider 
        if( value > (max * 0.6)) {
          $(window).trigger('resize');
        }
        
      }
    });

    $('body').on('input', '.nectar-range-slider', function(e) {
      valueOutput(e.target);
    });



    /* Multi Range */
    $('.nectar-multi-range-slider').each(function(){

      var slider = $(this)[0];
      var sliderInput = $(this).find('.wpb_vc_param_value');

      var startingValue = sliderInput.val().indexOf(',') > -1 ? sliderInput.val().split(',') : [0,100];
      var min = parseInt(sliderInput.attr('data-min'));
      var max = parseInt(sliderInput.attr('data-max'));

      noUiSlider.create(slider, {
        start: startingValue,
        connect: true,
        tooltips: [wNumb({decimals: 0}), wNumb({decimals: 0})],
        step: 1,
        range: {
            'min': min,
            'max': max
        }
      });

      // Set value to input for saving.
      slider.noUiSlider.on('update', function (values, handle) {
          sliderInput.val(slider.noUiSlider.get().join(','));
      });

    });

  
  }

  function nectarFancyCheckboxEvents() {

    // Click events.
    $('body').on('click', '.vc_edit_form_elements .switch-options.salient .cb-enable' ,function() {

      var parent = $( this ).parents( '.switch-options' );

      $( '.cb-disable', parent ).removeClass( 'selected' );
      $( this ).addClass( 'selected' );

      $(this).parent().addClass( 'activated');

      $( 'input[type="checkbox"]', parent ).prop("checked", true).trigger('change');

    });

    $('body').on('click', '.vc_edit_form_elements .switch-options.salient .cb-disable' ,function() {

      var parent = $( this ).parents( '.switch-options' );

      $( '.cb-enable', parent ).removeClass( 'selected' );
      $( this ).addClass( 'selected' );
      $(this).parent().removeClass( 'activated');

      $( 'input[type="checkbox"]', parent ).prop("checked", false).trigger('change');

    });

  }


  function simpleSliderFields() {

    if( vc && vc.shortcodes && vc.shortcodes.models ) {

      $.each(vc.shortcodes.models, function(i, el) {

        if( el.attributes && el.attributes.shortcode && el.attributes.shortcode === 'carousel' ) {

          if( el.attributes.params && el.attributes.params.script && el.attributes.params.script === 'simple_slider') {
            $('.vc_edit_form_elements .simple_slider_specific_field').show();
          } 
          else if( el.attributes.params && el.attributes.params.script && el.attributes.params.script === 'flickity') {
            $('.vc_edit_form_elements .flickity_specific_field').show();
          }

        }
      });
    }

  }

  function NectarLottiePreview(el) {
    this.$el = el;
    this.$input = this.$el.find('input');
    this.rendered = false;
    this.events();
  }

  NectarLottiePreview.prototype.events = function() {
    var that = this;
    this.$input.on('change', function(){
      that.source = $(this).val();
     
      if( that.source.length === 0 ) {
        that.$el.find('.nectar-lottie-preview-render').hide();
      } else {

        if( !that.source.endsWith('.json') ) {
          that.source = '';
        } else {
          that.$el.find('.nectar-lottie-preview-render').show();
        }
       
      }

      that.init();

    }).trigger('change');   

     // error.
     this.player.addEventListener("error", (e) => {
      that.$el.find('.error').show();
    });
    
    this.player.addEventListener("play", (e) => {
      that.$el.find('.error').hide();
    });

  };

  NectarLottiePreview.prototype.init = function() {

    var that = this;

    this.player = this.$el.find("lottie-player")[0];

    // Changing sources
    if( this.rendered && this.source.length > 0) {
      this.player.load(this.source);
    }

    // Initial load.
    this.player.addEventListener("rendered", (e) => {
      if( this.source.length > 0 ) {
        that.player.load(this.source);
      }

      that.rendered = true;
    });

  };


  function videoAttachFields() {

    $(".wpb_edit_form_elements .nectar-add-media-btn").on('click', function(e) {

      e.preventDefault();

      var $that = $(this);
      var custom_file_frame = null;

      custom_file_frame = wp.media.frames.customHeader = wp.media({
        title: $(this).data("choose"),
        library: {
          type: 'video'
        },
        button: {
          text: $(this).data("update")
        }
      });

      custom_file_frame.on( "select", function() {

        var file_attachment = custom_file_frame.state().get("selection").first();

        $('.wpb_edit_form_elements #' + $that.attr('rel-id') ).val(file_attachment.attributes.url).trigger('change');

        $that.parent().find('.nectar-add-media-btn').css('display','none');
        $that.parent().find('.nectar-remove-media-btn').css('display','inline-block');

      });

      custom_file_frame.open();

    });


    $(".wpb_edit_form_elements .nectar-remove-media-btn").on('click', function(e) {

      e.preventDefault();

      $('.wpb_edit_form_elements #' + $(this).attr('rel-id')).val('');
      $(this).prev().css('display','inline-block');
      $(this).css('display','none');

    });

  }



  function studioSortByDate(a, b) {

    a = parseFloat($(a).attr("data-date"));
    b = parseFloat($(b).attr("data-date"));

    return a > b ? 1 : -1;

  };

  function studioSortByAlphabetical(a, b) {

    a = $(a).find('.vc_ui-list-bar-item-trigger').text();
    b = $(b).find('.vc_ui-list-bar-item-trigger').text();

    return a < b ? 1 : -1;

  };

  function salientStudioSorting() {

    var $container = $(".vc_templates-list-default_templates");

    // Create Markup.
    var $selectEl = $('<select id="salient-studio-sorting"></select>');
    $selectEl.append('<option value="alphabetical">'+nectar_translations.alphabetical+'</option>');
    $selectEl.append('<option value="date">'+nectar_translations.date+'</option>');

    $('div[data-vc-ui-element="panel-templates"] .library_categories').prepend('<div class="library-sorting" />');
    $('div[data-vc-ui-element="panel-templates"] .library-sorting').prepend($selectEl);
    $('div[data-vc-ui-element="panel-templates"] .library-sorting').prepend('<label for="salient-studio-sorting">'+nectar_translations.sortby+'</label>');


    // Events.
    $('body').on('change','select#salient-studio-sorting', function() {

      var $items = $(".vc_templates-list-default_templates > div");

      // Convert Date to Standard JS Format.
      if( !$(".vc_templates-list-default_templates > div:first-child").is('data-date')) {
        $items.each(function() {

          var dateClass = this.className.match(/(date\-[^\s]*)/);
          if(dateClass && typeof dateClass[0] != 'undefined' ){
              var date = dateClass[0].replace('date-','');

              var formattedDate = date.split("-");
              var standardDate = formattedDate[1]+" "+formattedDate[0]+" "+formattedDate[2];
              standardDate = new Date(standardDate).getTime();
              $(this).attr("data-date", standardDate);
          } else {
            $(this).attr("data-date", '1000');
          }

        });
      }

      // Sort
      var val = $(this).val();

      if(val === 'date') {

        $items.sort(studioSortByDate).each(function(){
            $container.prepend(this);
        });

      } else if( val === 'alphabetical' ) {

        $items.sort(studioSortByAlphabetical).each(function(){
            $container.prepend(this);
        });

      }

    });


  }


  function linearInterpolate(a, b, n) {
    return (1 - n) * a + n * b;
  }

  /* Updates custom post type in post grid for tax search */
  window.nectarPostGridCustomQueryTaxCallBack = function() {
      var $filterByPostType, $taxonomies, autocomplete, defaultValue;
      if ($filterByPostType = $(".wpb_vc_param_value[name=cpt_name]", this.$content), defaultValue = $filterByPostType.val(), $taxonomies = $(".wpb_vc_param_value[name=custom_query_tax]", this.$content), void 0 === (autocomplete = $taxonomies.data("vc-param-object"))) return !1;

      $filterByPostType.on("change", function() {

          var $this = $(this);
          defaultValue !== $this.val() && autocomplete.clearValue(), autocomplete.source_data = function() {
              return {
                  vc_filter_post_type: $filterByPostType.val()
              }
          }
      }).trigger("change");
  }

  window.nectarPostGridFeaturedFirstItemCallback = function() {

    var $featuredTopItem = $(".wpb_vc_param_value[name=featured_top_item]", this.$content);
 
    $featuredTopItem.on("change", function() {

      if( $featuredTopItem.prop('checked') == true ) {
        $(".vc_shortcode-param[data-vc-shortcode-param-name=enable_masonry]", this.$content).hide();
      } else {
        $(".vc_shortcode-param[data-vc-shortcode-param-name=enable_masonry]", this.$content).show();
      }

    }).trigger('change');

  };

  window.nectarSecondaryProjectImgCallback = function() {

    var $post_type = $(".wpb_vc_param_value[name=post_type]", this.$content);
    var $grid_style = $(".wpb_vc_param_value[name=grid_style]", this.$content);
    var $overlay_secondary_image = $(".wpb_vc_param_value[name=overlay_secondary_project_image]", this.$content);

    $post_type.on("change", function() {

      if( $post_type.val() === 'portfolio' && $grid_style.val() === 'content_under_image') {
        $('.vc_edit_form_elements .custom-portfolio-dep').show();
      } 
      else {
        $('.vc_edit_form_elements .custom-portfolio-dep').hide();
        $overlay_secondary_image.prop('checked', false);
        var $switchOptions = $overlay_secondary_image.parents('.switch-options.salient');
        $switchOptions.removeClass('activated');
        $switchOptions.find('.cb-enable').removeClass('selected');
      }
      
    }).trigger('change');

    $grid_style.on("change", function() {
      if( $post_type.val() === 'portfolio' && $grid_style.val() === 'content_under_image') {
        $('.vc_edit_form_elements .custom-portfolio-dep').show();
      } 
      else {
        $('.vc_edit_form_elements .custom-portfolio-dep').hide();
        $overlay_secondary_image.prop('checked', false);
        var $switchOptions = $overlay_secondary_image.parents('.switch-options.salient');
        $switchOptions.removeClass('activated');
        $switchOptions.find('.cb-enable').removeClass('selected');
      }
    }).trigger('change');

    
  };

  
  function elSettingsPostitionRefresh() {

    /* Entering the backend editor when using the sidebar el setting position on front-end */
    if( 'admin_frontend_editor' !== window.vc_mode && 
         typeof(Storage) !== "undefined" &&
         typeof(window.setUserSetting) !== "undefined" ) {

          var frontEndSettingsLayout = (localStorage.getItem("nectar_wpbakery_settings_pos")) ? localStorage.getItem("nectar_wpbakery_settings_pos") : 'modal';

          if( frontEndSettingsLayout == 'sidebar' ) {
            window.setUserSetting('edit_element_vcUIPanelWidth','565');
            window.setUserSetting('edit_element_vcUIPanelLeft',Math.floor(($(window).width() - 565)/2) + 'px');
            window.setUserSetting('edit_element_vcUIPanelTop','150px');
          }
          
    }

  }

  jQuery(document).ready(function($) {

    nectarAdminStore.init();

    var constrainedInputs     = [],
        nectarNumericalInputs = [];

    elSettingsPostitionRefresh();

    // On modal open.
    $("#vc_ui-panel-edit-element").on('vcPanel.shown',function() {

      var $shortcode = ( $('#vc_ui-panel-edit-element[data-vc-shortcode]').length > 0 ) ? $('#vc_ui-panel-edit-element').attr('data-vc-shortcode') : '';

      // Row.
      if( 'vc_row' === $shortcode ) {

        // Device Groups
        if($('._nectar_full_screen_rows label[for="nectar_meta_on"].ui-state-active').length == 0) {
          createDeviceGroup('row-padding-device-group');
          createDeviceGroup('row-margin-device-group');
        } else {
          $('.row-padding-device-group.col-md-6').hide();
          $('.row-margin-device-group.col-md-6').hide();
        }

        createDeviceGroup('row-transform-device-group');
        createDeviceGroup('column-direction-device-group');
        createDeviceGroup('shape-divider-device-group');
        createDeviceGroup('row-bg-img-device-group');
        createDeviceGroup('clip-path-device-group');
        createDeviceGroup('clip-path-end-device-group');
        nectarClipPathDependency();

        colorOverlayPreview('row');

      } // endif row el.



      // Inner Row.
      if( 'vc_row_inner' === $shortcode ) {

          createDeviceGroup('row-position-display-device-group');
          createDeviceGroup('row-position-device-group');
          createDeviceGroup('row-padding-device-group');
          createDeviceGroup('row-transform-device-group');
          createDeviceGroup('row-min-width-device-group');
          createDeviceGroup('column-direction-device-group');

      }


      // Column.
      if( 'vc_column' === $shortcode || 'vc_column_inner' === $shortcode ) {

        createDeviceGroup('column-transform-device-group');
        createDeviceGroup('column-padding-device-group');
        createDeviceGroup('column-margin-device-group');
        createDeviceGroup('column-border-device-group');
        createDeviceGroup('column-bg-img-device-group');
        createDeviceGroup('mask-alignment-device-group');
        createDeviceGroup('column-padding-adv-device-group');
        createDeviceGroup('column-el-direction-device-group');
        createDeviceGroup('column-text-align-device-group');
        
        columnDeviceGroupHeaderToggles();

        if( 'vc_column' === $shortcode ) {
          createDeviceGroup('column-max-width-device-group');
        }

        colorOverlayPreview('column');
      }

     
      
      if( 'vc_column' !== $shortcode && 
          'vc_column_inner' !== $shortcode && 
          'vc_row' !== $shortcode ) {
          colorOverlayPreview('general');
      }

      if( 'nectar_global_section' === $shortcode ) {
        new SalientGlobalSections($('#vc_ui-panel-edit-element .wpb_el_type_nectar_global_section_select .edit_form_line'));
      }

      if( 'image_with_animation' === $shortcode ) {
        createDeviceGroup('image-margin-device-group');
        createDeviceGroup('image-custom-width-device-group');
        createDeviceGroup('position-display-device-group');
        createDeviceGroup('position-device-group');
        createDeviceGroup('transform-device-group');
        createDeviceGroup('mask-alignment-device-group');

        $('[data-vc-shortcode="image_with_animation"] [data-vc-shortcode-param-name="max_width"] select[name="max_width"]').on('change', function(){
          if($(this).val() != 'custom') {
            $('.image-custom-width-device-group-header').hide();
          } else {
            $('.image-custom-width-device-group-header').show();
          }
        }).trigger('change');

      }

      if( 'nectar_icon' === $shortcode ) {
        createDeviceGroup('position-device-group');
        createDeviceGroup('position-display-device-group');
        createDeviceGroup('transform-device-group');
      }

      if( 'nectar_cta' === $shortcode ) {
        createDeviceGroup('alignment-device-group');
        createDeviceGroup('display-device-group');
        createDeviceGroup('font-size-device-group');
        createDeviceGroup('position-display-device-group');
        createDeviceGroup('position-device-group');
        createDeviceGroup('transform-device-group');
      }

      if( 'divider' === $shortcode ) {
        createDeviceGroup('divider-height-device-group');
      }

      if( 'split_line_heading' === $shortcode ||
          'testimonial_slider' === $shortcode ) {
        createDeviceGroup('font-size-device-group');
      }

      if( 'nectar_text_inline_images' === $shortcode ) {
        createDeviceGroup('margin-device-group');
        createDeviceGroup('font-size-device-group');
      }

      if( 'fancy_box' === $shortcode ) {
        createDeviceGroup('fancybox-min-height-device-group');
      }

      if('fancy-ul' === $shortcode) {
        createDeviceGroup('font-size-device-group');
      }

      if( 'item' === $shortcode ) {
        simpleSliderFields();
      }

      if( 'nectar_video_player_self_hosted' === $shortcode ) {
        createDeviceGroup('video-aspect-ratio-device-group');
      }

      if( 'nectar_lottie' === $shortcode ) {
        createDeviceGroup('lottie-dimensions-device-group');
        createDeviceGroup('position-device-group');
        createDeviceGroup('position-display-device-group');
        createDeviceGroup('transform-device-group');
      }

      if( 'nectar_circle_images' === $shortcode ) {
        createDeviceGroup('circle-images-alignment-device-group');
      }
      
      if( 'nectar_badge' === $shortcode ) {
        createDeviceGroup('position-device-group');
        createDeviceGroup('position-display-device-group');
        createDeviceGroup('transform-device-group');
      }

      if( 'nectar_highlighted_text' === $shortcode ) {
        createDeviceGroup('font-size-device-group');
      }

      if( 'nectar_price_typography' === $shortcode ) {
        createDeviceGroup('font-size-device-group');
      }

      if( 'nectar_responsive_text' === $shortcode ) {
        createDeviceGroup('font-size-device-group');
      }

      if ('nectar_animated_shape' === $shortcode) {
        createDeviceGroup('dimensions-device-group');
        createDeviceGroup('position-device-group');
        createDeviceGroup('transform-device-group');
        createDeviceGroup('position-display-device-group');
      }

      if ('nectar_lottie' === $shortcode) {

        $('.vc_edit_form_elements .nectar-lottie-preview').each(function(){
          new NectarLottiePreview($(this));
        });
        
      }


      // Device Group Events.
      if( 'vc_column' === $shortcode ||
      'vc_column_inner' === $shortcode ||
      'vc_row_inner' === $shortcode ||
      'vc_row' === $shortcode ||
      'image_with_animation' === $shortcode ||
      'divider' === $shortcode ||
      'fancy_box' === $shortcode ||
      'nectar_cta' === $shortcode ||
      'split_line_heading' === $shortcode ||
      'nectar_text_inline_images' === $shortcode ||
      'testimonial_slider' === $shortcode ||
      'nectar_video_player_self_hosted' === $shortcode ||
      'nectar_icon' === $shortcode ||
      'nectar_lottie' === $shortcode ||
      'nectar_animated_shape' === $shortcode ||
      'nectar_price_typography' === $shortcode ||
      'nectar_responsive_text' === $shortcode ||
      'nectar_badge' === $shortcode ||
      'nectar_highlighted_text' === $shortcode ||
      'fancy-ul' === $shortcode ||
      'nectar_circle_images' === $shortcode ) {
        deviceGroupEvents();
      }

      // Radio tabs
      nectarRadioTabEvents();

      // Fancy checkboxes.
      nectarFancyCheckboxes();

      // Gradient Colorpickers.
      nectarGradientColorpicker();

      // Range sliders.
      nectarRangeSliders();

      // Box Shadow Generators.
      nectarBoxShadowGeneratorInit();

      // Video field.
      videoAttachFields();

      // When full screen rows is active, do not create numerical inputs for disabled params
      if($('._nectar_full_screen_rows label[for="nectar_meta_on"].ui-state-active').length > 0 && 'vc_row' === $shortcode ) {

        $('.wpb_edit_form_elements .row-padding-device-group, .wpb_edit_form_elements .row-margin-device-group').addClass('fullscreen-rows-disabled');

      }

      // Constrained values.
      $('.wpb_edit_form_elements input[type="checkbox"][class*="constrain_group_"]').each(function(i) {
        constrainedInputs[i] = new ConstrainedInput($(this));
      });

      // Number Scrubber.
      $('input[type="text"].nectar-numerical').each(function(){
        nectarNumericalInputs = new NectarNumericalInput($(this));
      });


    }); // Modal open end.

    // Modal loading markup.
    salientElementSettingsLoading();

    // Salient Studio Template Sorting
    salientStudioSorting();

    // Fancy checkbox events.
    nectarFancyCheckboxEvents();

    // Custom radio parms
    nectarFancyRadioEvents();

    // Dynamic el styling - front end page builder
    $(window).on('load', function() {

      if( typeof window.vc_mode !== 'undefined' && 'admin_frontend_editor' === window.vc_mode ) {

        $(window).on('nectar_wpbakery_el_save nectar_wpbakery_template_add', function() {

          var page_content = window.vc.builder.getContent();

          if( page_content.length > 0 ) {

            $.ajax({
              type: 'POST',
              url: window.ajaxurl,
              data: {
                'action': 'nectar_frontend_builder_generate_styles',
                '_vcnonce': window.vcAdminNonce,
                'nectar_page_content': page_content
              },
              success: function(response) {

                var style = document.createElement('style');

        				style.type = 'text/css';
                style.setAttribute('id','salient-el-dynamic-ajax');
        				if (style.styleSheet) {
        					style.styleSheet.cssText = response;
        				} else {
        					style.appendChild(document.createTextNode(response));
        				}

                // Clean up previous styles.
                var dynamicCSSLength = window.vc.frame_window.jQuery("body").find('style[id="salient-el-dynamic-ajax"]').length;

                if( dynamicCSSLength > 2 ) {
                  window.vc.frame_window.jQuery("body").find('style[id="salient-el-dynamic-ajax"]:first').remove();
                }

                window.vc.frame_window.jQuery("body").append(style);

              } // success

            }); //ajax

          }

        });

        $('body').on('mouseup','.vc_templates-template-type-default_templates button.vc_ui-list-bar-item-trigger',function(){

          // When adding studio template, also regenerate the dynamic css
          setTimeout(function() {
            $(window).trigger('nectar_wpbakery_el_save');
          },1600);

        });


      } // on front end editor

    }); // end dynamic el styling

  });

})(jQuery);
