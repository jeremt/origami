// ┌───────────────────────────────────────────────────────────────────────┐
// │ Origami - Make pretty 'folding' animations using suites or equations. │
// ├───────────────────────────────────────────────────────────────────────┤
// │ Created by Jeremie T. Under MIT License.                              │
// └───────────────────────────────────────────────────────────────────────┘

(function($) {

  /**
   * Simple Browser compatibility
   */

  // Simple div to test css properties

  var el = document.createElement('div');

  // Get vendor prefix

  var prefix = (function() {
    var regex = /^(Moz|(w|W)ebkit|O|ms)(?=[A-Z])/
      , _prefix = '';

    for (var prop in el.style) {
      if(regex.test(prop))
        _prefix = prop.match(regex)[0];
    }
    return '-' + _prefix.toLowerCase() + '-';
  })();

  // Helper to add vendor 

  function vendor(style) {
    for (var key in style) {
      style[prefix + key] = style[key];
    };
    return style;
  };

  /**
   * Perform pretty css3 folding animation when `this` element is hovered.
   *
   * @param opts
   * @option opts {String|Number} width
   * @option opts {String|Number} height
   * @option opts {String} type
   */

  $.fn.origami = function (opts) {
    var $this = $(this)
      , url = $this.children( 'img' ).attr('src')
      , elem  = ''
      , i
      , padding = ($this.outerWidth() - $this.width()) >> 1

    /**
     * Allow to test if css 3d transform are enabled
     */

    this.enabled = prefix + 'Perspective' in el.style;

    /**
     * Default number of frags
     */

    opts.frags || (opts.frags = 5);

    /**
     * Create fragments
     */

    for (i = 1 ; i <= opts.frags ; i++)
      elem += '<div class="fragment frag'+i+'">';
    for (i = 1 ; i <= opts.frags ; i++)
      elem += '</div>';

    /**
     * Replace the img balise by the fragments
     */

    $this.find( 'img' )
      .remove().end()
      .append($(elem))
      .find('.fragment').css('background-image', 'url(' + url + ')')
      .prepend($('<span class="overlay" ></span>' ));

    /**
     * Some basics metrics
     */

    var $back = $this.find('.back')
      , $frags = $this.find('.fragment')
      , $overlays = $this.find('.overlay')

    // Base view

    $this.css({
      'width'    : opts.width,
      'height'   : opts.height
    });

    // Back

    $back.css({
      'height'   : $this.height(),
      'position' : 'absolute',
      'right'    : padding,
      'z-index'  : 0
    });

    // Fragment

    var fragWidth = $this.width() / opts.frags;
    $frags.css('width', fragWidth + 1);

    $frags.each(function (index, frag) {
      $(frag).css({
        'background-position': '-' + fragWidth * index + 'px 0px',
        'transform-style': 'preserve-3d',
        'transform-origin': 'left center',
        'transition': 'translate3d(' + fragWidth + 'px, 0, 0)'
      });
    });

    $frags.not('.frag1').css(vendor({
      'transform': 'translate3d(' + fragWidth + 'px, 0, 0)'
    }));

    // Overlay

    $overlays.css({
      width: fragWidth,
      opacity: 0
    });

    $overlays.css(vendor({
       transition: 'opacity '+ (opts.delay || 42) / 100 +'s ease-in-out'
    }));

    /**
     * Animate according `type` of animation
     */

    // Add some helpers to add shadows
    if (opts.shadows) {

      function gradient(from, to) {
        var s = '';

        s += 'linear-gradient(right,rgba(0, 0, 0, '+from+') 0%,'
        s += 'rgba(0, 0, 0, '+to+') 100%)';
        return prefix + s;
      };

      function contrast(arr, coef) {
        var result, i, val;

        result = [];
        for (i = 0 ; i < arr.length ; i++) {
          val = (arr[i] - 0.5) * coef + 0.5;
          if (val < 0) val = 0;
          else if (val > 1) val = 1;
          result.push(val);
        }
        return result;
      };

    }

    // Generate pts from equation
    if (opts.f) {

      var pts = (function () {
        var tab = []
          , x

        for (x = 0 ; x < opts.frags ; x++)
          tab.push(opts.f(x));
        return tab;
      })();

    } else if (opts.suite) { // TODO: Suite arthimetic
      var pts = (function () {
        var tab = []
          , x
          , inc = function (n) {
            return opts.suite.type === 'geo' ? n *= opts.suite.pas : n += opts.suite.pas;
          }
        for (x = 0, n = opts.suite.n; x < opts.frags; x++, n = inc(n)) {
          tab.push(n);
        }
        return tab;
      })();

    } else
      throw new TypeError('Suite or Equation are required.');

    // When hovered...

    function on() {
      var translate = 'translate3d(' + (fragWidth - 1) + 'px,0,0)'
        , move

      // Transform

      $frags.each(function (i, frag) {
        move = 'rotate3d(0,1,0,' + -(pts[i] - (pts[i - 1] || 0)) + 'deg)';
        if (i) move = translate + ' ' + move;
        $(frag).css(vendor({
          'transform': move,
          'transition-delay': (opts.frags - i - 1) * (opts.delay || 42) + 'ms'
        }));
      });

      if (!opts.shadows)
        return ;

      // Lighting

      var arr = []
        , alpha
        , prev = 0.6
      for (var i = 0 ; i < pts.length ; i++)
        arr.push(1 - (((pts[i] + 180) / 360) % 1));

      arr = contrast(arr, 2);
      $overlays.each(function (i, overlay) {
        alpha = arr[i];
        $(overlay).css({
          'background': gradient(alpha, prev),
          'opacity': 1
        });
        prev = alpha;
      });

    };

    // When unhovered...

    function off() {
      var translate = 'translate3d(' + fragWidth + 'px,0,0)'
        , move

      $frags.each(function (i, frag) {
        move = 'rotate3d(0,1,0,0deg)'
        if (i) move = translate + ' ' + move;
        $(frag).css(vendor({
          'transform': move
        }));
      });

      if (opts.shadows)
        $overlays.css({'opacity': '0'});

    };

    /**
     * Add `foldable` class to the object to access into css
     */

    $this.addClass('foldable');

    /**
     * Expose on/off animations
     */

    return { on: on, off: off };

  };

})(jQuery);