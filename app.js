var DATABASE = 'http://127.0.0.1:5984';

var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(80);

var PlayerData = require('./public/javascripts/class/playerdata.js');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var nano = require('nano')(DATABASE);
var props = nano.use('props');
var players = nano.use('players');

//IT'S ELEGANT BUT INEFFICIENT, MOVE THIS GARBAGE AND STOP WAITING FOR DB'S ASS, DO IT RIGHT AWAY
var propsFeed = props.follow({include_docs:true, feed: "longpoll" ,since: "now"});
propsFeed.on('change', function (change) { //console.log(change);
    if (change.doc._deleted) ;
       // io.sockets.emit('remove props', change.doc);
    else if (change.doc.update) 
        io.sockets.emit('update props', change.doc);
    else if(change.doc.create)io.sockets.emit('create props', change.doc);
});
propsFeed.follow();

var playersFeed = players.follow({include_docs: true, feed: "longpoll", since: "now"});
playersFeed.on('change', function(change){console.log('change');
    //distinguish
    players.view('design', 'get players', function(err, res){
        if (err) console.log(err.message)
        else if (res.rows.length != 0)
            {io.sockets.emit('load players', playerData);  console.log('sent it fam');}
    });

})
playersFeed.follow();

/*
feed.on('change', function (change) {
  console.log("change: ", change);
});
feed.follow();
process.nextTick(function () {
  props.insert({"bar": "baz"}, "bar");
});*/



//SOCKET.IO
io.on('connection', function (socket){
    pos = {x: Math.random() * 200, y: 300, z: Math.random() * 200};
                                    //name, pos, tranSpeed, canFly, flySpeed, rotSpeed, model
    var name = Math.random().toString(36).substring(7);
    var data = new PlayerData(name,  pos,  1.2,       true,    2,       1.2);
    //io.sockets.emit('new player', playerData);
    players.insert(data, data.name, function (err, body, header){
            if (err){
                console.log(err.message);
                return;
            } 
     });

    //send event to load all players
    players.view('design', 'get players', function (err, res)
    {
        if (err) console.log(err.message)
         if (res.rows.length != 0)
           io.sockets.emit('load players', res);
    });


    //get props:
    props.view('design', 'get props', function (err, res)
    {
        if (res.rows.length != 0)
            socket.emit('load props', res);
    });


    /*socket.on('request rev', function(data){
        props.view('design', 'get props',{keys: [data._id]}, function(err, body){      
            socket.emit('get rev', {_rev: body.rows[0].value._rev});
        });    
        
    });*/

    socket.on('update props', function(data){
        props.insert(data, function(err, body){
            if (err) console.log(err.message);  
        });
    });

    socket.on('create props', function(data){
        var d = new Date();
        props.insert(data, d.getTime().toString(), function (err, body, header){
            if (err){
                console.log(err.message);
                return;
            } 
         });
     });
       

    socket.on('remove props', function(data){
        props.destroy(data._id, data._rev, function(err, body){
           if (err) console.log(err.message);
           else io.sockets.emit('remove props', data);
        });    
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
