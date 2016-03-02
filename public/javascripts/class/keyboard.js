function Keyboard(player, game)
{

    var keyW = false;
    var keyS = false;
    var socket = game.getRealtimeSocket();
    
    function onKeyDown(event)
    {
        var x = event.which || event.keyCode; 
        switch(x)
        {

                
            //Controls:
            case 87:
                if (!keyW)      //W
                {
                    //player.W();
                    socket.emit('move player', {_id: player._id, type: 'W'});
                    keyW = true;
                }
                break;
                
            case 83:
                if (!keyS)      //S
                {
                    //player.S();
                    socket.emit('move player', { _id: player._id, type: 'S'});
                    keyS = true;
                }
                break;    
        }     
    }
    
    function onKeyUp(event)
    {
        var x = event.which || event.keyCode;
        switch(x)
        {
            //Controls:
            case 87:        //W
                if(keyW)
                {
                    //player.WC();
                    var data = player.getPlayerData();
                    data.type = 'W';
                    socket.emit('stop player', data);
                    keyW = false;
            
                }
                break;
                
            case 83:
                if (keyS)   //S
                {
                    var data = player.getPlayerData();
                    data.type = 'S';
                    socket.emit('stop player', data);
                    keyS = false;
                }
                break;
            

        }
        
    }
    
    function onKeyPress(event)
    {
        var x = event.which || event.keyCode;
        
        switch(x)
        {
            case 32:
                //player.Space();
                break;
                    
        }
        
    }
    
    function onClick(event){
        switch (event.which || event.keyCode || event.charCode)
        {
            case 1:     //L
                    //player.spells['Fireball'].Cast();
                    break;
                
                
            case 2:     //M
                    
                    break;
                    
            case 3:      //R
                    
                    break;
        }
    }

    function onMouseDown(){
        var cam = player.getCamera();
        var prec = {};
        game.getScene().registerBeforeRender(function(){
            //var data = {alpha: cam.alpha, beta: cam.beta, _id: player.getId()}
            if ((prec.alpha != cam.alpha) && (prec.beta != cam.beta)){
                prec.alpha = cam.alpha;
                prec.beta = cam.beta;
                socket.emit('camera data', {alpha: cam.alpha, beta: cam.beta, _id: player.getId()});
            }
            /*if (prec != data){ console.log(prec.alpha + ' comparat cu ' + data.alpha)
                socket.emit('camera data', data);
                prec = data;
            }*/
        });
            
    }
    
    BABYLON.Tools.RegisterTopRootEvents([
        {
            name: "keydown",
            handler: onKeyDown
        },
        {
            name: "keyup",
            handler: onKeyUp
            
        },
        {
            name: "keypress",
            handler: onKeyPress
        },
        {
            name: "click",
            handler: onClick
            
        },
        {
            name: "mousedown",
            handler: onMouseDown
        }
            
    ]);
    
    window.addEventListener('contextmenu', function(event){
        event.preventDefault();
        
    });
    
}