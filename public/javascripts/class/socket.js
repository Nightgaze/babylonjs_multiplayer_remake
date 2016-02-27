function Socket(game){
    var sock;
    sock = io.connect();

    var scene = game.getScene();
    var props = game.getProps();
    sock.on('load props', function (data)
    {
        try 
        {
            data.rows.forEach(function (doc){
                doc = doc.value;
                var prop = new Prop(doc, scene);
                props.Push(prop);

            });
        }
        catch(ex){console.log(ex) }
    });

    sock.on('update props', function(data)
    {
        if (!data.update){ console.log('new');
           
            var prop = new Prop(data, scene);
            props.Push(prop);
            //console.log(prop._id);
        }
        else 
        {
            console.log('cautat: ' + data._id);
           
            props.Search(data._id).update(data);
            //console.log(p);
        }

    });

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




