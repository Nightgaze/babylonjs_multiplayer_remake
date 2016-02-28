function Object3D(game, position, static, model){
    
    //attributes:
    this.isFlying = false;
    this.canFly = false;
    this.static = static;
    this.isMoving = false;
    var meshHeight = 30;
    
    
    //internal stuff:
    var THIS = this;
    var ground = game.getGround();
    var scene = game.getScene();
    this.position = position;
    this.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
    
    if (model)
        {
            try 
            {
                this.mesh = scene.getMeshByName(model).clone();
                this.mesh.material = scene.getMeshByName(model).material.clone();
            }
            catch(e)
            {
                console.log(e);
            }
                
            
                
        }
    else
        this.mesh = new BABYLON.Mesh.CreateSphere("object3d", 2, meshHeight, scene, true);

    this.mesh.position = this.position;
    
    if (!this.static)
    {
        this.tranSpeed = 1.2;
        this.rotSpeed = 3;
        this.flySpeed = 1.2;
        
        //Internal:
        this.forwardP = function(){
            var speed;
            if (THIS.isFlying) speed = THIS.flySpeed; //* (Math.abs(camera.beta - 3.14) * 3);
                else speed = THIS.tranSpeed;
            res = THIS.mesh.calcMovePOV(0, 0, 1);
            THIS.position.x += res.x * speed * scene.getAnimationRatio();
            THIS.position.y += res.y * speed * scene.getAnimationRatio();
            THIS.position.z += res.z * speed * scene.getAnimationRatio();

        }

        this.forwardN = function(){
            var speed;
            if (THIS.isFlying) speed = THIS.flySpeed ;//* camera.beta;
                else speed = THIS.tranSpeed;
            res = THIS.mesh.calcMovePOV(0, 0, -1);
            THIS.position.x += res.x * speed * scene.getAnimationRatio();
            THIS.position.y += res.y * speed * scene.getAnimationRatio();
            THIS.position.z += res.z * speed * scene.getAnimationRatio();

        }

        this.upP = function(){
            var speed;
            if (THIS.isFlying) speed = THIS.flySpeed;
                else speed = THIS.tranSpeed;
            res = THIS.mesh.calcMovePOV(0, 1, 0);
            THIS.position.x += res.x * speed * scene.getAnimationRatio();
            THIS.position.y += res.y * speed * scene.getAnimationRatio();
            THIS.position.z += res.z * speed * scene.getAnimationRatio();

        }

        this.upN = function(){
            var speed;
            if (THIS.isFlying) speed = THIS.flySpeed;
                else speed = THIS.tranSpeed;
            res = THIS.mesh.calcMovePOV(0, -1, 0);
            THIS.position.x += res.x * speed * scene.getAnimationRatio();
            THIS.position.y += res.y * speed * scene.getAnimationRatio();
            THIS.position.z += res.z * speed * scene.getAnimationRatio();
        }

        //translation:
        this.W = function(){
            scene.registerBeforeRender(THIS.forwardP);
            THIS.isMoving = true;
            scene.registerBeforeRender(TerrainRaycast);
        }

        this.WC = function(){
            scene.unregisterBeforeRender(THIS.forwardP);
            THIS.isMoving = false;
            scene.unregisterBeforeRender(TerrainRaycast);
        }

        this.S = function(){
            scene.registerBeforeRender(THIS.forwardN);
            THIS.isMoving = true;
            scene.registerBeforeRender(TerrainRaycast);
        }

        this.SC = function(){
            scene.unregisterBeforeRender(THIS.forwardN);
            THIS.isMoving = false;
            scene.unregisterBeforeRender(TerrainRaycast);
        }
    }
    else TerrainRaycast();
    

    
    function TerrainRaycast()
    {   
                    
        var p = new BABYLON.Vector3(THIS.position.x, ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, THIS.position.z)
        var ray = new BABYLON.Ray(p, new BABYLON.Vector3(0, -1, 0));


        var worldInverse = new BABYLON.Matrix();
        ground.getWorldMatrix().invertToRef(worldInverse);
        ray = BABYLON.Ray.Transform(ray, worldInverse);

        pickInfo = ground.intersects(ray);
        if (pickInfo.hit)
        {

            if (THIS.isFlying)
            {
                if (THIS.mesh.position.y <= pickInfo.pickedPoint.y)
                {
                    THIS.isFlying = false;

                    THIS.position.y = pickInfo.pickedPoint.y + meshHeight/2;
                    scene.unregisterBeforeRender(THIS.float);
                }
            }
            else 
            {
                THIS.position.y = pickInfo.pickedPoint.y + meshHeight/2;
                scene.unregisterBeforeRender(THIS.float);

            }

        }               

}
    
    
    
       
    var clock=Math.PI;
    this.float = function(){
        clock+=0.01
        THIS.position.y += Math.sin(clock)/12;
        
    }
    
    if (!static)
        scene.registerBeforeRender(THIS.float);
    
    this.ascension = function(){
        clock += 0.01;
        if (Math.sin(clock)>0)
            THIS.position.y += Math.sin(clock)/12;
        else scene.unregisterBeforeRender(this);
        
    }
 
}


