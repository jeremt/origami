$(function () {

  if (!$.fn.origami.enabled)
    alert('Css3d isnt enabled on your browser :(')

  if ($("#picture").length) {

    $("#picture").origami({
      shadows: false,
      frags: 10,
      f: function (x) {
        return Math.sin(x * 42) * 84 + 21
      }
    }, function (anim) {
      $('#picture').hover(anim.on, anim.off)
    })

  } else if ($('#debug').length) {

    $('#debug').origami({
      shadows: true,
      frags: 10,
      f: function (x) {
        return 10 * x
      }
    }, function (anim) {
      $('#debug').hover(anim.on, anim.off)
    })

  }

})