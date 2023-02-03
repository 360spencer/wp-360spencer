(function($) {

  "use strict";

  /* List View */
  function NectarWPBakeryListView() {

    this.state = {
      open: false,
      throttle: '',
      expanded_els: []
    }

    this.map = [];
    this.data = [];
    this.winH = window.innerHeight;
    this.winW = window.innerWidth - 320;

    this.createDOM();
    this.events();

  }

  NectarWPBakeryListView.prototype.createDOM = function() {
    $('.vc_navbar-frontend .vc_navbar-nav').append($('<li class="pull-right"><a id="nectar-list-view-trigger" class="vc_icon-btn vc_element-button" href="#"><i class="nectar_el_icon element-navigator"></i><span>'+window.nectar_wpbakery_i18n.element_navigator+'</span></a></li>'));
    $('body').append($('<div id="nectar-list-view-content"/>'));
    
    this.$el = $('#nectar-list-view-content');
  }

  NectarWPBakeryListView.prototype.events = function() {

    var that = this;

    // Shortcodes have changed.
    window.vc.events.on("app.render", this.updateListView.bind(this));
    window.vc.events.on("undoredo:add undoredo:undo undoredo:redo shortcodeView:ready", function() {

      clearTimeout(that.state.throttle);

      // throttle.
      that.state.throttle = setTimeout(function(){
        that.updateListView();
      },50);
    });

    // Clear expanded state on undo/redo.
    window.vc.events.on("undoredo:undo undoredo:redo", function() {
      that.state.expanded_els = [];
    });

    // Toggle list view.
    document.getElementById("nectar-list-view-trigger").addEventListener('click', this.toggleListView.bind(this));

    // Edit list view items.
    $('body').on('click', '#nectar-list-view-content a', {instance: this}, this.elEdit);

    // Hover list view items.
    $('body').on('mouseenter', '#nectar-list-view-content .flex', this.elHighlight);
    $('body').on('mouseleave', '#nectar-list-view-content .flex', this.elHighlightRemove);

    // List view toggle.
    $('body').on('click', '#nectar-list-view-content .toggle-group', {instance: this}, this.toggleListViewItem);

    // Track window height.
    window.addEventListener('resize', function() {
      that.winH = window.innerHeight;
      that.winW = window.innerWidth - 330;
    });

  };

  NectarWPBakeryListView.prototype.convertToTree = function(list) {

    var node, roots = [], i;
      
    for (i = 0; i < list.length; i += 1) {
      this.map[list[i].attributes.id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }
    
    for (i = 0; i < list.length; i += 1) {

      node = list[i];

      var disabled = ( typeof node.attributes.params.disable_element != 'undefined' && node.attributes.params.disable_element == 'yes') ? true : false;

      // Children.
      if (node.attributes.parent_id != 0 ) {
        
        if( !disabled ) {
          list[this.map[node.attributes.parent_id]].children.push(node);

          // Keep order.
          list[this.map[node.attributes.parent_id]].children.sort(this.treeOrder);
        }

      } 

      // Root rows.
      else {

        if( typeof node.settings.name != 'undefined' && !disabled ) {
          roots.push(node);
          
          // Keep order.
          roots.sort(this.treeOrder);
        }
      }
    }

    return roots;
  }


  NectarWPBakeryListView.prototype.treeOrder = function(a,b) {
    if( a.attributes.order > b.attributes.order ) {
      return 1;
    } 
    else if( a.attributes.order < b.attributes.order ) {
      return -1;
    }
    return 0;
  }

  NectarWPBakeryListView.prototype.outputTree = function(box,data) {

    var arrow = '', icon = '';

    for (var i = 0; i < data.length; i++) {

      var _oUl = document.createElement("ul");
      var _oLi = document.createElement("li");

      // toggle arrow.
      if( data[i].settings.is_container == true && data[i].children.length > 0 ) { 
        _oLi.classList.add('container-toggle');
        arrow = '<div class="dashicons dashicons-arrow-down toggle-group"> </div>';
      } else {
        arrow = '';
      }

      // el icon.
      if( data[i].settings.icon ) {
        icon = '<i class="nectar_el_icon ' + data[i].settings.icon + '"></i>';
      } else if( data[i].attributes.shortcode.indexOf('vc_column') != -1 ) {
        icon = '<i class="nectar_el_icon icon-vc_column"></i>';
      } else {
        icon = '<i class="nectar_el_icon vc_general"></i>';
      }
      
      if( data[i].attributes.shortcode.indexOf('column') != -1 || data[i].attributes.shortcode.indexOf('row') != -1  ) {
        _oLi.classList.add('core-container');
      }
      _oLi.setAttribute('data-id', data[i].attributes.id);
     
      _oLi.innerHTML = '<span class="flex">'+ arrow +'<a data-shortcode="'+data[i].attributes.shortcode+'" data-id="'+ data[i].attributes.id +'" href="#">' + icon + data[i].settings.name + '</a>';

      if(data[i].children){
        _oLi.appendChild(_oUl);
        this.outputTree(_oUl,data[i].children);
      }
      box.appendChild(_oLi);
    }

  }


  NectarWPBakeryListView.prototype.updateListView = function(e) {

    if(!this.state.open) {
      return;
    }

    var that = this;

    this.data = window.vc.shortcodes;
   

    // Walk and render.
    this.data = this.convertToTree(this.data.models);

    this.$el.html('<ul />');

    this.outputTree(this.$el.find('ul')[0], this.data);

    // Persist open/closed state.
    //// Handle deleted items.
    this.state.expanded_els = this.state.expanded_els.filter(function(id) {
      if (typeof that.map[id] === 'undefined') {
        return false;
      }
      return true;
    });


    //// Open active.
    this.state.expanded_els.forEach(function(id) {
      that.$el.find('li[data-id="'+id+'"] > .flex > .toggle-group')[0].click();
    });

  }
   
  

  NectarWPBakeryListView.prototype.elEdit = function(e) {
    
    e.preventDefault();

    var that = e.data.instance;
    var id = $(this).attr('data-id');
    var shortcode = $(this).attr('data-shortcode');
    var controls;

    // Scroll to element.
    var el = vc.frame_window.jQuery('[data-model-id="'+id+'"]')[0];
    var elRect = el.getBoundingClientRect();
    
    if( elRect.left < that.winW && vc.frame_window.jQuery('#nectar_fullscreen_rows').length == 0 ) {
      el.scrollIntoView({
        behavior: "smooth",
        block: (el.clientHeight < that.winH) ? "center" : "start"
      });
    }

    if (e.shiftKey) {
      return true;
    }

    // Open edit settings.
    if( shortcode === 'vc_row' || shortcode === 'vc_row_inner' ) {
      controls = vc.frame_window.jQuery('[data-model-id="'+id+'"] > .wpb_row > .span_12 > .vc_container-block > .vc_controls');

      if( vc.frame_window.jQuery('#nectar_fullscreen_rows').length > 0 && shortcode === 'vc_row' ) {
        controls = vc.frame_window.jQuery('[data-model-id="'+id+'"] .full-page-inner .span_12').first();
        if( controls ) {
          controls = controls.find('> .vc_container-block > .vc_controls');
        }
      }

      controls.find('.vc_controls-out-tl .vc_parent .vc_advanced .vc_control-btn-edit')[0].click();
    } 

    else if( shortcode === 'vc_column' || shortcode === 'vc_column_inner' ) {
      controls = vc.frame_window.jQuery('[data-model-id="'+id+'"] > .vc_controls');
      controls.find('.vc_controls-out-tl .vc_element .vc_advanced .vc_control-btn-edit')[0].click();
    } 

    else if( shortcode === 'carousel' || 
             shortcode === 'toggles' ||
             shortcode === 'testimonial_slider' ||
             shortcode === 'clients' ||
             shortcode === 'page_submenu' ||
             shortcode === 'tabbed_section' ||
             shortcode === 'pricing_table' ||
             shortcode === 'nectar_icon_list' ) {

              controls = vc.frame_window.jQuery('[data-model-id="'+id+'"] .vc_controls-out-tr .parent-'+shortcode+' .vc_advanced').first();
              controls.find('.vc_control-btn-edit')[0].click();
    } 
    else if( shortcode === 'item' || 
             shortcode === 'toggle' ||
             shortcode === 'testimonial' || 
             shortcode === 'client' ||
             shortcode === 'page_link' ||
             shortcode === 'tab' ||
             shortcode === 'pricing_column' ||
             shortcode === 'nectar_icon_list_item' ) {

              controls = vc.frame_window.jQuery('[data-model-id="'+id+'"] > .vc_controls .element-'+shortcode);
              controls.find('.vc_control-btn-edit')[0].click();
    } 
    
    else {
      controls = vc.frame_window.jQuery('[data-model-id="'+id+'"] > .vc_controls');
      controls.find('.vc_control-btn-edit')[0].click();
    }

    
    
  }

  NectarWPBakeryListView.prototype.elHighlight = function(e) {
  
    var id = $(this).parent().attr('data-id');
    vc.frame_window.jQuery('[data-model-id="'+id+'"]').addClass('nectar-vc-el-outline-active');
  
  }

  NectarWPBakeryListView.prototype.elHighlightRemove = function(e) {
    vc.frame_window.jQuery('[data-model-id]').removeClass('nectar-vc-el-outline-active');
  }

  NectarWPBakeryListView.prototype.toggleListViewItem = function(e) {
    
    var that = e.data.instance;

    var $parent = $(this).closest('li');

    if(!$parent.hasClass('open')) {

      var modelID = $parent.find('a').data('id');
      if( that.state.expanded_els.indexOf(modelID) == -1 ) {
        that.state.expanded_els.push(modelID);
      }

      $parent.addClass('open');
      $parent.find('> ul').show();

      // open children.
      $parent.find('li.container-toggle.core-container').each(function(){
        $(this).addClass('open');
        $(this).find('> ul').show();
      });

    } else {

      that.state.expanded_els = that.state.expanded_els.filter(function(item) { return item !== $parent.find('a').data('id') });

      $parent.find('> ul').hide();
      $parent.removeClass('open');

      // close children.
      $parent.find('li.container-toggle.core-container').each(function(){
        $(this).removeClass('open');
        $(this).find('> ul').hide();
      });
      
    }
    

  }

  NectarWPBakeryListView.prototype.toggleListView = function(e) {
    
    e.preventDefault();

    var body = document.querySelector("body");
    var that = this;

    // Open.
    if( this.state.open == false ) {
      body.style.paddingLeft = '320px';
      document.querySelector("body").classList.add('el-navigator-open');
      this.$el[0].classList.add('open');
      setTimeout(function() { that.updateListView(); },100);
    } 
    // Close.
    else {
      body.style.paddingLeft = '0px';
      document.querySelector("body").classList.remove('el-navigator-open');
      this.$el[0].classList.remove('open');
    }

    this.state.open = !this.state.open;

  }


  function NectarWPBakerySettingsPosition() {

    this.state = {
      position: (localStorage.getItem("nectar_wpbakery_settings_pos")) ? localStorage.getItem("nectar_wpbakery_settings_pos") : 'modal'
    }

    this.$modal = $('.vc_ui-panel-window[data-vc-ui-element="panel-edit-element"]');
    this.setup();
    this.events();
  }

  NectarWPBakerySettingsPosition.prototype.setup = function() {
    
      $('<span class="nectar-sidebar-switch" title="'+window.nectar_wpbakery_i18n.sidebar_switch+'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M21 3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm-1 2H4v14h16V5zm-2 2v10h-2V7h2z"/></svg></span>')
      .insertBefore(this.$modal.find('.vc_ui-panel-header-controls [data-vc-ui-element="button-close"]'));

      $('<span class="nectar-modal-switch" title="'+window.nectar_wpbakery_i18n.modal_switch+'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4zm-8.5-8L9.457 9.043l2.25 2.25-1.414 1.414-2.25-2.25L6 12.5V7h5.5z"/></svg>')
      .insertBefore(this.$modal.find('.vc_ui-panel-header-controls [data-vc-ui-element="button-close"]'));
   
      this.$sidebarSwitch = $('.vc_ui-panel-window[data-vc-ui-element="panel-edit-element"] .nectar-sidebar-switch');
      this.$modalSwitch = $('.vc_ui-panel-window[data-vc-ui-element="panel-edit-element"] .nectar-modal-switch');

    if( this.state.position == 'modal' ) {
      this.$sidebarSwitch.addClass('visible');
    } else {
      this.$modalSwitch.addClass('visible');
    }

  }

  NectarWPBakerySettingsPosition.prototype.events = function() {

    var that = this;

    this.$sidebarSwitch.on('click',this.togglePos.bind(this));
    this.$modalSwitch.on('click',this.togglePos.bind(this));

    // WPBakery modal.
    function callback(mutationsList, observer) {

      mutationsList.forEach(mutation => {
          if ( mutation.attributeName === 'class' && that.state.position == 'sidebar' ) {

            if( that.$modal.hasClass('vc_active') ) {
              that.updateLayout('sidebar');
            }
            else {
              that.updateLayout('modal');
            }      
          }
      });
    }
  
    const mutationObserver = new MutationObserver(callback)
    
    mutationObserver.observe(this.$modal[0], { attributes: true });

  }

  NectarWPBakerySettingsPosition.prototype.togglePos = function(e) {

    this.$sidebarSwitch.toggleClass('visible');
    this.$modalSwitch.toggleClass('visible');

    var pos = ( this.state.position === 'sidebar' ) ? 'modal' : 'sidebar';

    localStorage.setItem("nectar_wpbakery_settings_pos", pos);
    this.state.position = pos;

    this.updateLayout(pos);
  };

  NectarWPBakerySettingsPosition.prototype.updateLayout = function(toggle) {
    if( toggle == 'sidebar' ) {
      document.querySelector("body").style.paddingRight = '350px';
      document.querySelector("body").classList.add('sidebar-settings-open');
      this.$modal[0].setAttribute('data-sidebar-view','true');
    } 
    // Close.
    else {
      document.querySelector("body").style.paddingRight = '0px';
      document.querySelector("body").classList.remove('sidebar-settings-open');
      this.$modal[0].setAttribute('data-sidebar-view','false');
      this.$modal[0].style.left = '400px';
      this.$modal[0].style.width = '450px';
    }
  };


  $(document).ready(function(){
    new NectarWPBakeryListView();
    
    if( typeof(Storage) !== "undefined" ) {
      new NectarWPBakerySettingsPosition();
    }
  });
  

})(jQuery);