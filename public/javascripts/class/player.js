
function Player(playerData, game, mine)
{   
    
    var _rev = playerData._rev;
   
    var _id = playerData._id;
    this._id = playerData._id;
    var position = new BABYLON.Vector3(playerData.position.x, playerData.position.y, playerData.position.z);
    var tranSpeed = playerData.tranSpeed;
    var flySpeed = playerData.flySpeed;
    var rotSpeed = playerData.rotSpeed;
    var canFly = playerData.canFly;
    var isFlying = playerData.isFlying;
    var public = Object3D.call(this, game, position, "box");
    public._id = playerData._id;
    var engine = game.getEngine();
    var canvas = engine.getRenderingCanvas();
    var scene = game.getScene();
    var camera = {alpha: 1, beta: 1};

    if (mine) var keyboard = new Keyboard(public, game);
    var root = scene.getMeshByName("sphere").clone();
    root.position = position;
    root.rotation = public.rotation;
    root.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3)
    
    var createCamera = function(){
        camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.5, 0.8, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, false);
        scene.activeCamera = camera;
        camera.parent = root;
        camera.angularSensibilityY = 500;
        camera.targetScreenOffset = new BABYLON.Vector2(0, -30);
        camera.radius = 120;
    }
    var forwardP = function(){
            var speed;
            if (isFlying) speed = flySpeed* (Math.abs(camera.beta - 3.14) * flySpeed * 2.3);
                else speed = tranSpeed;
            res = public.mesh.calcMovePOV(0, 0, 1);
            position.x += res.x * speed * scene.getAnimationRatio();
            position.y += res.y * speed * scene.getAnimationRatio();
            position.z += res.z * speed * scene.getAnimationRatio();
            playerData.position.x += res.x * speed * scene.getAnimationRatio();
            playerData.position.y += res.y * speed * scene.getAnimationRatio();
            playerData.position.z += res.z * speed * scene.getAnimationRatio();

        }

        var forwardN = function(){
            var speed;
            if (isFlying) speed = flySpeed * camera.beta;
                else speed = tranSpeed;
            res = public.mesh.calcMovePOV(0, 0, -1);
            position.x += res.x * speed * scene.getAnimationRatio();
            position.y += res.y * speed * scene.getAnimationRatio();
            position.z += res.z * speed * scene.getAnimationRatio();
            playerData.position.x += res.x * speed * scene.getAnimationRatio();
            playerData.position.y += res.y * speed * scene.getAnimationRatio();
            playerData.position.z += res.z * speed * scene.getAnimationRatio();

        }

        var upP = function(){
            var speed;
            if (isFlying) speed = flySpeed;
                else speed = tranSpeed;
            res = public.mesh.calcMovePOV(0, 1, 0);
            position.x += res.x * speed * scene.getAnimationRatio();
            position.y += res.y * speed * scene.getAnimationRatio();
            position.z += res.z * speed * scene.getAnimationRatio();
            playerData.position.x += res.x * speed * scene.getAnimationRatio();
            playerData.position.y += res.y * speed * scene.getAnimationRatio();
            playerData.position.z += res.z * speed * scene.getAnimationRatio();

        }

        var upN = function(){
            var speed;
            if (isFlying) speed = flySpeed;
                else speed = tranSpeed;
            res = public.mesh.calcMovePOV(0, -1, 0);
            position.x += res.x * speed * scene.getAnimationRatio();
            position.y += res.y * speed * scene.getAnimationRatio();
            position.z += res.z * speed * scene.getAnimationRatio();
            playerData.position.x += res.x * speed * scene.getAnimationRatio();
            playerData.position.y += res.y * speed * scene.getAnimationRatio();
            playerData.position.z += res.z * speed * scene.getAnimationRatio();
        }

    var rotationCheck = function(){
        var tmp = camera.alpha;
        var tmp2 = camera.beta;
        
        //X:
        if (tmp2 > 1.36) tmp2 = 1.36;
        if (tmp2 < 1.11) tmp2 = 1.11;
        var rot1 = public.mesh.calcRotatePOV(0, -1, 0);
        public.mesh.rotation.y = rot1.y * tmp ;

        if (public.isFlying){
            //Y si Z:
            var rot2 = public.mesh.calcRotatePOV(1, 0, 0);
            public.mesh.rotation.x = rot2.x * tmp2 * 5;
            var rot3 = public.mesh.calcRotatePOV(0, 0, -1);
            //public.mesh.rotation.z = rot3.z * tmp * 5;
        }
        else{
            //Y si Z:
            if (tmp2 > 1.36) tmp2 = 1.20;
            if (tmp2 < 1.11) tmp2 = 1.11;
            var rot2 = public.mesh.calcRotatePOV(1, 0, 0)
            public.mesh.rotation.x = rot2.x * tmp2 * 5;
        }
    }
    
   scene.registerBeforeRender(rotationCheck);

    //translation:
    public.W = function(){
        scene.registerBeforeRender(forwardP);
        isMoving = true;
        scene.registerBeforeRender(public.TerrainRaycast);
    }
    
    public.WC = function(){
        scene.unregisterBeforeRender(forwardP);
        isMoving = false;
        scene.unregisterBeforeRender(public.TerrainRaycast);
    }
    
    public.S = function(){
        scene.registerBeforeRender(forwardN);
        isMoving = true;
        scene.registerBeforeRender(public.TerrainRaycast);
    }
    
    public.SC = function(){
        scene.unregisterBeforeRender(forwardN);
        isMoving = false;
        scene.unregisterBeforeRender(public.TerrainRaycast);
    }
    public.getCamera = function(){
        return camera;    
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
        camera.alpha = data.alpha;
        camera.beta = data.beta;    
    }
    public.isMine = function(){return mine;}
    public.getPlayerData = function(){return playerData;}

    //MAKE THIS GREAT
    public.dispose = function(){
        public.mesh.dispose();
        root.dispose();
        delete THIS;    
        
    }
    if (mine) createCamera();
    return public;
}




