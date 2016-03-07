
function Player(playerData, game, mine)
{   
    var engine = game.getEngine();
    var canvas = engine.getRenderingCanvas();
    var scene = game.getScene();

    var private = Pawn.call(this, playerData, game);
    var public = {};
    var _rev = playerData._rev;
    var _id = playerData._id;
    this._id = playerData._id;
    public._id = playerData._id;

    if (mine) var keyboard = new Keyboard(public, game);
    var root = scene.getMeshByName("sphere").clone();
    root.position = private.position;
    root.rotation = private.rotation;
    root.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3)
    
    var createCamera = function(){      //ERROR
        //delete private.camera;
        private.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.5, 0.8, new BABYLON.Vector3(0, 0, 0), scene);
        private.camera.attachControl(canvas, false);
        scene.activeCamera = private.camera;
        private.camera.parent = root;
        private.camera.angularSensibilityY = 500;
        private.camera.targetScreenOffset = new BABYLON.Vector2(0, -30);
        private.camera.radius = 120;
    }
    
    
    public.W = private.W;
    public.WC = private.WC;
    public.S = private.S;
    public.SC = private.SC;

    public.getMesh = function(){
        return private.mesh; 
    }
    public.getCamera = function(){
        return private.camera;    
    }
    public.getId = function(){
        return playerData._id;     
    }
    public.getRev = function(){
        return playerData._rev;    
    }
    public.setRev = function(rev){
        playerData._rev = rev;
    }
    public.updateCamData = function(data){
        private.camera.alpha = data.alpha;
        private.camera.beta = data.beta;    
    }
    public.isMine = function(){return mine;}
    public.getPlayerData = function(){return playerData;}

    //MAKE THIS GREAT
    public.dispose = function(){
        private.dispose();
        root.dispose();
        delete THIS;    
        
    }
    if (mine) createCamera();






    return public;
}




