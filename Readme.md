Origami
=======

Make pretty 'folding' animations using suites or equations. Take a look at the [demo](http://jeremiet.github.com/origami).

HOW TO
------

Add jquery into your html page:
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
```
Next, add `origami.css` and `origami.js`:
```html
<link rel="stylesheet" href="path/to/origami.min.css"></script>
<script src="path/to/origami.min.js"></script>
```
Eventualy, use it!
```js
// Create animation...
var anim = $('#your-elem').origami({
  delay: 35,
  f: function (x) {
    return 10 * x + 10; // f(x) = 10x + 10
  }
});
// ...and trigger it :)
$('#on').on('click', anim.on);
$('#off').on('click', anim.off);
```
_Markup_:
```html
<div id="your-elem">
  <!-- Add `back` class to the elem behind -->
  <div class="back">
    Hello world!
  </div>
  <!-- ...then add your image -->
  <img src="path/to/img">
</div> <!-- #your-elem -->
```

You can create animations from :

- an equation like _f(x) = 10x² + 10_
- a sequence giving a step, a start, and a type (arithmetic or geometric)

### Options

- __f__ - equation to use to create the curve
- __suite__ - suite to use (instead of equation)
- __delay__ - animation delay (ms)
- __shadows__ - boolean to activate or not the shadows
- __frags__ - fragments number

TODO
----

- Translate variables names in english

License
-------

(The MIT License)

Copyright (c) 2012 Jeremie T. <taboada.jeremie@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.