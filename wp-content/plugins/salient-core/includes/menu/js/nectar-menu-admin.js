/**
 * Nectar Menu Admin.
 *
 * @package Salient
 * @author ThemeNectar
 */

(function( $ ) {

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
        $('#nectar-menu-settings-modal .setting-field[class*="nectar-setting-numerical"]')
          .removeClass('scrubbing')
          .removeClass('no-scrubbing');
      });
    },
    init: function() {
      this.bindEvents();
    }
  };
  nectarAdminStore.init();

  function NectarMenuAdmin() {

    this.$modalWrap = $('#nectar-menu-settings-modal-wrap');
    this.$modal = $('#nectar-menu-settings-modal');
    this.$modalInner = this.$modal.find('.nectar-menu-settings-inner');
    this.$form = this.$modal.find('.menu-options-form');
    this.$modalOverlay = $('#nectar-menu-settings-overlay');
    this.$saveBtn = this.$modal.find('.bottom-controls .save');

    this.state = {
      modalOpen: false,
      category: '',
      saving: false,
      id: false,
    };

    this.saveTimeout = false;

    this.createDomEls();
    this.modalEvents();

  }

  NectarMenuAdmin.prototype.createDomEls = function() {
    $('#menu-to-edit li.menu-item > .menu-item-settings').each(function() {
      if( $(this).find('.nectar-menu-item-editor').length == 0 ) {
        $(this).prepend('<span class="nectar-menu-item-editor">'+ nectar_menu_i18n.edit_button_text +'</span>');
      }
    });
  };

  NectarMenuAdmin.prototype.modalEvents = function() {

    var that = this;

    // Open mnu item settings.
    $('body').on('click', '.nectar-menu-item-editor', function() {

      if( that.state.modelOpen ) {
        return false;
      }

      var parentMenuItem = $(this).parents('.menu-item');

      // Store ID.
      var menuID = parentMenuItem.attr('id').match(/[0-9]+/);
      if( menuID ) {
        that.state.id = parseInt( menuID[0], 10 );
      } else {
        return false; // can't grab ID
      }


      // Get menu info to pass.
      var menuItemInfo = {
          parent_id: $('.menu-edit input#menu').val(),
          menu_item_depth: parentMenuItem.attr('class').match(/\menu-item-depth-(\d+)\b/)[1],
          menu_item_id: that.state.id,
          menu_item_name: parentMenuItem.find('.item-title .menu-item-title').text()
      };

      // Show modal.
      that.$modalWrap.addClass('open').addClass('loading');
      that.$modalOverlay.addClass('open');
      that.$modal.find('> .header .menu-item-name').text(menuItemInfo.menu_item_name);

      // Display categories that exist per depth.
      that.$modal.find('.header .categories a').removeClass('hidden');

      if( menuItemInfo.menu_item_depth == 0 ) {
        //that.$modal.find('.header .categories a[data-rel="menu-item"]').addClass('hidden');
      } else if( menuItemInfo.menu_item_depth > 1 ) {
        that.$modal.find('.header .categories a[data-rel="mega-menu"]').addClass('hidden');
      }

      // Get form data.
      $.ajax({
          type: 'POST',
          url: nectar_menu.ajaxurl,
          data: {
              action: "nectar_menu_item_settings",
              menu_item_depth: menuItemInfo.menu_item_depth,
              menu_item_id: menuItemInfo.menu_item_id,
              parent_id: menuItemInfo.parent_id,
              menu_item_name: menuItemInfo.menu_item_name,
              nonce: nectar_menu.nonce
          },
          cache: false,
          success: function (response) {

            that.$modalWrap.removeClass('loading');

            // Add HTML.
            that.$form.html(response);
            that.fieldsInit();

            that.state.modelOpen = true;

            var $startingCat = that.$modalWrap.find('.header .categories a:not(.hidden)').first();
            $startingCat.addClass('no-transition').trigger('click');
            that.state.category = $startingCat.attr('data-rel');

            setTimeout(function() {
              that.$modalWrap.find('.header .categories a.no-transition').removeClass('no-transition');
            },100);

          }
      }); // end ajax.

    }); // end click.

    // Save.
    $('body').on('click', '#nectar-menu-settings-modal .bottom-controls .save', function(e) {

      if( !that.state.modelOpen || that.state.saving || !that.state.id ) {
        return false;
      }

      e.preventDefault();

      that.state.saving = true;

      // Saving feedback.
      that.$saveBtn.addClass('saving');
      that.$saveBtn.find('.dynamic').text(nectar_menu_i18n.saving);

      // Serialize form data.
      var serializedData = that.$form.serializeFormWithArrs();

      // Save form data.
      $.ajax({
          type: 'POST',
          url: nectar_menu.ajaxurl,
          data: {
              action: "nectar_menu_item_settings_save",
              nonce: nectar_menu.nonce,
              id: that.state.id,
              options: serializedData
          },
          cache: false,
          success: function (response) {

            that.state.saving = false;

            if( !response ) {
              return false;
            }

            that.$saveBtn.removeClass('saving');

            if( response.type === 'success' ) {
              that.$saveBtn.addClass('success');
              that.$saveBtn.find('.dynamic').text(nectar_menu_i18n.success);
            } else {
              that.$saveBtn.addClass('error');
              that.$saveBtn.find('.dynamic').text(nectar_menu_i18n.error);
            }

            that.saveTimeout = setTimeout(function() {
              that.$saveBtn.removeClass('error').removeClass('success');
              that.state.saving = false;
            },2500);
          }
      }); // end ajax.

    });

    // Close.
    $('body').on('click','#nectar-menu-settings-modal .close-modal, #nectar-menu-settings-overlay.open', function(e) {

      if( that.state.saving ) {
        return false;
      }

      e.preventDefault();

      that.$modal.css({
        'opacity': '0',
        'transform': 'scale(0.85)'
      });
      that.$modalOverlay.css({
        'opacity': '0'
      });

      setTimeout(function() {
         that.$modal.find('> .header .menu-item-name').text('');
         that.$form.html('');
         that.$modal.css({'opacity':'', 'transform':''});
         that.$modalWrap.removeClass('open').addClass('loading');
         that.$modalOverlay.css('opacity','').removeClass('open');
         that.$modal.find('.header .categories a').removeClass('active');

         that.state.modelOpen = false;
         that.state.id = false;

      },550);

    });

    // Tabs.
    $('body').on('click','#nectar-menu-settings-modal > .header .categories a', function(e) {

      e.preventDefault();

      var rel = $(this).attr('data-rel');
      var $clickedLink = $(this);

      if( that.state.modelOpen ) {
        that.state.category = rel;
        that.$modal.find('.header .categories a').removeClass('active');
        $clickedLink.addClass('active');

        // Show items in current tab.
        that.$modal.find('.setting-field').hide();
        that.$modal.find('.setting-field[data-cat="'+rel+'"]:not(.dep-hidden)').show();

        // Hide/Show deps.
        that.$modal.find('.nectar-setting-dropdown[data-toggles] select, .nectar-setting-dropdown[data-icon-container] select').trigger('change');
        that.$modal.find('.nectar-setting-switch_toggle[data-toggles] .switch-options.salient input[type="hidden"]').trigger('change');

      }

    });


    // Adding new menu item.
    $(document).on('menu-item-added', this.createDomEls.bind(this));

  };

  NectarMenuAdmin.prototype.fieldsInit = function() {
    this.fieldSwitch();
    this.fieldImageUpload();
    this.fieldIcon();
    this.fieldDropdownToggle();
    this.fieldNumerical();
    this.fieldAlignment();
    this.fieldColor();
  };

  NectarMenuAdmin.prototype.fieldColor = function() {
    var that = this;
    that.$modalInner.find('.nectar-option-colorpicker input.popup-colorpicker').wpColorPicker({
      palettes: [nectar_menu.colors.color1, nectar_menu.colors.color2, nectar_menu.colors.color3, nectar_menu.colors.color4, nectar_menu.colors.color5, nectar_menu.colors.color6]
    });

  }

  NectarMenuAdmin.prototype.fieldAlignment = function() {

    var that = this;
    that.$modalInner.find('.nectar-setting-alignment .selection span').on('click', function() {

      var $parent = $(this).closest('.nectar-setting-alignment');
      $parent.find('.setting input[type="hidden"]').val($(this).attr('data-pos'));

      $(this).siblings('span').removeClass('active');
      $(this).addClass('active');

    });

  };

  // Switch.
  NectarMenuAdmin.prototype.fieldSwitch = function() {

    var that = this;

    that.$modalInner.find('.switch-options.salient .cb-enable').on('click',function() {
      var parent = $(this).parents( '.switch-options' );

      $( '.cb-disable', parent ).removeClass( 'selected' );
      $( this ).addClass( 'selected' );

      $(this).parent().addClass( 'activated');
      $( 'input[type="hidden"]', parent ).val('on');
      $( 'input[type="hidden"]', parent ).trigger('change');
    });

    that.$modalInner.find('.switch-options.salient .cb-disable').on('click',function() {
      var parent = $(this).parents( '.switch-options' );

      $( '.cb-enable', parent ).removeClass( 'selected' );
  		$( this ).addClass( 'selected' );
  		$(this).parent().removeClass('activated');

      $( 'input[type="hidden"]', parent ).val('');
      $( 'input[type="hidden"]', parent ).trigger('change');

    });

 
    that.$modalInner.find('.switch-options.salient input[type="hidden"]').on('change',function(e) {

      var $parent = $(this).parents('.nectar-setting-switch_toggle');
      
      if( $(this).parents('.setting-field').attr('data-cat') !== that.state.category ) {
        return;
      }
      
      if( $parent.is('[data-toggles]') ) {

        var toggles = $parent.attr('data-toggles');

        if( $(this).val() == 'on' ) {
          that.$modalInner.find('#'+toggles).parents('.setting-field').show();
        } else {
          that.$modalInner.find('#'+toggles).parents('.setting-field').hide();
        }

      }

    });

  };

  // Numerical field.
  NectarMenuAdmin.prototype.fieldNumerical = function() {

    var that = this;
    var nectarNumericalInputs = [];

    that.$modalInner.find('input.nectar-numerical').each(function(i) {
        nectarNumericalInputs[i] = new NectarNumericalInput($(this));
    });

  };

  // Dropdown with deps.
  NectarMenuAdmin.prototype.fieldDropdownToggle = function() {

    var that = this;
    that.$modalInner.find('.nectar-setting-dropdown[data-toggles]').each(function() {

      var $parentSetting = $(this);

      $(this).find('.setting select').on('change',function() {

        if( $(this).parents('.setting-field').attr('data-cat') !== that.state.category ) {
          return;
        }

        // Hide Deps.
        that.$modalInner.find('[id*="' + $parentSetting.attr('data-toggles') + '"]').parents('.setting-field').hide().addClass('dep-hidden');

        // Show Dep.
        var selectedVal = $(this).val();
        if( that.$modalInner.find('[id*="' + $parentSetting.attr('data-toggles') + '_' + selectedVal + '"]').length > 0 ) {
          that.$modalInner.find('[id*="' + $parentSetting.attr('data-toggles') + '_' + selectedVal + '"]').parents('.setting-field').show().removeClass('dep-hidden');
        }

      }).trigger('change');

    });

  };

  // Icon Selection.
  NectarMenuAdmin.prototype.fieldIcon = function() {

    var that = this;
    that.$modalInner.find('.nectar-setting-dropdown[data-icon-container]').each(function() {

      var $iconSelect             = that.$modalInner.find('#' + $(this).attr('data-icon-container')).parents('.setting-field');
      var $iconIconsmindSelect    = that.$modalInner.find('#' + $(this).attr('data-iconsmind-container')).parents('.setting-field');
      var $iconCustomSelect       = that.$modalInner.find('#' + $(this).attr('data-icon-custom')).parents('.setting-field');
      var $iconCustomTextSelect   = that.$modalInner.find('#' + $(this).attr('data-icon-custom-text')).parents('.setting-field');
      var $iconCustomBorderRadius = that.$modalInner.find('#' + $(this).attr('data-icon-custom-border-radius')).parents('.setting-field');

      $(this).find('.setting select').on('change',function(){

        if( $(this).parents('.setting-field').attr('data-cat') !== that.state.category ) {
          return;
        }

        var val = $(this).val();

        if( val === 'font_awesome' ) {
            $iconSelect.show().removeClass('dep-hidden');
            $iconIconsmindSelect.hide().addClass('dep-hidden');
            $iconCustomTextSelect.hide().addClass('dep-hidden');
            $iconCustomSelect.hide().addClass('dep-hidden');
            $iconCustomBorderRadius.hide().addClass('dep-hidden');
        } else if ( val === 'custom' ) {
          $iconSelect.hide().addClass('dep-hidden');
          $iconIconsmindSelect.hide().addClass('dep-hidden');
          $iconCustomTextSelect.hide().addClass('dep-hidden');
          $iconCustomSelect.show().removeClass('dep-hidden');
          $iconCustomBorderRadius.show().removeClass('dep-hidden');
        }
        else if ( val === 'custom_text' ) {
          $iconSelect.hide().addClass('dep-hidden');
          $iconIconsmindSelect.hide().addClass('dep-hidden');
          $iconCustomSelect.hide().addClass('dep-hidden');
          $iconCustomBorderRadius.hide().addClass('dep-hidden');
          $iconCustomTextSelect.show().removeClass('dep-hidden');
        }
        else if ( val === 'iconsmind' ) {
          $iconSelect.hide().addClass('dep-hidden');
          $iconIconsmindSelect.show().removeClass('dep-hidden');
          $iconCustomSelect.hide().addClass('dep-hidden');
          $iconCustomBorderRadius.hide().addClass('dep-hidden');
          $iconCustomTextSelect.hide().addClass('dep-hidden');
        }
        else {
          $iconIconsmindSelect.hide().addClass('dep-hidden');
          $iconSelect.hide().addClass('dep-hidden');
          $iconCustomSelect.hide().addClass('dep-hidden');
          $iconCustomTextSelect.hide().addClass('dep-hidden');
          $iconCustomBorderRadius.hide().addClass('dep-hidden');
        }

      }).trigger('change');

    });

    // Font Awesome
    that.$modalInner.find('.nectar-icon-container').each(function() {

      var $iconContainer        = $(this);
      var $iconHiddenInput     = $(this).parent().find('input[type="hidden"]');
      var $iconSelected        = $(this).parent().find('.selected-icon');
      var $iconSelectedPreview = $(this).parent().find('.selected-icon span');

      // Select Icon
      $(this).find('> span').on('click', function() {

        var icon = $(this).find('> i');

        // Store selected.
        $iconHiddenInput.val(icon.attr('class'));

        // Active class.
        $(this).siblings('span').removeClass('active');
        $(this).addClass('active');

        // Show Preview/Remove.
        $iconSelected.removeClass('hidden');
        $iconSelectedPreview.html('<i class="'+icon.attr('class')+'"></i>');

      });

      // Remove Icon.
      $iconSelected.find('a').on('click', function() {
        $iconHiddenInput.val('');
        $iconSelectedPreview.html('');
        $iconContainer.find('span').removeClass('active');
        $(this).parent().addClass('hidden');

        return false;
      });

    });

    that.$modalInner.find('.nectar-setting-icon input[name="icon_search"]').each(function() {

      $(this).on('keyup', function() {

        var searchValue = $(this).val().toLowerCase();
        var $icons = $(this).parents('.nectar-setting-icon').find('.nectar-icon-container span');

        if( searchValue.length == 0 ) {
          $icons.removeClass('hidden');
          return true;
        }

        $icons.each(function() {

          var iconName = $(this).find('i').attr('class').toLowerCase();

          if( iconName.indexOf(searchValue) != -1 ) {
            $(this).removeClass('hidden');
          } else {
            $(this).addClass('hidden');
          }

        });

      });

    });

  };

  // Image Field.
  NectarMenuAdmin.prototype.fieldImageUpload = function() {

    var that = this;

    that.$modalInner.find(".nectar-add-btn").on('click', function(e) {

      var $that = $(this);

      e.preventDefault();

      var image_add_frame = null;
      image_add_frame = wp.media.frames.customHeader = wp.media({
        title: $(this).attr('data-title'),
        library: {
          type: 'image'
        },
        button: {
          text: $(this).attr('data-update')
        }
      });

      image_add_frame.on( "select", function() {

        var image_attachment = image_add_frame.state().get("selection").first();
        var image_attachment_url = image_attachment.attributes.url;
        var image_attachment_id = image_attachment.attributes.id;

        $that.parent().find('.nectar-media-preview').attr('src', image_attachment_url);

        $('#' + $that.attr('rel-id') + '-url' ).val(image_attachment_url).trigger('change');
        $('#' + $that.attr('rel-id') + '-id' ).val(image_attachment_id).trigger('change');

        $that.parent().find('.nectar-add-btn').css({
          'display': 'none'
        });
        $that.parent().find('.nectar-media-preview').show();
        $that.parent().find('.nectar-remove-btn').css({
          'display': 'inline-block'
        });

      });

      image_add_frame.open();

    });

    that.$modalInner.find(".nectar-remove-btn").on('click', function(e) {

      e.preventDefault();
      $('#' + $(this).attr('rel-id') + '-url').val('');
      $('#' + $(this).attr('rel-id') + '-id').val('');

      $(this).parents('.setting').find('.nectar-add-btn').css({
        'display': 'inline-block'
      });

      $(this).parent().find('.nectar-media-preview').hide();
      $(this).css({
        'display': 'none'
      });

    });

  };

  /* Helpers */
  $.fn.serializeFormWithArrs = function() {
  var data = {};

  function buildInputObject(arr, val) {
    if (arr.length < 1) {
      return val;
    }
    var objkey = arr[0];
    if (objkey.slice(-1) == "]") {
      objkey = objkey.slice(0,-1);
    }
    var result = {};
    if (arr.length == 1){
      result[objkey] = val;
    } else {
      arr.shift();
      var nestedVal = buildInputObject(arr,val);
      result[objkey] = nestedVal;
    }
    return result;
  }

  $.each(this.serializeArray(), function() {
    var val = this.value;
    var c = this.name.split("[");
    var a = buildInputObject(c, val);
    $.extend(true, data, a);
  });

  return data;
}

function linearInterpolate(a, b, n) {
  return (1 - n) * a + n * b;
}


/* Numerical input */
function NectarNumericalInput(el) {

  this.$el = el;
  this.$scrubber = '';
  this.$scrubberIndicator = '';
  this.scrubberIndicatorX = 0;
  this.initialX = 0;
  this.calculatedVal = 0;
  this.scrubberCurrent = 0;
  this.currentVal = 0;
  this.zeroFloor = true;
  this.ceil = ( el.parents('.setting-field[data-ceil]').length > 0 ) ? parseInt(el.parents('.setting-field[data-ceil]').attr('data-ceil')) : 1000000;
  this.rateAdjustment = 6;

  this.connectedUnitsEl = ( this.$el.parents('.setting').find('select[id*="units"]').length > 0 ) ? this.$el.parents('.setting').find('select[id*="units"]') : false;
  this.events();
  this.rateAdjustmentUpdate();
  this.createMarkup();
  this.scrubbing();

}

NectarNumericalInput.prototype.events = function() {
  if( this.connectedUnitsEl ) {
    this.connectedUnitsEl.on('change',this.rateAdjustmentUpdate.bind(this));
  }
};

NectarNumericalInput.prototype.rateAdjustmentUpdate = function() {

  var that = this;
  this.rateAdjustment = 6;

  if( this.connectedUnitsEl ) {
    var val = this.connectedUnitsEl.val();
    if( val === 'px' ) {
      that.rateAdjustment = 2;
    }
  }

}

NectarNumericalInput.prototype.createMarkup = function() {

  this.$el.parents('.setting').addClass('nectar-numerical-setting');
  this.$el.parent().append('<span class="scrubber" />');

  this.$scrubber = this.$el.parents('.numerical-input-wrap').find('.scrubber');
  this.$scrubber.append('<span class="inner"/>');
  this.$scrubber.find('.inner').append('<span />');
  this.$scrubber.append('<i class="dashicons dashicons-arrow-left-alt2" />');
  this.$scrubber.append('<i class="dashicons dashicons-arrow-right-alt2" />');

  this.$scrubberIndicator = this.$scrubber.find('.inner span');
};


NectarNumericalInput.prototype.scrubbing = function() {

  var that = this;

  this.$scrubber.on('mousedown',function() {

    $('#nectar-menu-settings-modal .setting-field[class*="nectar-setting-numerical"]').addClass('no-scrubbing');
    that.$el.parents('.setting-field').removeClass('no-scrubbing').addClass('scrubbing');

    // Track that the mouse is down / store initial
    nectarAdminStore.mouseUp = false;

    // Starting pos
    that.initialX = nectarAdminStore.mouseX;

    // Empty
    if( that.$el.val().length == 0 ) {

      this.scrubberCurrent = 0;
      that.currentVal = 0;

    } else {

      that.currentVal = that.$el.val();

      if( that.$scrubberIndicator.css('transform') != 'none' ) {
        var transformMatrix = that.$scrubberIndicator.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
        that.scrubberCurrent = transformMatrix[12] || transformMatrix[4];
      }

      if( isNaN( parseInt(that.currentVal) ) ) {
        that.currentVal = '0';
      }


    }

    // Change value RAF loop
    requestAnimationFrame(that.scrubbingAlter.bind(that));

  });


};


NectarNumericalInput.prototype.scrubbingAlter = function(e) {

  if( nectarAdminStore.mouseUp != true ) {
    requestAnimationFrame(this.scrubbingAlter.bind(this))
  }

  //// Every 3 pixels moved, ++ or --
  this.calculatedVal = parseInt(this.currentVal) + parseInt(nectarAdminStore.mouseX - this.initialX)/this.rateAdjustment;

  //// Who wants decimals??
  this.calculatedVal = Math.floor(this.calculatedVal);

  //// Floor/Ceil
  if( this.zeroFloor && this.calculatedVal < 0) {
    this.$el.val(0);
  }
  else if( this.calculatedVal > this.ceil ) {
      this.$el.val(this.ceil);
  } else {

    // Ceil
    this.$el.val(this.calculatedVal);

    // Indicator
    this.scrubberIndicatorX = linearInterpolate(this.scrubberIndicatorX, parseInt(this.scrubberCurrent) + parseInt(nectarAdminStore.mouseX - this.initialX)/4, 0.14);

    this.$scrubberIndicator.css({
      'transform': 'translate3d('+ this.scrubberIndicatorX +'px, 0px, 0px)'
    });

  }



}






  // Document ready.
  jQuery(document).ready(function($) {
    var nectarMenuAdminInstance = new NectarMenuAdmin();
  });

}( jQuery ));
