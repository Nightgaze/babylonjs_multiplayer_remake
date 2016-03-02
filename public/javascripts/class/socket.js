function RealtimeSocket(game, name){
    var sock = io.connect(document.location.origin + '/realtimesocket');
    var scene = game.getScene();
    var props = game.getProps();
    var playerList = game.getPlayerList();

    sock.on('load players', function(data){
        //try 
        //{
          
            data.rows.forEach(function (doc){
                var id = doc.id;
                doc = doc.value; 
                
                if (!playerList.Search(doc._id))
                    {   
                        if (id == name) 
                            playerList.Push(new Player(doc, game, true));
                        else 
                            playerList.Push(new Player(doc, game, false)); 
                    }

            });
        //}catch (ex){console.log(ex.message)}
    });

    sock.on('remove player', function(name){
        playerList.Delete(name);    
    })

    sock.on('move player', function(data){
        console.log(data);
        var p = playerList.Search(data._id);
        if (p) switch (data.type){
            case 'W':
                p.W();
                break;
            case 'S':
                p.S();
                break;

        }
        //props.Search(data._id);    
    });

    sock.on('stop player', function(data){
        var p = playerList.Search(data._id);
        if (p) switch (data.type){
            case 'W':
                p.WC();
                break;
            case 'S':
                p.SC();
                break;

        }
        props.Search(data.id)    
    });
    sock.on('camera data', function(data){
       var p = playerList.Search(data._id);
       if (p)
           if (!p.isMine()) p.updateCamData(data);    
    });
    sock.on('update rev', function(data){
        var p = playerList.Search(data._id);
        if (p) p.setRev(data._rev);
    });

    return {
        emit: function(event, data){
            sock.emit(event, data);
        }    
        
    }
    
}

function UtilSocket(game){
    var sock = io.connect(document.location.origin + '/utilsocket');
    var scene = game.getScene();
    var props = game.getProps();
    var playerList = game.getPlayerList();
    
    
    sock.on('load props', function (data)
    {
        //try 
        //{
            data.rows.forEach(function (doc){
                doc = doc.value;
                props.Push(new Prop(doc, scene));

            });
        //}
        //catch(ex){console.log(ex) }
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
            if (modelSelector.active3D._id == data._id) modelSelector.active3D = null;
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




