

var WebSocket = {}

WebSocket.handleClient = function(client) {
  console.log('connection has the following headers', client.headers);
  console.log('connection was made from', client.address);
  console.log('connection id', client.id);

  spark.on('data', function (data) {
    console.log('received data from the client', data);

    //client.end();if you will
    client.write({ foo: 'bar' });
    client.write('banana');
  });

  client.write('Hello world');
}

module.exports = WebSocket;