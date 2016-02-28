var PlayerData = function(name, position, tranSpeed, canFly, flySpeed, rotSpeed, model){
    this.name = name;
    this.model = model
    this.position = position;
    this.tranSpeed = tranSpeed;
    this.flySpeed = flySpeed;
    this.rotSpeed = rotSpeed;
    this.canFly = canFly;
    this.isFlying = true;
    
}
try {
module.exports = PlayerData;
}catch(ex){}