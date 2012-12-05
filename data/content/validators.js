/*jshint indent: 2, maxlen: 80, bitwise: true, boss: false, curly: true,
debug: false, devel: false, eqeqeq: false, evil: true, forin: false,
immed: true, laxbreak: false, newcap: true, noarg: true, noempty: true,
nomen: false, onevar: false, plusplus: false, regexp: true, undef: true,
sub: false, strict: false, white: true*/
/*global $, isNaN, console, module */

module.exports = {
  availableHost: function (host) {
    var h = host.split('.');
    var result = true;
    if (h.length == 4) {
      var n;
      for (var i = h.length - 1; i >= 0; i--) {
        n = Number(h[i]);
        if ((n < 0 && n > 255) || isNaN(n)) {
          result = false;
          break;
        }
      }
    } else if (host !== 'localhost') {
      result = false;
    }
    return result;
  },
  avaliablePort: function (port) {
    return port && !isNaN(Number(port));
  }
};