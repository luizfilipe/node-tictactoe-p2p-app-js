
/**
 * 1 2 3
 * 4 5 6
 * 7 8 9
 */

/*jshint indent: 2, maxlen: 80, bitwise: true, boss: false, curly: true,
debug: false, devel: false, eqeqeq: false, evil: true, forin: false,
immed: true, laxbreak: false, newcap: true, noarg: true, noempty: true,
nomen: false, onevar: false, plusplus: false, regexp: true, undef: true,
sub: false, strict: false, white: true*/
/*global $, module*/

module.exports = {
  moves: 0,
  positions: (function () {
    var result = {};
    for (var i = 0; i < 9; i++) {
      result['slot' + (i + 1)] = {
        line: Math.floor(i / 3),
        column: i % 3
      };
    }
    return result;
  }()),
  table: (function () {
    var result = [
      [],
      [],
      []
    ];
    for (var i = 0; i < 9; i++) {
      result[Math.floor(i / 3)][i % 3] = 'slot' + (i + 1);
    }
    return result;
  }()),
  slot: function (line, column) {
    return this.$('#' + this.table[line][column]);
  },
  line: function () {
    var line = this.positions[this.slotName].line;
    var result = true;
    for (var column = 0; column < 3; column++) {
      if (this.slot(line, column).text() !== this.playerSymbol) {
        result = false;
        break;
      }
    }
    return result;
  },
  column: function () {
    var column = this.positions[this.slotName].column;
    var result = true;
    for (var line = 0; line < 3; line++) {
      if (this.slot(line, column).text() !== this.playerSymbol) {
        result = false;
        break;
      }
    }
    return result;
  },
  primary: function () {
    var result = true;
    for (var index = 0; index < 3; index++) {
      if (this.slot(index, index).text() !== this.playerSymbol) {
        result = false;
        break;
      }
    }
    return result;
  },
  secondary: function () {
    var result = true;
    var max = 3;
    for (var i = 0; i < max; i++) {
      if (this.slot(i, max - i - 1).text() !== this.playerSymbol) {
        result = false;
        break;
      }
    }
    return result;
  },
  isDraw: function () {
    return this.moves === 9;
  }, 
  verifyWin: function (slotName, playerSymbol) {
    this.moves++;
    this.slotName = slotName;
    this.playerSymbol = playerSymbol;
    return  this.line() || this.column() || this.primary() || this.secondary();
  }
};