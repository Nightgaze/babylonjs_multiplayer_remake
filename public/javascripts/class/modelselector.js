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
    for (var i=0; i<game.getModels().length; i++)               
        this.models.push(game.getModels()[i].name);
    for (var i=0; i<game.getMaterials().length; i++)
        this.materials.push(game.getMaterials()[i].name);

    //GUI 
    var gui = new dat.GUI();
    var transform = gui.addFolder('transform');
    this.scalingX = 1;
    this.scalingY = 1;
    this.scalingZ = 1;
    this.rotationX = 0.1;
    this.rotationY = 0.1;
    this.rotationZ = 0.1;
    this.wireframeMode = false;

    gui.add(this, 'activeModel', this.models);
    var activeMaterial = gui.add(this, 'activeMaterial', this.materials)
    var scaleX = transform.add(this, 'scalingX', 0.1, 100).listen();
    var scaleY = transform.add(this, 'scalingY', 0.1, 100).listen();
    var scaleZ = transform.add(this, 'scalingZ', 0.1, 100).listen();
    var rotX = transform.add(this, 'rotationX', -Math.PI*2, Math.PI*2).listen();
    var rotY = transform.add(this, 'rotationY', -Math.PI*2, Math.PI*2).listen();
    var rotZ = transform.add(this, 'rotationZ', -Math.PI*2, Math.PI*2).listen();
    //gui.add(this, 'delete');
    var wireframeMode = gui.add(this, 'wireframeMode');

    activeMaterial.onChange(function(value){
       if (THIS.active3D)
           THIS.active3D.material = scene.getMaterialByName(value); 

    });

    wireframeMode.onChange(function(value){
       game.getScene().forceWireframe = value; 
    });
    
    //set socket events related to db actualization:
    socket.on('get rev', function(data){
        THIS.active3D._rev = data._rev;
    });


    var UpdateDB = function(){
        if (THIS.active3D != null)
        {   
            //socket.emit('request rev',{_id: THIS.active3D._id});
            
            var data = new UpdateModelData(THIS, {pickedPoint: {
                                                            x: THIS.active3D.position.x,
                                                            y: THIS.active3D.position.y,
                                                            z: THIS.active3D.position.z
                                                         }
            });
            socket.emit('update props', data);
        }    
    }
    
    scaleX.onChange(function(value){
        UpdateDB();    
    });

    scaleY.onChange(function(value){
        UpdateDB();    
    });

    scaleZ.onChange(function(value){
        UpdateDB();    
    });

    rotX.onChange(function(value){
        UpdateDB();    
    });

    rotY.onChange(function(value){
        UpdateDB();    
    });

    rotZ.onChange(function(value){
        UpdateDB();    
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
            var data = new ModelData(THIS, pickInfo);
            socket.emit('update props', data);

            


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
            startingPoint = null;
            UpdateDB();
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





function ModelData(modelSelector, pickInfo)
{
    var THIS = this;
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