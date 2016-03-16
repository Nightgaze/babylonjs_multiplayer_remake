var DATABASE = 'http://127.0.0.1:5984';

var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(80);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');

var PlayerData = require('./public/javascripts/class/playerdata.js');

//DB:
var nano = require('nano')(DATABASE);
nano.db.get('players', function (err, body){
    if (!err) console.log(body);
    else console.log(err);    
});
/*nano.db.create('props', function(err, body){
    if (!err) console.log(body);    
});
nano.db.create('players', function(err, body){
   if (!err) console.log(body); 
});*/

var props = nano.use('props');
var players = nano.use('players');

//app.get('/orice', function(){});
//SOCKET.IO
var utilSocket = io.of('/utilsocket').on('connection', function(socket){
    props.view('design', 'get props', function (err, res){
        if (res.rows.length != 0)
            socket.emit('load props', res);
        
    });


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
           else utilSocket.emit('remove props', data);
        });    
    });

});

var realtimeSocket = io.of('/realtimesocket').on('connection', function (socket){
    socket.on('set name', function(name){
        console.log(name + ' has connected!')
        socket.name = name;
        pos = {x: Math.random() * 200, y: 300, z: Math.random() * 200};                              
  
                                //name, pos, tranSpeed, canFly, flySpeed, rotSpeed, model
        var data = new PlayerData(name,  pos,  0.8,       true,    1,       1.2);
        //io.sockets.emit('new player', playerData);
        players.insert(data, data.name, function (err, body, header){
                if (err){
                    console.log(err.message);
                    return;
                } 
         });
    });
    socket.on('disconnect', function(data){
        console.log(socket.name + ' has disconnected.');
        var rev;
        players.view('design', 'get players',{keys: [socket.name]}, function(err, res){  
            try {    
                rev = res.rows[0].value._rev;
                players.destroy(socket.name, rev, function(err, body){
                    if (err) console.log(err.message);
                 
                })
            }catch(ex){}
        }); 
 
    });

    socket.on('move player', function(data){realtimeSocket.emit('move player', data);});
    socket.on('stop player', function(data){
        
        realtimeSocket.emit('stop player', data);
        data.update = true;
        players.insert(data, function(err, body){
            if (err) console.log(err.message);
        });
        //socket.emit('update rev', )
     });
    socket.on('camera data', function(data){
       realtimeSocket.emit('camera data', data);
    });
    

});


//IT'S ELEGANT BUT INEFFICIENT, MOVE THIS GARBAGE AND STOP WAITING FOR DB'S ASS, DO IT RIGHT AWAY
var propsFeed = props.follow({include_docs:true, feed: "longpoll" ,since: "now"});
propsFeed.on('change', function (change) { //console.log(change);
    if (change.doc._deleted) ;
       // io.sockets.emit('remove props', change.doc);
    else if (change.doc.update) 
        utilSocket.emit('update props', change.doc);
    else if(change.doc.create) utilSocket.emit('create props', change.doc);
});
propsFeed.follow();

var playersFeed = players.follow({include_docs: true, feed: "longpoll", since: "now"});
playersFeed.on('change', function(change){console.log(change); console.log('\n');
  
    //distinguish
    if (change.doc._deleted) realtimeSocket.emit('remove player', change.doc._id);
    else if (change.doc.update) realtimeSocket.emit('update rev', {_id: change.doc._id, _rev: change.doc._rev});
    else
        players.view('design', 'get players', function(err, res){
            if (err) console.log(err.message)
            else if (res.rows.length != 0)
                realtimeSocket.emit('load players', res);
        });

    

})
playersFeed.follow();



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

