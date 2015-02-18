var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var routes = require('./routes/');
//var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');

var app = express(); //use express.

app.set('dbhost', process.env.IP || 'localhost');
app.set('dbname', 'rr'); 
mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
nunjucks.configure('views', { //setting up our templating engine
    autoescape: true,
    express: app,
    watch: true
});


app.set('port', process.env.PORT || 1337); // telling c9 where our app runs.
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ //make user input safe
    extended: false
}));

app.use(multer({
        dest: './tmp/'
    })); //need to figure out exactly what this does.

app.use(cookieParser('Super secret robots find us all. We cant do anything about it')); //things to track the user
app.use(session({
    secret: 'Oh look at my oh look at me, I forget the rest, I want a nap.',
    resave: true,
    saveUninitialized: true
}));

app.use(routes.setup(app)); //setup them routes

var server = http.createServer(app).listen(app.get('port'), function(){
    var address = server.address();
    console.log("Radio Room Running on https://%s:%s",
        address.address, address.port);
});


/*var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Radio Room Running on https://%s:%s",
        address.address, address.port);
});*/