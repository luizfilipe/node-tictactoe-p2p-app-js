/*jshint indent: 2, maxlen: 80, bitwise: true, boss: false, curly: true,
debug: false, devel: false, eqeqeq: false, evil: true, forin: false,
immed: true, laxbreak: false, newcap: true, noarg: true, noempty: true,
nomen: false, onevar: false, plusplus: false, regexp: true, undef: true,
sub: false, strict: false, white: true*/
/*global module, require */


var game = module.exports = {
  $: null,
  player: {
    turn: false,
    type: null
  },
  rules: require('./rules'),
  applyWinRules: function (slot, player) {
    var winner = this.$('#winner');
    var rules = this.rules;
    if (!rules.$) {
      rules.$ = this.$;
    }
    if (rules.verifyWin(slot, player)) {
      this.player.turn = false;
      winner.text('Jogador ' + player + ' ganhou!');
    } else if (rules.isDraw()) {
      this.player.turn = false;
      winner.text('Empate!');
    }
  }
};
