function GameObject()
{
    var public = {};
    var isConnected = false;
    var canvas, engine, scene, camera,
    light,
    playerList, models = [], materials = [];

    var props = new List();
    pos = new BABYLON.Vector3(Math.random() * 200, 300, Math.random() * 200);
    

    var createScene = function()
    {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);

        //Environment
        scene.fogEnabled = true;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.0007;
        
        light = new BABYLON.DirectionalLight("Directional", new BABYLON.Vector3(0, -1, -0.3), scene);
        
        /*Physics
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());
        scene.collisionsEnabled = true;
        scene.debugLayer.shouldDisplayAxis = true;*/

        //scene.debugLayer.show();
        camera = new BABYLON.ArcRotateCamera("Camera", 0.5, 1.4, 300, pos, scene);
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

        ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/MultiplayerWorld.jpg", 8000, 8000, 50, 0, 1200, scene, false);
        ground.position.y-=400;
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
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
        playerList = new List();
        scene.executeWhenReady(public.connect);
    }

    
    var render = function(){
        scene.render();
    }
    window.addEventListener("resize", function () { engine.resize(); });

    //Public:
   
    
    public.connect = function (){
        if (!isConnected){
            playerList.Push(new Player("L", public, pos, true));
            isConnected = true;
        }
        else console.log('You are already connected.');
    }
    public.getSocket = function(){
        return socket;    
    }
    public.getScene = function(){
        return scene;   
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
    setupGame();
    engine.runRenderLoop(render);

    var socket = new Socket(public);
    var modelSelector = new ModelSelector(public, socket);
    return public;
 }
 
   





