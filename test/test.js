
var request = require('supertest');
var server = require('../lib/server');

describe('Test DataHub', function() {

  it('request / and get hello world', function(done) {
    request(server)
      .get('/')
      .expect(200)
      .expect(/hello datahub/i)
      .end(done);
  });

  it('check loaded plugins and there should be "ping"', function(done) {
    request(server)
      .get('/plugins')
      .expect(200)
      .expect(/ping/)
      .end(done);
  });

  it('request plugin api and get default greeting value ', function(done) {
    request(server)
      .get('/ping')
      .expect(200)
      .expect(/pong/i)
      .expect(/Jack/)
      .end(done);
  });

  it('send message to plugin ping to set new greeting value', function(done) {
    var hub = server.get('hub');
    var pingPlugin = server.get('plugins')['ping'];
    hub.emit('plugin:ping:setGreeting', 'new-value');

    request(server)
      .get('/ping')
      .expect(200)
      .expect(/pong/i)
      .expect(/new-value/)
      .end(done);
  });

});

