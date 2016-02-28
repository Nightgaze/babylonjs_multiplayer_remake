function Socket(name, game){
    var THIS = this;
    var sock;
    sock = io.connect();
      
    //sock.name = name;
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

    sock.on('load players', function(data){
        //try 
        //{   
            data.rows.forEach(function (doc){
                doc = doc.value; 
                var mine = true;
                if (!playerList.Search(doc._id))
                    {   console.log(name + 'comparat cu ' + doc._id)
                        if (name == doc._id) {mine = true; console.log('MORENA WOOP');}
                        playerList.Push(new Player(doc, game, mine));       //FIX THAT TRUE
                    }
                else console.log('fecal')
            });
        //}catch (ex){console.log(ex.message)}
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
        emit: function(event, data){        //GET THIS OUT OF HERE, IT'S NOT SAFE
            sock.emit(event, data);
        },
        on: function(event, f){             //AND THIS
            sock.on(event, f);
        }
   
    }
    socket.emit('event', data);
    socket.on('event', function(){})

}




