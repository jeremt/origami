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

function getAnim(index, debug) {
  var src = debug ? "img/white.png" : "http://lorempixel.com/400/400";
  $('#example').html('<div class="back"></div><img src="' + src + '">');

  var ex = examples[index];
  switch (typeof ex) {
    case "function": // With equation :
      var str = "f(x) =";
      str += /\{.+return(.+);?\}/.exec(ex.toString().replace(/\n/g, ""))[1];
      $('#example .back').html('<div>' + str + '</div>');
      return $('#example').origami({
        width: 400,
        height: 400,
        frags: 10,
        shadows: true,
        f: ex
      })
    case "object": // Or suites :
      var str = ex.type + ": n = " + ex.n + ", pas = " + ex.pas;
      $('#example .back').html('<div>' + str + '</div>');
      return $('#example').origami({
        width: 400,
        height: 400,
        frags: 10,
        shadows: true,
        suite: {
          type: ex.type,
          n: ex.n,
          pas: ex.pas
        }
      })
    default: // Else...
      return console.warn("Invalid example.");
  }
}

// default

var $examples = $('#examples')
  , $example = $('#example')
  , anim = getAnim($examples.val(), false)
  , debug = false

/**
 * Switch debug.
 */

$('#debug').on('click', function () {
  debug = !debug;
  $(this).text(debug ? 'Random' : 'White')
  anim = getAnim($examples.val(), debug);
  $example.hover(anim.on, anim.off);
})

/**
 * Switch animation.
 */

$examples.on('change', function () {
  anim = getAnim(this.value, debug);
  $example.hover(anim.on, anim.off);
});

/**
 * Trigger animation
 */

$example.hover(anim.on, anim.off);