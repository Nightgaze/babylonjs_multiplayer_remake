function Object3D(name, scene, model){
    var mesh, pos,
        public = {};

    if (model)
        mesh = model.clone();
    else model = new BABYLON.Mesh.CreateSphere(name, 20, 20, scene);

 
}