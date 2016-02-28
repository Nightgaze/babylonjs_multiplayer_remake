function Object3D(game, position, model){

    var isFlying = true;
    var public = {};
    var scene = game.getScene();
    var ground = game.getGround();
    
    try {
    mesh = scene.getMeshByName(doc.model).clone();
    }catch(ex){mesh = scene.getMeshByName("sphere").clone()}
    finally{mesh.position = position}
    

    public.TerrainRaycast = function(){   
        var p = new BABYLON.Vector3(position.x, ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, position.z)
        var ray = new BABYLON.Ray(p, new BABYLON.Vector3(0, -1, 0));
        var worldInverse = new BABYLON.Matrix();
        ground.getWorldMatrix().invertToRef(worldInverse);
        ray = BABYLON.Ray.Transform(ray, worldInverse);
        pickInfo = ground.intersects(ray);
        if (pickInfo.hit)
        {
            if (isFlying)
            {
                if (mesh.position.y <= pickInfo.pickedPoint.y){
                    isFlying = false;
                    position.y = pickInfo.pickedPoint.y + meshHeight/2;  
                }
            }
            else {
                position.y = pickInfo.pickedPoint.y + meshHeight/2;
            }
        }               
    }    
    public.TerrainRaycast();
}