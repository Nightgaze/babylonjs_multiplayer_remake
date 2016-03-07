function NPC(pawnData, game)
{
    var public = Pawn.call(this, pawnData, game);
    var fov = BABYLON.Mesh.CreateCylinder("fov", 200, 40, 200, 4, 4, game.getScene());
    //fov.checkCollisions = true;
    fov.rotation.x = Math.PI/2;
    fov.rotation.y = public.rotation.y;
    fov.position = public.position;
    public.flySpeed = 0.5;
    var brain = new Neuron(2);
    //Input for brain:
    var targX, targZ;

    //use octrees
    game.getScene().registerBeforeRender(function(){
        var players = game.getPlayerList().Show();
        for (var i=0; i < players.length; i++)
            if (fov.intersectsMesh(players[i].getMesh(), true))
            {
                var p = players[i];
                targX =  players[i].getMesh().position.x;
                targZ = players[i].getMesh().position.z;
                var dir = brain.predict([1/targX, 1/targZ, 1]);
                public.camera.alpha = dir * 10;
                if (public.mesh.intersectsMesh(p.getMesh(), true))
                    brain.train([[1/targX, 1/targZ, 1]], [0])
                else brain.train([[1/targX, 1/targZ, 1]], [1]);
                
            }
           
    });



}