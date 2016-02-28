function Socket(game){
    var sock;
    sock = io.connect();

    var scene = game.getScene();
    var props = game.getProps();
    var playerList = game.getPlayerList();
    
    
    sock.on('load props', function (data)
    {
        try 
        {
            data.rows.forEach(function (doc){
                doc = doc.value;
                props.Push(new Prop(doc, scene));

            });
        }
        catch(ex){console.log(ex) }
    });

    sock.on('load players', function(data){console.log('load players received')
        try 
        {   var mine = true;
            data.rows.forEach(function (doc){
                doc = doc.value; 
                if (!playerList.Search(doc._id))
                {
                    var player = new Player(doc, game, mine);           //FIX THAT TRUE
                    playerList.Push(player);                        
                    if (mine) var keyboard = new Keyboard(player, game);
                }

            });
        }catch (ex){console.log(ex.message)}
    });

    sock.on('create props', function(data){
        props.Push(new Prop(data, scene));
    });

    sock.on('update props', function(data){
        try {
        props.Search(data._id).update(data);
        }catch(ex){}
    });
        
    sock.on('remove props', function(data){
        try {
        props.Delete(data._id);
        }catch(ex){}
    })
        

   

    return {
        test: function (){
            return 'test';
        },
        emit: function(event, data){
            sock.emit(event, data);
        },
        on: function(event, f){
            sock.on(event, f);
        }
   
    }
    socket.emit('event', data);
    socket.on('event', function(){})

}




