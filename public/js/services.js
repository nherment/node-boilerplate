'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]
);

var logger = console;

phonecatServices.factory('uuid', [function($q, $rootScope) {
    return {
      v4: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
          return v.toString(16)
        })
      }
    }
  }]
)

phonecatServices.factory('backend', ['$q', '$rootScope', 'uuid', function($q, $rootScope, uuid) {
  // We return this object to anything injecting our service
  var Service = {};

  var primus = new Primus();

  primus.on('reconnect', function reconnect(opts) {
    logger.info('reconnect', 'Reconnecting', 'We are <strong>scheduling</strong> a new reconnect attempt. This is attempt <strong>'+ opts.attempt +'</strong> and will trigger a reconnect operation in <strong>'+ opts.timeout +'</strong> ms.');

  });

  primus.on('reconnect', function reconnect() {
    logger.info('reconnect', 'Reconnect', 'Starting the reconnect attempt, hopefully we get a connection!');
  });

  primus.on('online', function online() {
    logger.info('network', 'Online', 'We have regained control over our internet connection.');
  });

  primus.on('offline', function offline() {
    logger.info('network', 'Offline', 'We lost our internet connection.');
  });

  primus.on('open', function open() {
    logger.info('open', 'Open', 'The connection has been established.');

  });

  primus.on('error', function error(err) {
    logger.info('error', 'Error', 'An unknown error has occured <code>'+ err.message +'</code>');
  });

  primus.on('data', function incoming(data) {
    logger.info('data', 'Received data', 'string' === typeof data ? data : '<pre><code>'+ JSON.stringify(data, null, 2) +'</code></pre>');

    try {
      var wrapper = JSON.parse(data)
    } catch(err) {
      logger.error(err)
      return;
    }

    if(wrapper && wrapper.event) {
      // TODO: emit event
    } else if(wrapper.id && callbacks[wrapper.id]) {
      // TODO: implement streaming protocol (eg. wrapper.ongoing = true) and keep calling the callback until ended
      callbacks[wrapper.id](wrapper.message)
      delete callbacks[wrapper.id]
    }

  });

  primus.on('end', function end() {
    logger.info('end', 'End', 'The connection has ended.');
  });

  primus.on('close', function end() {
    logger.info('close', 'close', 'We\'ve lost the connection to the server.');
  });

  var callbacks = {}

  // Define a "getter" for getting customer data
  Service.send = function(message, callback) {
    var wrapper = {
      id: uuid.v4(),
      message: message
    }

    if(callback) {
      callbacks[wrapper.id] = callback;
    }

    primus.write(JSON.stringify(wrapper));
  }

  return Service;
}])