
function Prop(doc, scene) {  
    var THIS = this;
    var public = {};
    var mesh;
    Prop.nr++;

    public.getMesh = function(){return mesh;}
    public.dispose = function(){mesh.dispose(); Prop.nr--; delete THIS;}
    public.create = function(doc)
    {
        if (doc.model)
                mesh = scene.getMeshByName(doc.model).clone();
        if (doc.material)
                mesh.material = scene.getMaterialByName(doc.material).clone();
    }
    public.update = function(doc){
        mesh.name = doc.model + Prop.nr;
        THIS.name = mesh.name;
        
        mesh._rev = doc._rev;
        mesh._id = doc._id;
        public._id = doc._id;
        mesh.position.x = doc.position.x;
        mesh.position.y = doc.position.y;
        mesh.position.z = doc.position.z;
        mesh.scaling.x = doc.scaling.x;
        mesh.scaling.y = doc.scaling.y;
        mesh.scaling.z = doc.scaling.z;
        mesh.rotation.x = doc.rotation.x;
        mesh.rotation.y = doc.rotation.y;
        mesh.rotation.z = doc.rotation.z;

    }

    public.create(doc);
    public.update(doc);
    return public;
}

//static:
Prop.nr = -1;