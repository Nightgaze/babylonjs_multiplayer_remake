function Keyboard(player, game)
{

    var keyW = false;
    var keyS = false;
    var socket = game.getSocket();
    
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
                    keyW = true;
                }
                break;
                
            case 83:
                if (!keyS)      //S
                {
                    //player.S();
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
                    keyW = false;
            
                }
                break;
                
            case 83:
                if (keyS)   //S
                {
                    //player.SC();
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
            
        }
            
    ]);
    
    window.addEventListener('contextmenu', function(event){
        event.preventDefault();
        
    });
    
}