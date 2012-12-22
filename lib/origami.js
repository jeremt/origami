// ┌───────────────────────────────────────────────────────────────────────┐
// │ Origami - Make pretty 'folding' animations using suites or equations. │
// ├───────────────────────────────────────────────────────────────────────┤
// │ Created by Jeremie T. Under MIT License.                              │
// └───────────────────────────────────────────────────────────────────────┘

~function($) {

/**
 * Simple Browser compatibility
 */

// Get vendor prefix

var prefix = (function() {
  var regex = /^(Moz|(w|W)ebkit|O|ms)(?=[A-Z])/

  for (var prop in document.body.style) {
    if(regex.test(prop))
      return prop.match(regex)[0].toLowerCase()
  }
  return ''
})()

// Helper to add vendor 

function vendor(style) {
  for (var key in style)
    style['-' + prefix + '-' + key] = style[key]
  return style
}

/**
 * Some useful helpers
 */

function gradient(from, to) {
  var s = ''

  s += 'linear-gradient(right,rgba(0, 0, 0, '+from+') 0%,'
  s += 'rgba(0, 0, 0, '+to+') 100%)'
  return '-' + prefix + '-' + s
}

function contrast(arr, coef) {
  var result, i, val

  result = []
  for (i = 0 ; i < arr.length ; i++) {
    val = (arr[i] - 0.5) * coef + 0.5
    if (val < 0) val = 0
    else if (val > 1) val = 1
    result.push(val)
  }
  return result
}

/**
 * Perform pretty css3 folding animation when selected element is hovered.
 *
 * @param opts
 * @option opts {Function} f the function to draw the curve
 * @option opts {Object} suite, the suite declaration (n, pas and type)
 * @option opts {Boolean} shadows, enable or disable
 * @option opts {Number} delay, the animation delay
 * @option opts {Number} frags, the number of fragments
 * @param cb callback function
 */

$.fn.origami = function (opts, cb) {
  var $this  = $(this)
    , img    = $this.children('img')

  /**
   * Generate animation when image is fully loaded
   */

  function generate() {

    var src    = img.attr('src')
      , width  = img.width()
      , height = img.height()
      , elem   = ''

    /**
     * Default number of frags
     */

    opts.frags || (opts.frags = 5)

    /**
     * Create fragments
     */

    var i

    for (i = 1 ; i <= opts.frags ; i++)
      elem += '<div class="fragment frag'+i+'">'
    for (i = 1 ; i <= opts.frags ; i++)
      elem += '</div>'

    /**
     * Replace the img balise by the fragments
     */

    img.hide()
      .end()
      .append($(elem))
      .find('.fragment')
        .css('background-image', 'url(' + src + ')')
        .prepend( '<span class="overlay"></span>' )

    /**
     * Some basics metrics
     */

    var $back     = $this.find('.back')
      , $frags    = $this.find('.fragment')
      , $overlays = $this.find('.overlay')

    // Base view

    $this.css({
      'width'    : width,
      'height'   : height
    })

    // Back

    $back.css({
      'position'   : 'absolute',
      'right'      : ($this[0].offsetWidth - width) >> 1,
      'max-height' : height,
      'max-width'  : width,
      'z-index'    : 0
    })

    // Fragment

    var fragWidth = width / opts.frags

    $frags.css('width', fragWidth + 1)

    $frags.each(function (index, frag) {
      $(frag).css({
        'background-position' : '-' + fragWidth * index + 'px 0px',
        'transform-style'     : 'preserve-3d',
        'transform-origin'    : 'left center',
        'transition'          : 'translate3d(' + fragWidth + 'px, 0, 0)'
      })
    })

    $frags.not('.frag1').css(vendor({
      'transform': 'translate3d(' + fragWidth + 'px, 0, 0)'
    }))

    // Overlay

    $overlays.css({
      width   : fragWidth,
      opacity : 0
    })

    $overlays.css(vendor({
       transition: 'opacity '+ (opts.delay || 42) / 100 +'s ease-in-out'
    }))


    /**
     * Generate pts from equation
     */

    if (opts.f) {

      var pts = (function () {
        var tab = []

        for (var x = 0 ; x < opts.frags ; x++)
          tab.push(opts.f(x))
        return tab
      })()

    } else if (opts.suite) { // TODO: Suite arthimetic

      var pts = (function () {
        var tab = []
          , inc = function (n) {
            return opts.suite.type === 'geo'
              ? n *= opts.suite.pas
              : n += opts.suite.pas
          }
        for (var x = 0, n = opts.suite.n; x < opts.frags; x++, n = inc(n))
          tab.push(n)
        return tab
      })()

    } else
      throw new TypeError('Suite or Equation are required.')

    /**
     * Generate animation functions
     */

    // When hovered...

    function on() {
      var translate = 'translate3d(' + (fragWidth - 1) + 'px,0,0)'
        , move
        , delay

      // Transform

      $frags.each(function (i, frag) {
        move = 'rotate3d(0,1,0,' + -(pts[i] - (pts[i - 1] || 0)) + 'deg)'
        delay = (opts.frags - i - 1) * (opts.delay || 42)
        if (i) move = translate + ' ' + move
        $(frag).css(vendor({
          'transform'        : move,
          'transition-delay' : delay + 'ms'
        }))
      })

      if (!opts.shadows) return

      // Lighting

      var arr = []
        , alpha
        , prev = 0.6

      for (var i = 0 ; i < pts.length ; i++)
        arr.push(1 - (((pts[i] + 180) / 360) % 1));

      arr = contrast(arr, 2)

      $overlays.each(function (i, overlay) {
        alpha = arr[i]
        $(overlay).css({
          'background': gradient(alpha, prev),
          'opacity': 1
        })
        prev = alpha;
      })

    }

    // When unhovered...

    function off() {
      var translate = 'translate3d(' + fragWidth + 'px,0,0)'
        , move

      $frags.each(function (i, frag) {
        move = 'rotate3d(0,1,0,0deg)'
        if (i) move = translate + ' ' + move;
        $(frag).css(vendor({
          'transform': move
        }))
      })

      if (opts.shadows)
        $overlays.css({'opacity': '0'})

    }

    /**
     * Add `origami` class to the object to access into css
     */

    $this.addClass('origami')

    /**
     * Return callback with the animations
     */

    cb({ on: on, off: off })

  }

  if (img.width() && img.height())
    generate();
  else
    img.load(function () {
      generate()
    })

}

/**
 * Allow to test if css 3d transform are enabled
 */

$.fn.origami.enabled = prefix + 'Perspective' in document.body.style

}(typeof jQuery !== "undefined" ? jQuery : Zepto)