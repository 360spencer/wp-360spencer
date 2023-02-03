/**
 * Salient "Animated Gradient" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */

/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.

 Copyright (c) 2018 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

 (function() {
    'use strict';
  
    var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    var F3 = 1.0 / 3.0;
    var G3 = 1.0 / 6.0;
    var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
    var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
  
    function SimplexNoise(randomOrSeed) {
      var random;
      if (typeof randomOrSeed == 'function') {
        random = randomOrSeed;
      }
      else if (randomOrSeed) {
        random = alea(randomOrSeed);
      } else {
        random = Math.random;
      }
      this.p = buildPermutationTable(random);
      this.perm = new Uint8Array(512);
      this.permMod12 = new Uint8Array(512);
      for (var i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
      }
  
    }
    SimplexNoise.prototype = {
      grad3: new Float32Array([1, 1, 0,
        -1, 1, 0,
        1, -1, 0,
  
        -1, -1, 0,
        1, 0, 1,
        -1, 0, 1,
  
        1, 0, -1,
        -1, 0, -1,
        0, 1, 1,
  
        0, -1, 1,
        0, 1, -1,
        0, -1, -1]),
      grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
        0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
        1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
        -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
        1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
        -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
        1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
        -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
      // 3D simplex noise
      noise3D: function(xin, yin, zin) {
        var permMod12 = this.permMod12;
        var perm = this.perm;
        var grad3 = this.grad3;
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        var Y0 = j - t;
        var Z0 = k - t;
        var x0 = xin - X0; // The x,y,z distances from the cell origin
        var y0 = yin - Y0;
        var z0 = zin - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
          if (y0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
          } // X Y Z order
          else if (x0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // X Z Y order
          else {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // Z X Y order
        }
        else { // x0<y0
          if (y0 < z0) {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Z Y X order
          else if (x0 < z0) {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Y Z X order
          else {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
          } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
        var y2 = y0 - j2 + 2.0 * G3;
        var z2 = z0 - k2 + 2.0 * G3;
        var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
        var y3 = y0 - 1.0 + 3.0 * G3;
        var z3 = z0 - 1.0 + 3.0 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        var ii = i & 255;
        var jj = j & 255;
        var kk = k & 255;
        // Calculate the contribution from the four corners
        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
          var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
          var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
          var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
          var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
          t3 *= t3;
          n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
      },
    };
  
    function buildPermutationTable(random) {
      var i;
      var p = new Uint8Array(256);
      for (i = 0; i < 256; i++) {
        p[i] = i;
      }
      for (i = 0; i < 255; i++) {
        var r = i + ~~(random() * (256 - i));
        var aux = p[i];
        p[i] = p[r];
        p[r] = aux;
      }
      return p;
    }
    SimplexNoise._buildPermutationTable = buildPermutationTable;
  
    /*
    The ALEA PRNG and masher code used by simplex-noise.js
    is based on code by Johannes Baagøe, modified by Jonas Wagner.
    See alea.md for the full license.
    */
    function alea() {
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;
  
      var mash = masher();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');
  
      for (var i = 0; i < arguments.length; i++) {
        s0 -= mash(arguments[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(arguments[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(arguments[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;
      return function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
    }
    function masher() {
      var n = 0xefc8249d;
      return function(data) {
        data = data.toString();
        for (var i = 0; i < data.length; i++) {
          n += data.charCodeAt(i);
          var h = 0.02519603282416938 * n;
          n = h >>> 0;
          h -= n;
          h *= n;
          n = h >>> 0;
          h -= n;
          n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
      };
    }
  
    // amd
    if (typeof define !== 'undefined' && define.amd) define(function() {return SimplexNoise;});
    // common js
    if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
    // browser
    else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
    // nodejs
    if (typeof module !== 'undefined') {
      module.exports = SimplexNoise;
    }
  
  })();

  
(function ($) {

    "use strict";

    const simplex = new SimplexNoise();

    function NectarGradient(el, row) {
      this.container = el;
      this.row = row;
      this.setup();
      this.events();
      this.rafLoop();
      setTimeout(() => { this.canvas.classList.add('loaded'); });
    };

    const proto = NectarGradient.prototype;

    proto.setup = function() {

      // Setup canvas
      this.canvas = document.createElement('canvas');
      this.canvas.classList.add('nectar-animated-gradient');
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      
      this.onMobile = (window.innerWidth < 690) ? true : false;
      this.orientationChanged = false;
      this.clock = 0;
      this.resolution = (this.onMobile) ? 90 : 110;
     
      this.resPercentage = 100/this.resolution;
      this.resPercentageNormalized = this.resPercentage/100;

      this.canvas.setAttribute('height', this.resolution);
      this.canvas.setAttribute('width', this.resolution);
      this.canvas.style = 'width:100%; height: 100%; position: relative;';
      this.imgdata = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.cx = this.canvas.width/2;
      this.cy = this.canvas.height/2;
      this.data = this.imgdata.data;

      // User set options
      this.settings = {};
      let attrs = JSON.parse(this.row.getAttribute("data-nectar-animated-gradient-settings"));
      Object.assign(
        this.settings,
        {
          speed: 1000,
          color_1: false,
          color_2: false,
          blending_mode: 'linear'
        },
        attrs
      );

      this.colorSpeed = ( this.settings.speed == 1300 ) ? 0.5 : 0.9;
      this.colors = [];

      if(this.settings.color_1 === this.settings.color_2 || 
        this.settings.color_2 == false) {
        this.singleColor = true;
      }

      if( this.settings.color_1 ) {

        const rgbColor1 = this.rgbObj(this.settings.color_1);

        this.colors.push({
          r: rgbColor1.r,
          g: rgbColor1.g,
          b: rgbColor1.b
        });
      }

      if( this.settings.color_2 ) {

        const rgbColor2 = this.rgbObj(this.settings.color_2);

        this.colors.push({
          r: rgbColor2.r,
          g: rgbColor2.g,
          b: rgbColor2.b
        });
      }

    };

    proto.events = function() {

      var that = this;

      this.trackInView();

      window.addEventListener('resize', () => {
        if(that.onMobile && !that.orientationChanged) {
          return;
        }
        this.resize();
      });

      window.addEventListener("orientationchange", function() {
        that.orientationChanged = true;
      });

      this.resize();
    }; 

    proto.resize = function() {
      
      this.containerW = this.container.clientWidth;
      this.containerH = this.container.clientHeight;

      let containerRatio = this.containerH/this.containerW;

      if(containerRatio < 1) {
        this.aspectMod = {
          x: 1.4,
          y: containerRatio*1.4
        }
      } else {
        this.aspectMod = {
          x: containerRatio/3,
          y: 1
        }
      }
        
      
    };
    

    proto.isSafari = function() {
      if (navigator.userAgent.indexOf('Safari') != -1 && 
        navigator.userAgent.indexOf('Chrome') == -1) {
          return true;
      } 
  
      return false;
    };

    proto.trackInView = function() {

        let that = this;
        let observer = new IntersectionObserver(function(entries) {

          entries.forEach(function(entry){
            if ( entry.isIntersecting ) {
              that.inView = true;
            } else {
              that.inView = false;
            }
          });

        }, { 
          root: (this.isSafari()) ? null : document,
          rootMargin: '250px'
        });

        observer.observe(this.container);
    };

    proto.rgbObj = function(hex) {

      var hexProcessed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!hexProcessed) {
        return false;
      }
      return {
        r: parseInt(hexProcessed[1], 16),
        g: parseInt(hexProcessed[2], 16),
        b: parseInt(hexProcessed[3], 16)
      }
    };


    proto.mix = function(v1, v2, a) { 
      return v1 * (1 - a) + v2 * a;
    };

    proto.mixed = function(channel, x, y, noise) {
      if (this.singleColor) {
        return this.colors[0][channel];
      }
      if( this.settings.blending_mode == 'organic') {
        return this.mix(this.colors[0][channel], this.colors[1][channel], (this.rotate(x,y,this.clock*this.colorSpeed) * this.resPercentageNormalized*3.5)*noise/2 );
      } else if( this.settings.blending_mode == 'linear' ) {
        return this.mix(this.colors[0][channel], this.colors[1][channel], (this.rotate(x,y,this.clock*this.colorSpeed) * this.resPercentageNormalized*2) );
      }

    };

    proto.rotate = function(x, y, angle) {
      let radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - this.cx)) + (sin * (y - this.cy)) + this.cx;
      return nx;
  };
    
    proto.rafLoop = function() {
        if( this.inView ) {
          for (var x = 0; x < this.resolution; x++) {
              for (var y = 0; y < this.resolution; y++) {
          
                  const noise = simplex.noise3D(x / this.resolution * this.aspectMod.x, y / this.resolution * this.aspectMod.y, this.clock/this.settings.speed);
        
                  this.data[(x + y * this.resolution) * 4 + 0] = this.mixed('r', x, y, noise);
                  this.data[(x + y * this.resolution) * 4 + 1] = this.mixed('g', x, y, noise);
                  this.data[(x + y * this.resolution) * 4 + 2] = this.mixed('b', x, y, noise);
                  this.data[(x + y * this.resolution) * 4 + 3] = noise*265;
                  
              }
          }
   
          this.clock++;
          
          this.ctx.putImageData(this.imgdata, 0, 0);
         
        }

        requestAnimationFrame(() => {
          this.rafLoop();
        });
    };


    // Init instances.

    function initGradients() {
      const gradients = document.querySelectorAll('[data-nectar-animated-gradient-settings]');
      
      gradients.forEach((row) => {
        const rowBG = row.querySelector('.row-bg-wrap');
        if( !rowBG ) {
          return;
        }
        new NectarGradient(rowBG, row);
      });
    }

    $(document).ready(function () {
      let usingFrontEndEditor = (typeof window.vc_iframe === 'undefined') ? false : true;
      if (!usingFrontEndEditor) {
        initGradients();
      }
      $(window).on('vc_reload', () => {
        initGradients();
      });

    });

   
})(jQuery);