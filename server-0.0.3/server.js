var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var uri_base = 'http://localhost:7474';

var app = express();
app.use(bodyParser());

app.get('/db/data/index/node/', function(req, res){
  var options = {
    uri: uri_base + '/db/data/index/node/',
    json: true
  };
  request.get(options, function(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log('Get Request Recieved');
      res.header('Content-Type', 'application/json');
      res.header("Access-Control-Allow-Origin", "*")
      res.json(body);
    } else {
      console.log('error: '+ response.statusCode);
    }
  });
});

app.get('/db/data/labels/', function(req, res){
	  var options = {
	    uri: uri_base + '/db/data/labels/',
	    json: true
	  };
	  request.get(options, function(error, response, body){
	    if (!error && response.statusCode == 200) {
	      console.log('Get Request Recieved');
	      res.header('Content-Type', 'application/json');
	      res.header("Access-Control-Allow-Origin", "*")
	      res.json(body);
	    } else {
	      console.log('error: '+ response.statusCode);
	    }
	  });
	});

app.post('/db/data/schema/index', function(req, res){
	  var options = {
	    uri: uri_base + '/db/data/schema/index/' + req.body.label + '/',
	    json: true
	  };
	  request.get(options, function(error, response, body){
	    if (!error && response.statusCode == 200) {
	      console.log('Get Request Recieved');
	      res.header('Content-Type', 'application/json');
	      res.header("Access-Control-Allow-Origin", "*")
	      res.json(body);
	    } else {
	      console.log('error: '+ response.statusCode);
	    }
	  });
	});

app.post('/db/data/cypher', function(req, res){
  console.log('Cypher Request Recieved');
  if (req.body.query.search(/create|merge|set|delete|remove|foreach/i) != -1) {
    console.log('Cypher Request Rejected');
  } else {
    var options = {
      uri: uri_base + '/db/data/cypher',
      json: true,
      form: req.body
    };
    request.post(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log('Cypher Responce Recieved');
        res.set('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*")
        res.json(body);
      } else {
        console.log('error: '+ response.statusCode);
        console.log(body);
      }
    });
  }
});

app.listen(9001);

