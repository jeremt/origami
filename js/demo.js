
// Affine

$( '#affine' ).origami({
  width: 400,
  height: 400,
  frags: 10,
  f: function (x) {
    return 10 * x + 10;
  }
})

// Polynome

$( '#polynome' ).origami({
  width: 400,
  height: 400,
  frags: 10,
  f: function (x) {
    return 5 * x * x + 10;
  }
})

// cosinus

$( '#cosinus' ).origami({
  width: 400,
  height: 400,
  frags: 10,
  f: function (x) {
    var eq = Math.cos(x * 84) * 66;
    return eq;
  }
});

// tangente (gros bordel)

$( '#tangente' ).origami({
  width: 400,
  height: 400,
  frags: 10,
  f: function (x) {
    return Math.tan(x * 21) * 21;
  },
  shadows: true // voir pourquoi ca bug ici...
});

// Suite 'droite'

$( '#droite' ).origami({
  width: 400,
  height: 400,
  frags: 10,
  suite: {
    type: 'geo',
    n: 60,
    pas: 1
  },
  shadows: true,
  delay: 10
});

// Suite 'dents de scie'

$( '#saw' ).origami({
  width: 400,
  height: 400,
  frags: 10,
  suite: {
    type: 'geo',
    n: 60,
    pas: -1
  },
  shadows: true,
  delay: 20
});