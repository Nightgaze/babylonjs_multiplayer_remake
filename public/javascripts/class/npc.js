function NPC(pawnData, game, creatures)
{   
    var private = Pawn.call(this, pawnData, game);
    
    private.mesh.material = new BABYLON.StandardMaterial("npc", game.getScene());
    private.mesh.material.diffuseColor = BABYLON.Color3.FromInts(0, 120, 10);
    private.flySpeed = 0.5;

    private.fov = BABYLON.Mesh.CreateSphere("fov", 90, 30, game.getScene());
    private.fov.material = new BABYLON.StandardMaterial("sight volume", game.getScene());
    private.fov.material.wireframe = true;
    private.fov.position = private.position;

    var public = {};
    public.moveTo = function(r, o1)
    {
        //private.camera.alpha = o1;
        //private.camera.beta = o2;
        var y = private.mesh.position.y;
        var x = private.mesh.position.x + r * Math.cos(o1);
        var z = private.mesh.position.z + r * Math.sin(o1);

        var pos = new BABYLON.Vector3(x, y, z);
        console.log(pos);
        private.mesh.lookAt(pos);

        
        private.W();
        console.log('started movin');

        var mota = function(){
            if ((Math.abs(private.position.x - pos.x) < 10)&&
                (Math.abs(private.position.z - pos.z) < 10))
                {
                    private.WC();
                    console.log('stopped');
                    game.getScene().unregisterBeforeRender(mota);
                }
            
        }

        game.getScene().registerBeforeRender(mota);
        
            
    }

       


    return public;
}