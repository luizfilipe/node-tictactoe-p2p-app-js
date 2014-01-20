/*jshint indent: 2, maxlen: 80, bitwise: true, boss: false, curly: true,
debug: false, devel: false, eqeqeq: false, evil: true, forin: false,
immed: true, laxbreak: false, newcap: true, noarg: true, noempty: true,
nomen: false, onevar: false, plusplus: false, regexp: true, undef: true,
sub: false, strict: false, white: true*/
/*global console, setTimeout, module, require, __dirname, process */
var app = module.exports = require('appjs');

app.serveFilesFrom(__dirname + '/content');

var net = require('net');

var window = app.createWindow({
  width  : 325,
  height : 700,
  icons  : __dirname + '/content/icons'
});

window.on('create', function () {
  console.log('Jogo da velha');
  window.frame.show();
  window.frame.center();
});

window.on('ready', function () {
  window.require = require;
  window.process = process;
  window.module = module;
  window.requireComponent = function (path) {
    var component = this.require(path);
    component.$ = app.windows.alpha.$;
    return component;
  };

  console.log('Janela pronta!');

  var game = window.requireComponent('./content/game');
  var connections = window.requireComponent('./content/connections');
  var tableDiv = $('.div');
  var actions = {
    reset: function () {
      var conn = connections.connection;
      if (conn) {
        conn.end();
        conn.destroy();
        connections.resetConnection();
      }
      tableDiv.text('');
      $('#connInfo').text('');
      $('#winner').text('');
    },
    playerMove: function (move) {
      var player = move.player;
      var slot = move.slot;
      $('#' + slot).text(player);
      game.applyWinRules(slot, player);
    }
  };

  connections.onReceive = function (data) {
    game.player.turn = true;
    var request = JSON.parse(data);
    var action = request.action;
    if (action && actions[action]) {
      actions[action](request.params);
    }
  };
  var $ = app.windows.alpha.$;


  connections.startServer(game);
  $('#connect').click(function () {
    connections.startClient(game);
  });
  $('#reset').click(function () {
    connections.connection.write('{"action": "reset"}');
    actions.reset();
  });

  tableDiv.hover(function () {
    $(this).css('background-color', 'red');
  }, function () {
    $(this).removeAttr('style');
  });

  tableDiv.click(function () {
    var text = $(this).text();
    var playerType = game.player.type;
    var playerTurn = game.player.turn;
    if (connections.connection && playerTurn && !text) {
      $(this).text(playerType);
      game.applyWinRules($(this).attr('id'), playerType);
      var message = JSON.stringify({
        action: "playerMove", 
        params: {
          slot: $(this).attr('id'), 
          player: playerType
        }
      });
      connections.connection.write(message);
      game.player.turn = false;
    }
  });

  function f12(e) { return e.keyIdentifier === 'F12'; }
  function commandOptionJ(e) {
    return e.keyCode === 74 && e.metaKey && e.altKey;
  }

  window.addEventListener('keydown', function (e) {
    if (f12(e) || commandOptionJ(e)) {
      window.frame.openDevTools();
    }
  });
});

window.on('close', function () {
  console.log('Jogo terminado');
});
