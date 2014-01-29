'use strict';

var express = require('express')
var Primus = require('primus')
var app = express()

app.configure(function() {
  app.use(express.static('./public'))
  app.use(express.json())
  app.use(express.urlencoded())
})

var server = require('http').createServer(app)

var primus = new Primus(server, {})

server.listen(3000)

primus.on('connection', function (spark) {

})