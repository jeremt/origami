/**
 * Animation examples.
 */

var examples = {
  affine: function (x) { return 10 * x + 10 },
  polynome: function (x) { return 5 * x * x + 10 },
  cosinus: function (x) { return Math.cos(x * 84) * 66 },
  tangente: function (x) { return Math.tan(x * 21) * 21 },
  droite: { type: 'geo', n: 60, pas: 1 },
  saw: { type: 'geo', n: 60, pas: -1 }
}

/**
 * Get the animation for a specific example.
 */

function getAnim(index, debug, cb) {
  var src = debug ? "img/white.png" : "http://lorempixel.com/400/400"
    , ex = examples[index]

  $('#example').html('<div class="back"></div><img src="' + src + '">')

  switch (typeof ex) {

    case "function": // With equation :
      var str = "f(x) ="
      str += /\{.+return(.+);?\}/.exec(ex.toString().replace(/\n/g, ""))[1]
      $('#example .back').html('<div>' + str + '</div>')
      $('#example').origami({
        width: 400,
        height: 400,
        frags: 10,
        shadows: true,
        f: ex
      }, cb)
      break;

    case "object": // Or suites :
      var str = ex.type + ": n = " + ex.n + ", pas = " + ex.pas
      $('#example .back').html('<div>' + str + '</div>')
      $('#example').origami({
        width: 400,
        height: 400,
        frags: 10,
        shadows: true,
        suite: {
          type: ex.type,
          n: ex.n,
          pas: ex.pas
        }
      }, cb)
      break;

    default: // Else...
      return console.warn("Invalid example.")
  }
}

// default

var $examples = $('#examples')
  , $example = $('#example')
  , debug = false

getAnim($examples.val(), false, function (anim) {
  $example.hover(anim.on, anim.off)
})

/**
 * Switch debug.
 */

$('#debug').on('click', function () {
  debug = !debug
  $(this).text(debug ? 'Random' : 'White')
  getAnim($examples.val(), debug, function (anim) {
    $example.hover(anim.on, anim.off)
  })
})

/**
 * Switch animation.
 */

$examples.on('change', function () {
  getAnim(this.value, debug, function (anim) {
    $example.hover(anim.on, anim.off)
  })
})