function Player(game, position)
{
    var THIS = this;
    Object3D.call(this, game, position, false);
    
    this.health = 100;
    this.mana = 100;
    this.maxHealth = 100;
    this.maxMana = 100;
    this.healthReg = 1500;
    this.manaReg = 2000;
    this.isFlying = true;
    this.canFly = false;
    var tranSpeed = 5;
    var flySpeed = 1.2;
    var rotSpeed = 0.02;
    
    var scene = game.getScene();
    var canvas = game.getCanvas();
    var camera = new BABYLON.FreeCamera("FreeCamera", THIS.position, scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    var keyboard = new Keyboard(this, game);
    
    this.root = new BABYLON.Mesh.CreateSphere("root", 1, 3, scene, true); 
    this.root.position = this.position;
    this.root.rotation = this.rotation;
    
    var FIREBALLCOST = 5;
    var FIREBALLDAMAGE = 5;
    this.spells = {};
    this.spells['Fireball'] = new SPELLS.Fireball(game, this, FIREBALLCOST, FIREBALLDAMAGE);

    
    //Regeneration
    setInterval(function(){
        if (THIS.health < THIS.maxHealth)
            THIS.health+=1;
    }, THIS.manaReg);
    
    setInterval(function(){
        if (THIS.health < THIS.maxHealth)
            THIS.health+=1;
    }, THIS.healthReg);
    
    this.changeCam = function(cam)
    {
            var target;
            switch (cam)
            {
                case 'freeCam':
                    target = camera.getTarget();
                    camera.dispose();
                    camera = new BABYLON.FreeCamera("FreeCamera", THIS.position, scene);
                    camera.setTarget(target);
                    var tmp = THIS.root.calcMovePOV(0, 0, -1);
                    var camPos = new BABYLON.Vector3(position.x * tmp.x, THIS.position.y + 10 * tmp.y, position.z*tmp.z )
                    camera.position = camPos;
                    camera.attachControl(canvas, false);
                    scene.activeCamera = camera;
                    console.log('Camera: FreeCamera');
                    camera.parent = THIS.root;
                    break;

                case 'arcRotate':
                    target = camera.getTarget();
                    camera.dispose();
                    camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 0.8, new BABYLON.Vector3(0, 0, 0), scene);
                    
                    //camera = new BABYLON.ArcFollowCamera("ArcRotateCamera", 1, 0.8, 10, root, scene);
                    //camera.inertialAlphaOffset = 20;
                
                    //var temp = new BABYLON.Vector3(0, 2, 0);
                    //camera.setTarget(target);
                    camera.attachControl(canvas, false);
                    scene.activeCamera = camera;
                    console.log('Camera: ArcRotateCamera');
                    camera.parent = THIS.root;
                    camera.angularSensibilityY = 500;
                    camera.targetScreenOffset = new BABYLON.Vector2(0, -30);
                    camera.radius = 120;
                    
                   
                    break;

                case 'followCam':
                    camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
                    //camera.target = ground; 
                    scene.activeCamera = camera;
                    break;

                case 'anaglyphFree':
                    target = camera.getTarget();
                    camera.dispose();
                    camera = new BABYLON.AnaglyphFreeCamera("AnaglyphFreeCam", new BABYLON.Vector3(0, 15, -45), 20, scene);
                    camera.setTarget(target);
                    scene.activeCamera = camera;
                    console.log('Camera: AnaglyphFreeCamera');
                    camera.parent = root;
                    break;

                case 'touchCam':
                    target = camera.getTarget();
                    camera.dispose();
                    camera = new BABYLON.TouchCamera("TouchCamera", new BABYLON.Vector3(0, 1, -15), scene);
                    camera.setTarget(target);
                    scene.activeCamera = camera;
                    console.log('Camera: TouchCamera');
                    camera.parent = THIS.root;
                    break;

                case 'deviceOrientationCam':
                    target = camera.getTarget();
                    camera.dispose();
                    camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 1, -15), scene);
                    camera.moveSensibility = 90;
                    camera.setTarget(target);
                    scene.activeCamera = camera;
                    console.log('Camera: DeviceOrientationCamera');
                    camera.parent = THIS.root;
                    break;
            }
        
            //update gameObject parameters(necessary for post process);
            game.setCamera(camera);
        

    }
    
    
    
    //Internal:
    this.forwardP = function(){
        var speed;
        if (THIS.isFlying) speed = flySpeed * (Math.abs(camera.beta - 3.14) * 3);
            else speed = tranSpeed;
        res = THIS.mesh.calcMovePOV(0, 0, 1);
        THIS.position.x += res.x * speed * scene.getAnimationRatio();
        THIS.position.y += res.y * speed * scene.getAnimationRatio();
        THIS.position.z += res.z * speed * scene.getAnimationRatio();

    }

    this.forwardN = function(){
        var speed;
        if (THIS.isFlying) speed = flySpeed * camera.beta;
            else speed = tranSpeed;
        res = THIS.mesh.calcMovePOV(0, 0, -1);
        THIS.position.x += res.x * speed * scene.getAnimationRatio();
        THIS.position.y += res.y * speed * scene.getAnimationRatio();
        THIS.position.z += res.z * speed * scene.getAnimationRatio();

    }
    
    
    this.takeDamage = function(damage)
    {
        if (THIS.health >= damage)
            {
            THIS.health-=damage;
            /*if (THIS.nickname == nickname)
                {
                //THIS.updateStatusGUI(); 
                //$(".damageMessage").fadeIn().fadeOut();
                //$(document.body).append("<div class='damageMessage'>" + damage + "</div>");
                }*/
            }
        else 
            {
            THIS.die();
            /*if (THIS.nickname == nickname)
                //$("#healthBar").html(0 + '/' + THIS.maxHealth);
                 //$(document.body).append("<div class='damageMessage'>" + damage + "</div>");*/
            }

    }
    
    
    //rotation:
    function rotationCheck()
    {
        
        var tmp = camera.alpha;
        var tmp2 = camera.beta;
        
        //X:
        if (tmp2 > 1.36) tmp2 = 1.36;
        if (tmp2 < 1.11) tmp2 = 1.11;
        var rot1 = THIS.mesh.calcRotatePOV(0, -1, 0);
        THIS.mesh.rotation.y = rot1.y * tmp ;
        //
        
        if (THIS.isFlying)
        {
            
            //Y si Z:
            var rot2 = THIS.mesh.calcRotatePOV(1, 0, 0);
            THIS.mesh.rotation.x = rot2.x * tmp2 * 5;
            var rot3 = THIS.mesh.calcRotatePOV(0, 0, -1);
            //THIS.mesh.rotation.z = rot3.z * tmp * 5;
            
        }
        
        else
        {
            //Y si Z:
            if (tmp2 > 1.36) tmp2 = 1.20;
            if (tmp2 < 1.11) tmp2 = 1.11;
            var rot2 = THIS.mesh.calcRotatePOV(1, 0, 0)
            THIS.mesh.rotation.x = rot2.x * tmp2 * 5;
            //
        }
    }
    
    scene.registerBeforeRender(rotationCheck);
    
    this.Space = function(){
        if (!THIS.isFlying) 
        {
            THIS.isFlying = true;
            //scene.registerBeforeRender(THIS.ascension);
            THIS.position.y += 20;
            console.log('started flying ' + THIS.isFlying);
        }
        else (console.log('cannot start flying ' + THIS.isFlying));
        
    }
  
    this.clickL = function(){
        ;
        
    }

    
    setTimeout( function(){
        //var x = THIS.models[0].clone();
        THIS.mesh.dispose();
        THIS.mesh = scene.getMeshByName('golem').clone();
        THIS.mesh.name = "player";
        THIS.mesh.position = THIS.position;

    }, 1000);
    
    this.changeCam('arcRotate');
    
    
}

Player.prototype = Object.create(Object3D.prototype);
Player.prototype.constructor = Player;


