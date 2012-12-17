if ($("#picture").length) {
  var anim = $("#picture").origami({
    shadows: false,
    frags: 10,
    f: function (x) {
      return Math.sin(x * 42) * 84 + 21
    }
  })

  $('#picture').hover(anim.on, anim.off);
}