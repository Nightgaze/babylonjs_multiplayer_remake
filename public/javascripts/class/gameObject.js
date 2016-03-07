function GameObject()
{
    var public = {};
    var isConnected = false;
    var canvas, engine, scene, camera,
    light,
    models = [], materials = [], name;
    var realtimeSocket, utilSocket;
    var modelSelector;
    var props = new List(), playerList = new List();
    

    var createScene = function()
    {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);

        //Environment
        scene.fogEnabled = true;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.0002;
        //scene.clearColor = new BABYLON.COLOR3(0.6, 0.6, 0.9);
        light = new BABYLON.DirectionalLight("Directional", new BABYLON.Vector3(0, -1, -0.3), scene);
        
        /*Physics
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());
        scene.collisionsEnabled = true;
        scene.debugLayer.shouldDisplayAxis = true;*/

        //scene.debugLayer.show();
        camera = new BABYLON.ArcRotateCamera("Camera", 0.5, 1.4, 300, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        camera.keysLeft = [39];
        camera.keysRight = [37];

        return scene;
    }
    
    var loadModels = function(){

        models.push(new BABYLON.Mesh.CreateSphere('sphere', 12, 20, scene, true));
        models.push(new BABYLON.Mesh.CreateBox('box', 20, scene, true));
        models.push(new BABYLON.Mesh.CreateCylinder('cylinder', 100, 40, 40, 10, 10, scene, true));

        var standardMaterial = new BABYLON.StandardMaterial('standard material', scene);
        standardMaterial.diffuseColor = BABYLON.Color3.FromInts(0, 50, 100);
        materials.push(standardMaterial);

        var redMaterial = new BABYLON.StandardMaterial('red material', scene);
        redMaterial.diffuseColor = BABYLON.Color3.FromInts(255, 50, 0);
        materials.push(redMaterial);

        ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/MultiplayerWorld.jpg", 8000, 8000, 100, 0, 1200, scene, false);
        ground.position.y-=400;
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.wireframe = true;
        ground.material = groundMaterial;
      
        ground.refreshBoundingInfo();
        computeWorldInverse(ground);

        
    }

    
    var computeWorldInverse = function (mesh)
    {
        mesh.worldInverse = new BABYLON.Matrix();
        mesh.getWorldMatrix().invertToRef(mesh.worldInverse);
    }

    //HERE
    var setupGame = function (){
        scene = createScene();
        loadModels();
        scene.executeWhenReady(public.connect);
    }

    
    var render = function(){
        scene.render();
    }
    window.addEventListener("resize", function () { engine.resize(); });

    //Public:
   
    public.getUtilSocket = function(){
        return utilSocket;    
    }
    public.getRealtimeSocket = function(){
        return realtimeSocket;
    }
    public.getScene = function(){
        return scene;   
    }
    public.getPlayerList = function(){
        return playerList;    
    }
    public.getGround = function(){
        return ground;    
    }
    public.getEngine = function(){
        return engine;    
    }
    public.getModels = function(){
        return models;
    }   
    public.getMaterials = function(){
        return materials;    
    }
    public.getProps = function(){
        return props;    
    }

    
    public.connect = function (){
        if (!isConnected){                //name, pos, tranSpeed, canFly, flySpeed, rotSpeed, model
            name = Math.random().toString(36).substring(7);
            realtimeSocket = new RealtimeSocket(public, name);
            realtimeSocket.emit('set name', name);
            //var playerData = new PlayerData("L",  pos,  1.2,       true,    2,       1.2);

            //playerList.Push(new Player(playerData, public, true));
            isConnected = true;
        }
        else console.log('You are already connected.');
    }

    setupGame();
    engine.runRenderLoop(render);

    utilSocket = new UtilSocket(public);
    modelSelector = new ModelSelector(public, utilSocket);
    public.getModelselector = function(){
        return modelSelector;    
    }
    public.test = function(){return 'test'}
    return public;
 }
 
   





