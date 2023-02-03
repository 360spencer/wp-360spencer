/**
 * Salient "Displacement BG Animation" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global PIXI */
/* global Waypoint */
/* global anime */


(function( $ ) {
	
	"use strict";
	
	function NectarLiquid(bgIMG, type, el_type) {
		this.canvasContainer = bgIMG[0];
		this.rowBG = bgIMG;
		this.animationType = type;
		this.elType = el_type;
		
		this.bgDivWidth = $(this.rowBG).width();
		this.bgDivHeight = $(this.rowBG).height();
		this.bgDivRatio = this.bgDivHeight / this.bgDivWidth;
		
		PIXI.utils.skipHello();
		this.app = new PIXI.Application({
			width: this.bgDivWidth, 
			height: this.bgDivHeight,
			transparent: true,
			sharedTicker: true
		});
		
		this.app.stage = new window.PIXI.Container();
		this.imgContainer = new window.PIXI.Container();
		
		
		// grab displacement filter from css
		$(this.canvasContainer).remove('.nectar-displacement');
		$(this.canvasContainer).append('<div class="nectar-displacement"></div>');
		this.displacementIMG_URL = $(this.canvasContainer).find('.nectar-displacement').css('background-image');			
		this.displacementIMG_URL = this.displacementIMG_URL.replace(/(url\(|\)|")/g, '');
		
		// get row BG img
		this.bgIMG_SRC = bgIMG.css('background-image');
		this.bgIMG_SRC = this.bgIMG_SRC.replace(/(url\(|\)|")/g, '');
		
		
		// init everything once loaded
		this.loader = new PIXI.loaders.Loader();
		this.loader.add('rowBG',this.bgIMG_SRC);
		this.loader.add('displaceBG', this.displacementIMG_URL);
		this.loader.load(this.initialize.bind(this));
		
	}
	
	NectarLiquid.prototype.initialize = function() {
		
		this.settings = {
			animationStrength: 1.5,
			animationStrengthSpeed: 1,
			displacementScaleX: 40,
			displacementScaleY: -80,
			time: Math.random()*20,
			filterMultX: 200,
			filterMultY: 350,
			duration: 2400,
			shouldAnimate: true
		};
		if(this.animationType == 'displace-filter-fade') {
			
			this.settings.filterMultX = 150;
			this.settings.filterMultY = 275;
			this.settings.displacementScaleX = 70;
			this.settings.displacementScaleY = -70;
			this.settings.animationStrengthSpeed = 0.8;
			
			if(this.elType != 'row') {
				this.settings.duration = 2000;
				this.settings.displacementScaleX = 50;
				this.settings.displacementScaleY = -50;
			} 
		} else {
			
			if(this.elType != 'row') {
				this.settings.displacementScaleY = 70;
			}
			
		}
		
		
		// displacement
		this.filterSprite = new window.PIXI.Sprite( this.loader.resources.displaceBG.texture );
		this.filterSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
		this.filter = new window.PIXI.filters.DisplacementFilter( this.filterSprite );
		
		// bg	
		this.bg = new PIXI.Sprite( this.loader.resources.rowBG.texture );
		
		// store actual img height/ratio
		this.imgHeight = this.loader.resources.rowBG.texture.orig.height;
		this.imgWidth = this.loader.resources.rowBG.texture.orig.width;
		this.imgRatio = this.imgWidth/this.imgHeight;
		
		// Set image anchor to the center of the image
		this.bg.anchor.x = 0.5;
		this.bg.anchor.y = 0.5;
		
		// sim background-size cover
		this.bg.height = $(this.rowBG).height();
		this.bg.width = this.imgRatio * this.bg.height;
		
		if( this.bg.width <= $(this.rowBG).width() ) {
			
			this.bg.width = $(this.rowBG).width() + 100;
			this.bg.height = this.bg.width / this.imgRatio;
			
		} else {
			this.bg.height = $(this.rowBG).height() + 100;
			this.bg.width = this.imgRatio * this.bg.height;
		}
		
		this.setAlignment();
		
		// reset the dimensions for the renderer incase the row height has changed inbetween loading the bg resouce
		this.app.renderer.resize( $(this.rowBG).width(), $(this.rowBG).height() ); 
		
		this.buildStage();
		this.createFilters();
		
		this.app.view.setAttribute( "class", "nectar-liquid-bg" );
		this.canvasContainer.appendChild( this.app.view );
		
		var $liquidBGOffsetPos, self, $parentSelector, waypoint;
		
		if(this.animationType == 'displace-filter-loop') {
			
			if($('#nectar_fullscreen_rows').length == 0) {
				
				this.animateFilters();
				
				$liquidBGOffsetPos = ($('#nectar_fullscreen_rows').length > 0) ? '200%' : '105%';
				
				self = this;
				$parentSelector = (self.elType == 'row') ? '.row-bg-wrap' : '.column-image-bg-wrap';
				
				waypoint = new Waypoint({
					element: $(this.canvasContainer).parents($parentSelector),
					handler: function() {
						// add bg to container
						self.imgContainer.addChild( self.bg );
					},
					offset: $liquidBGOffsetPos
				});
				
			} else {
				
				this.animateFilters();
				this.imgContainer.addChild( this.bg );
				
			}
			
			
		} // end displace loop
		
		else if(this.animationType == 'displace-filter-fade') {
			
			this.animateFilters();
			this.settings.shouldAnimate = false;
			
			$liquidBGOffsetPos = ($('#nectar_fullscreen_rows').length > 0) ? '200%' : '85%';
			
			self = this;
			$parentSelector = (self.elType == 'row') ? '.row-bg-wrap' : '.column-image-bg-wrap';
			
			var $disableFPonMobile = ($('#nectar_fullscreen_rows[data-mobile-disable]').length > 0) ? $('#nectar_fullscreen_rows').attr('data-mobile-disable') : 'off';
			var $onMobileBrowser = navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/);
			
			if(!$onMobileBrowser) {
				$disableFPonMobile = 'off';
			}
			
			if($('#nectar_fullscreen_rows').length == 0 || 
			$('#nectar_fullscreen_rows').length > 0 && $(this.canvasContainer).parents('.wpb_row.fp-section').index() == 0 || 
			$disableFPonMobile == 'on') {
				
				waypoint = new Waypoint({
					element: $(this.canvasContainer).parents($parentSelector),
					handler: function() {
						
						if($(self.canvasContainer).parents('.wpb_tab').length > 0 && $(self.canvasContainer).parents('.wpb_tab').css('visibility') == 'hidden' || $(self.canvasContainer).hasClass('animated-in')) { 
							waypoint.destroy();
							return;
						}
						
						// add bg to container
						self.imgContainer.addChild( self.bg );
						
						// animate down
						self.animateProps(self);
						
						waypoint.destroy();
					},
					offset: $liquidBGOffsetPos
					
				}); // waypoint end
			}
			
			
		} // end fade in displace
		
		// resize logic
		$(window).resize(this.resize.bind(this));
		$(window).on('smartresize', this.resize.bind(this));
		
	};
	
	NectarLiquid.prototype.animateProps = function(self) {
		
		setTimeout(function(){
			
			$(self.canvasContainer).find('.nectar-liquid-bg').addClass('animated-in');
			
			self.settings.shouldAnimate = true;
			self.settings.animationStrength = 2;
			self.settings.animationStrengthSpeed = 0.8;
			self.animateFilters();
			
			// Animate displacement down.
			
			// Strength.
			anime({
				targets: self.settings,
				animationStrength: 0,
				duration: self.settings.duration,
				easing: [.26,.42,.4,1],
				complete: function(anim) {
					self.settings.shouldAnimate = false;
				}
			});
			
			// Speed.
			anime({
				targets: self.settings,
				animationStrengthSpeed: 0.3,
				duration: self.settings.duration,
				easing: [.26,.42,.4,1],
				complete: function(anim) {
					self.settings.shouldAnimate = false;
				}
			});
			
		},100);
		
	};
	
	NectarLiquid.prototype.setAlignment = function() {

		var $yPos = $(this.rowBG).css('background-position-y');
		var $xPos = $(this.rowBG).css('background-position-x');

		// Y.
		if( $yPos === 'top' || $yPos === '0' || $yPos === '0%') {
			this.bg.position.y =  (this.bg.height - $(this.rowBG).height())/2 - 40;
		} else if( $yPos === 'bottom' || $yPos === '100' || $yPos === '100%' ) {
			this.bg.position.y = - (this.bg.height - $(this.rowBG).height())/2 + 40;
		} else {
			this.bg.position.y = 0;
		}
		
		// X.
		if( $xPos === 'left' || $xPos === '0' || $xPos === '0%') {
			this.bg.position.x = (this.bg.width - $(this.rowBG).width())/2 - 40;
		} else if( $xPos === 'right' || $xPos === '100' || $xPos === '100%' ) {
			this.bg.position.x = - (this.bg.width - $(this.rowBG).width())/2 + 40;
		} else {
			this.bg.position.x = 0;
		}
			
	};
	
	NectarLiquid.prototype.resize = function(){
		var self = this;
		
		self.bgDivRatio = $(self.rowBG).height() / $(self.rowBG).width();
		
		self.imgContainer.position.x = $(self.rowBG).width() / 2;
		self.imgContainer.position.y = $(self.rowBG).height() / 2;
		
		// sim background-size cover
		self.bg.height = $(self.rowBG).height();
		self.bg.width = self.imgRatio * self.bg.height;
		
		if( self.bg.width <= $(self.rowBG).width() ) {
			self.bg.width = $(self.rowBG).width() + 100;
			self.bg.height = self.bg.width / self.imgRatio;
			
		} else {
			self.bg.height = $(self.rowBG).height() + 100;
			self.bg.width = self.imgRatio * self.bg.height;
		}
		
		self.app.stage.scale.x = self.app.stage.scale.y = 1;
		
		self.setAlignment();
		
		self.app.renderer.resize( $(self.rowBG).width(), $(self.rowBG).height() ); 
		
	};
	
	NectarLiquid.prototype.createFilters = function() {
		
		this.app.stage.addChild( this.filterSprite );
		this.filter.scale.x = this.filter.scale.y = 1;
		this.imgContainer.filters = [
			this.filter
		];
	};
	
	
	NectarLiquid.prototype.buildStage = function() {
		
		this.imgContainer.position.x = $(this.rowBG).width() / 2;
		this.imgContainer.position.y = $(this.rowBG).height() / 2;
		this.app.stage.scale.x = this.app.stage.scale.y = 1;
		this.app.stage.addChild( this.imgContainer );
	};
	
	
	NectarLiquid.prototype.animateFilters = function() {

		if( this.animationType === 'displace-filter-loop' ) {
			this.filterSprite.rotation = this.settings.time * 0.01;
			this.filterSprite.x = Math.sin(this.settings.time * 0.1) * this.settings.filterMultX;
			this.filterSprite.y = Math.cos(this.settings.time * 0.1) * this.settings.filterMultY;
		} else {
			this.filterSprite.rotation = this.settings.time * 0.04;
			this.filterSprite.x = this.settings.time * 0.1 * this.settings.filterMultX;
			this.filterSprite.y = this.settings.time * 0.1 * this.settings.filterMultY;
		}
		
		this.filter.scale.x = this.settings.displacementScaleX * this.settings.animationStrength;
		this.filter.scale.y = this.settings.displacementScaleY * this.settings.animationStrength;
		
		this.settings.time += 0.05 * this.settings.animationStrengthSpeed;
		
		if(this.animationType == 'displace-filter-loop') {
			requestAnimationFrame(function(){
				this.animateFilters();
			}.bind(this));
		}
		else if(this.animationType == 'displace-filter-fade' && this.settings.shouldAnimate) {
			requestAnimationFrame(function(){
				this.animateFilters();
			}.bind(this));
		}
		
	}; 
	
	window.NectarLiquid = NectarLiquid;
	
}( jQuery ));

