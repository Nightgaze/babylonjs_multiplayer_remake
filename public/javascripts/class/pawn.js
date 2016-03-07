function Pawn(pawnData, game)
{
    
    var public = {};
    var engine = game.getEngine();
    var canvas = engine.getRenderingCanvas();
    var scene = game.getScene();

    public.position = new BABYLON.Vector3(pawnData.position.x, pawnData.position.y, pawnData.position.z);
    var private = Object3D.call(this, game, public.position, "box");
    public.mesh = private.mesh;
    public.camera = {alpha: 1, beta: 1};
    public.rotation = private.rotation;
    public.tranSpeed = pawnData.tranSpeed;
    public.flySpeed = pawnData.flySpeed;
    public.rotSpeed = pawnData.rotSpeed;
    public.canFly = pawnData.canFly;
    public.isFlying = pawnData.isFlying;
    public.isMoving = false;

    var forwardP = function()
    {
        var speed;
        if (public.isFlying) speed = public.flySpeed * (Math.abs(public.camera.beta - 3.14) * public.flySpeed * 2.3);
            else speed = tranSpeed;
        res = private.mesh.calcMovePOV(0, 0, 1);
        res.x = res.x * speed * scene.getAnimationRatio();
        res.y = res.y * speed * scene.getAnimationRatio();
        res.z = res.z * speed * scene.getAnimationRatio();
    

        pawnData.position.x += res.x;
        pawnData.position.y += res.y;
        pawnData.position.z += res.z;
    
        private.mesh.moveWithCollisions(res);

    }

    var forwardN = function()
    {
        var speed;
        if (public.isFlying) speed = public.flySpeed * public.camera.beta;
            else speed = public.tranSpeed;
        res = private.mesh.calcMovePOV(0, 0, -1);
  
        res.x += res.x * speed * scene.getAnimationRatio();
        res.y += res.y * speed * scene.getAnimationRatio();
        res.z += res.z * speed * scene.getAnimationRatio();
        pawnData.position.x += res.x;
        pawnData.position.y += res.y;
        pawnData.position.z += res.z;
        private.mesh.moveWithCollisions(res);

    }

    var upP = function()
    {
        var speed;
        if (public.isFlying) speed = public.flySpeed;
            else speed = public.tranSpeed;
        res = private.mesh.calcMovePOV(0, 1, 0);
        res.x += res.x * speed * scene.getAnimationRatio();
        res.y += res.y * speed * scene.getAnimationRatio();
        res.z += res.z * speed * scene.getAnimationRatio();
        pawnData.position.x += res.x; 
        pawnData.position.y += res.y;
        pawnData.position.z += res.z; 
        private.mesh.moveWithCollisions(res);

    }

    var upN = function()
    {
        var speed;
        if (public.isFlying) speed = public.flySpeed;
            else speed = public.tranSpeed;
        res = private.mesh.calcMovePOV(0, -1, 0);
        res.x += res.x * speed * scene.getAnimationRatio();
        res.y += res.y * speed * scene.getAnimationRatio();
        res.z += res.z * speed * scene.getAnimationRatio();
        pawnData.position.x += res.x;
        pawnData.position.y += res.y;
        pawnData.position.z += res.z;
        private.mesh.moveWithCollisions(res);
    }

    var rotationCheck = function()
    {
        var tmp = public.camera.alpha;
        var tmp2 = public.camera.beta;
        
        //X:
        if (tmp2 > 1.36) tmp2 = 1.36;
        if (tmp2 < 1.11) tmp2 = 1.11;
        var rot1 = private.mesh.calcRotatePOV(0, -1, 0);
        private.mesh.rotation.y = rot1.y * tmp ;

        if (public.isFlying){
            //Y si Z:
            var rot2 = private.mesh.calcRotatePOV(1, 0, 0);
            private.mesh.rotation.x = rot2.x * tmp2 * 5;
            var rot3 = private.mesh.calcRotatePOV(0, 0, -1);
            //public.mesh.rotation.z = rot3.z * tmp * 5;
        }
        else{
            //Y si Z:
            if (tmp2 > 1.36) tmp2 = 1.20;
            if (tmp2 < 1.11) tmp2 = 1.11;
            var rot2 = private.mesh.calcRotatePOV(1, 0, 0)
            private.mesh.rotation.x = rot2.x * tmp2 * 5;
        }
    }
    
   scene.registerBeforeRender(rotationCheck);

    //translation:
    public.W = function(){
        scene.registerBeforeRender(forwardP);
        
        public.isMoving = true;
        scene.registerBeforeRender(private.TerrainRaycast);
    }
    
    public.WC = function(){
        scene.unregisterBeforeRender(forwardP);
        public.isMoving = false;
        scene.unregisterBeforeRender(private.TerrainRaycast);
    }
    
    public.S = function(){
        scene.registerBeforeRender(forwardN);
        public.isMoving = true;
        scene.registerBeforeRender(private.TerrainRaycast);
    }
    
    public.SC = function(){
        scene.unregisterBeforeRender(forwardN);
        public.isMoving = false;
        scene.unregisterBeforeRender(private.TerrainRaycast);
    }

    public.dispose = function()
    {
        private.mesh.dispose();
        delete THIS;    
    }

    return public;
}