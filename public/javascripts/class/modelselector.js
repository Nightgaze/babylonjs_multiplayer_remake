function ModelSelector(game, socket)
{
    
    var THIS = this;
    this.active3D = null;
    this.activeModel = 'sphere';
    this.activeMaterial = 'standard material';
    this.models = [];
    this.materials = [];
    var engine = game.getEngine();
    var scene = game.getScene();
    for (var i=0; i<game.getModels().length; i++) this.models.push(game.getModels()[i].name);
    for (var i=0; i<game.getMaterials().length; i++) this.materials.push(game.getMaterials()[i].name);

    this.scalingX = 1;
    this.scalingY = 1;
    this.scalingZ = 1;
    this.rotationX = 0.1;
    this.rotationY = 0.1;
    this.rotationZ = 0.1;
    this.wireframeMode = false;
    this.Delete = function(){
        if (THIS.active3D) DeleteInDB(THIS);    
    }

    var gui = new dat.GUI();
    gui.add(this, 'activeModel', this.models);
    var activeMaterial = gui.add(this, 'activeMaterial', this.materials)
    gui.add(this, 'Delete');
    var wireframeMode = gui.add(this, 'wireframeMode');
    var transform = gui.addFolder('transform');

    var scaleX = transform.add(this, 'scalingX', 0.1, 100).listen();
    var scaleY = transform.add(this, 'scalingY', 0.1, 100).listen();
    var scaleZ = transform.add(this, 'scalingZ', 0.1, 100).listen();
    var rotX = transform.add(this, 'rotationX', -Math.PI*2, Math.PI*2).listen();
    var rotY = transform.add(this, 'rotationY', -Math.PI*2, Math.PI*2).listen();
    var rotZ = transform.add(this, 'rotationZ', -Math.PI*2, Math.PI*2).listen();
    

    activeMaterial.onChange(function(value){
       if (THIS.active3D) THIS.active3D.material = scene.getMaterialByName(value); 
    });

    wireframeMode.onChange(function(value){
       game.getScene().forceWireframe = value; 
    });
    
    //set socket events related to db actualization:
    /*socket.on('get rev', function(data){
        THIS.active3D._rev = data._rev;
    });*/

    var UpdateGUI = function(){
        for (var i in transform.__controllers)
            transform.__controllers[i].updateDisplay();
        for (var i in gui.__controllers)
            gui.__controllers[i].updateDisplay();
    }

    var UpdateDB = function(){
        if (THIS.active3D != null)
        {   
            //socket.emit('request rev',{_id: THIS.active3D._id});
            var data = new UpdateModelData(THIS, {pickedPoint: {x: THIS.active3D.position.x, y: THIS.active3D.position.y,z: THIS.active3D.position.z}});
            socket.emit('update props', data);
        }    
    }
    var DeleteInDB = function(){
        var data = new DeleteModelData(THIS); 
        socket.emit('remove props', data);   
    }

    var CreateInDB = function(pickInfo){
        var data = new ModelData(THIS, pickInfo);
        socket.emit('create props', data);
    }
    
    scaleX.onFinishChange(function(value){
        UpdateDB();    
    });

    scaleY.onFinishChange(function(value){
        UpdateDB();    
    });

    scaleZ.onFinishChange(function(value){
        UpdateDB();    
    });

    rotX.onFinishChange(function(value){
        UpdateDB();    
    });

    rotY.onFinishChange(function(value){
        UpdateDB();    
    });

    rotZ.onFinishChange(function(value){
        UpdateDB();    
    });

    scaleX.onChange(function(value){
        if (THIS.active3D) THIS.active3D.scaling.x = value;    
    });

    scaleY.onChange(function(value){
        if (THIS.active3D) THIS.active3D.scaling.y = value;    
    });

    scaleZ.onChange(function(value){
        if (THIS.active3D) THIS.active3D.scaling.z = value;    
    });

    rotX.onChange(function(value){
        if (THIS.active3D) THIS.active3D.rotation.x = value;    
    });

    rotY.onChange(function(value){
        if (THIS.active3D) THIS.active3D.rotation.y = value;    
    });

    rotZ.onChange(function(value){
        if (THIS.active3D) THIS.active3D.rotation.z = value;    
    });

    
    
            
 




    //PICKING:
    var canvas = engine.getRenderingCanvas();
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () 
    {
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var onPointerDown = function (evt) 
    {
        if (evt.button !== 0) {
            return;
        }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return true; });
        if (pickInfo.pickedMesh == ground) 
        {
            try {

                THIS.active3D.material.alpha = 1;
                THIS.active3D = null;
            }
            catch(ex){};
            CreateInDB(pickInfo);
        }
        else if (pickInfo.hit) 
        {
            if (THIS.active3D)
            {
                THIS.active3D.material.alpha = 1.0;
            }
             
            currentMesh = pickInfo.pickedMesh;
            THIS.active3D = currentMesh;            
            THIS.active3D.material.alpha = 0.7;
            THIS.scalingX = THIS.active3D.scaling.x;
            THIS.scalingY = THIS.active3D.scaling.y;
            THIS.scalingZ = THIS.active3D.scaling.z;
            THIS.rotationX = THIS.active3D.rotation.x;
            THIS.rotationY = THIS.active3D.rotation.y;
            THIS.rotationZ = THIS.active3D.rotation.z;
            transform.open();
            UpdateGUI();


            startingPoint = getGroundPosition(evt);

            if (startingPoint) 
            {
                setTimeout(function () 
                {
                    scene.activeCamera.detachControl(canvas);
                }, 0);
            }
        }

        

        
    }

    var onPointerUp = function () 
    {
        try {
        } catch(e){ }
        if (startingPoint) {
            scene.activeCamera.attachControl(canvas, true);
             UpdateDB();
            startingPoint = null;
            return;
        }
    }

    var onPointerMove = function (evt) 
    {
        if (!startingPoint) {
            return;
        }

        var current = getGroundPosition(evt);

        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    canvas.addEventListener("mousedown", onPointerDown, false);
    canvas.addEventListener("mouseup", onPointerUp, false);
    canvas.addEventListener("mousemove", onPointerMove, false);
    }



function DeleteModelData(modelSelector)
{
    try 
    {
        this._rev = modelSelector.active3D._rev;
        this._id = modelSelector.active3D._id;
    }
    catch (ex){console.log(ex)}
}

function ModelData(modelSelector, pickInfo)
{
    var THIS = this;
    this.create = true;
    if (modelSelector.active3D != null)
    {
        var model = modelSelector.active3D.name.replace(/[0-9]/g, '');
        this.model = model;
    }
    else if (modelSelector.activeModel)
    {
        this.model = modelSelector.activeModel;
    }
    this.material = modelSelector.activeMaterial;  
      
    if (pickInfo == null) 
    {
        this.position = pickInfo;
        
    }
    else this.position = {
       x: pickInfo.pickedPoint.x,
       y: pickInfo.pickedPoint.y,
       z: pickInfo.pickedPoint.z
    };
    this.rotation = {
        x: modelSelector.rotationX,
        y: modelSelector.rotationY,
        z: modelSelector.rotationZ
    },
    this.scaling = {
        x: modelSelector.scalingX,
        y: modelSelector.scalingY,
        z: modelSelector.scalingZ
        
    }
   
}


function UpdateModelData(modelSelector, pickInfo)
{
    ModelData.call(this, modelSelector, pickInfo);
    this.update = true;
    try 
    {
        this._rev = modelSelector.active3D._rev;
        this._id = modelSelector.active3D._id;
    }
    catch (ex){console.log(ex)}

}

UpdateModelData.prototype = Object.create(ModelData.prototype);
UpdateModelData.constructor = UpdateModelData;