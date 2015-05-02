require("babel/register");
var should = require('should');
var muk = require('muk');

var request = require('supertest');
var Server = require('../lib/server');

describe('Test DataHub', function() {
  var server = Server();
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
      .expect(/haha/)
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

  it('handle error when plugin throws exception', function() {
    var hub = server.get('hub');
    var pingPlugin = server.get('plugins')['ping'];

    muk(console, 'error', function(msg, d, pid, cname, fname, ename, emsg, estack) {
      if(arguments.length !== 8) return;

      msg.should.be.eql('\n[%s][pid: %s][%s][%s] %s: %s \nError Stack:\n  %s');
      pid.should.be.eql(process.pid);
      ename.should.be.eql('testError');
    });

    try {
      hub.emit('plugin:ping:testError');
    } catch(e) {
      e.message.should.be.equal('boom');
      e.data.test.should.be.equal('name');
      muk.restore()
    }

  });

  it('do some clean when onExit runs by process exiting', function() {
    // var instance = server.listen(19919);
    var hub = server.get('hub');
    hub.listeners('plugin:ping:*').length.should.be.above(0);
    hub.emit('destroy');
    hub.listeners('plugin:ping:*').length.should.be.equal(0);
  });

});

