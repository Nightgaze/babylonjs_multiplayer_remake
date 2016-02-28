function Object3D(game, position, model){

    var isFlying = true;
    var public = {};
    var scene = game.getScene();
    var ground = game.getGround();
    public.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
    public.position = position;
    try {
    public.mesh = scene.getMeshByName(doc.model).clone();
    }catch(ex){public.mesh = scene.getMeshByName("sphere").clone()}
    finally{public.mesh.position = public.position}
    

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
                if (public.mesh.position.y <= pickInfo.pickedPoint.y){
                    isFlying = false;
                    position.y = pickInfo.pickedPoint.y + public.meshHeight/2;  
                }
            }
            else {
                position.y = pickInfo.pickedPoint.y + public.meshHeight/2;
            }
        }               
    }    

    return public;
}