/*jshint indent: 2, maxlen: 80, bitwise: true, boss: false, curly: true,
debug: false, devel: false, eqeqeq: false, evil: true, forin: false,
immed: true, laxbreak: false, newcap: true, noarg: true, noempty: true,
nomen: false, onevar: false, plusplus: false, regexp: true, undef: true,
sub: false, strict: false, white: true*/
/*global console, require, module */

var net = require('net');
var validators = require('./validators');

var connections = module.exports = {
  connection: null,
  port: 5000,
  $: null,
  game: null,
  onReceive: null,
  fillConnection: function (conn) {
    if (!this.connection) {
      conn.setEncoding('utf8');
      conn.on('data', this.onReceive);
      this.connection = conn;
      this.$('#connInfo').text('Adversário conectado, host: ' +
          conn.remoteAddress + ' port: ' + conn.remotePort);
    }
  },
  startServer: function (game) {
    var server = net.createServer(function (conn) {
      connections.fillConnection(conn);
      game.player = {
        type: 'o',
        turn: false
      };
    }).listen(this.port, function () {
      var port = server.address().port;
      connections.$('#currentPort').text('Sua porta é ' + port);
      console.log("Escutando porta: " + server.address().port);
    });

    server.on('error', function (e) {
      if (e.code === 'EADDRINUSE') {
        var lastPort = connections.port;
        connections.incPort();
        var port = connections.port;
        console.log('Porta ' + lastPort + ' em uso, testando porta ' + port +
          '...');
        server.listen(port);
      }
    });
  },
  startClient: function (game) {
    var host = this.$('#host').val();
    var port = this.$('#port').val();
    var connInfo = this.$('connInfo');
    //var winner = this.$('#winner');
    if (!validators.avaliablePort(port)) {
      connInfo.text('Porta inválida!');
    } else if (!validators.availableHost(host)) {
      connInfo.text('IP inválido!');
    } else {
      var client = net.connect(port, host);
      client.on('connect', function () {
        connections.fillConnection(client, game);
        game.player = {
          type: 'x',
          turn: true
        };
      });
      client.on('error', function (e) {
        console.log(e.code);
        switch (e.code) {
        case 'ECONNREFUSED':
        case 'ETIMEDOUT':
          var msg = 'Não foi encontrado o destino ' +
              'para o endereço: ' + host + ':' + port;
          console.log(msg);
          connInfo.text(msg);
          break;
        }
      });
    }
  },
  resetConnection: function () {
    this.connection = null;
  },
  incPort: function () {
    this.port++;
  }
};
