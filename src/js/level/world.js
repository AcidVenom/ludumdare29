var ImpactArea = function(angle,range,damage,world)
{
    this.range = range;
    this.frame = 0;
    this.world = world;
    this.damage = damage;

    this.x = Math.cos(angle*Math.PI/180)*StateManager.getState().player.collisionPoint;
    this.y = Math.sin(angle*Math.PI/180)*StateManager.getState().player.collisionPoint;

    this.update = function()
    {
        if(++this.frame == 2)
        {
            this.world.impactAreas.splice(this.world.impactAreas.indexOf(this),1);
        }
    }
}

var World = function()
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprWorld.png']);
    
    this.lava = new PIXI.DisplayObjectContainer();
    this.lava.__z = 500;

    this.lavaLayer1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprLava1.png']);
    this.lavaLayer2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprLava2.png']);
    this.lavaLayer3 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprLava3.png']);

    this.lavaLayer1.anchor.x = 0.5;
    this.lavaLayer2.anchor.x = 0.5;
    this.lavaLayer3.anchor.x = 0.5;

    this.lavaLayer1.anchor.y = 0.5;
    this.lavaLayer2.anchor.y = 0.5;
    this.lavaLayer3.anchor.y = 0.5;

    this.lavaLayer1.pivot.x = 0.5;
    this.lavaLayer2.pivot.x = 0.5;
    this.lavaLayer3.pivot.x = 0.5;

    this.lavaLayer1.pivot.y = 0.5;
    this.lavaLayer2.pivot.y = 0.5;
    this.lavaLayer3.pivot.y = 0.5;

    this.lavaLayer1.__z = 402;
    this.lavaLayer2.__z = 401;
    this.lavaLayer3.__z = 400;

    this.lava.addChild(this.lavaLayer3);
    this.lava.addChild(this.lavaLayer2);
    this.lava.addChild(this.lavaLayer1);
    

    this.lava.position.y -= 6;
    this.lava.position.x -= 1;

    this.flares = [];

    extend(this, sprite);
    extend(this, GameObject);

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.pivot.x = 0.5;
    this.pivot.y = 0.5;

    this.position.x = 0;
    this.position.y = 0;

    this.background = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/bgLevel.png']);
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;

    this.background.pivot.x = 0.5;
    this.background.pivot.y = 0.5;

    this.background.scale.x = 2;
    this.background.scale.y = 2;

    this.ground = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprGround.png']);
    this.ground.anchor.x = 0.5;
    this.ground.anchor.y = 0.5;

    this.ground.pivot.x = 0.5;
    this.ground.pivot.y = 0.5;

    this.mountains = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/bgMountains.png']);
    this.mountains.anchor.x = 0.5;
    this.mountains.anchor.y = 0.5;

    this.mountains.pivot.x = 0.5;
    this.mountains.pivot.y = 0.5;

    this.treeLine1 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/bgTreeLine1.png']);
    this.treeLine1.anchor.x = 0.5;
    this.treeLine1.anchor.y = 0.5;

    this.treeLine1.pivot.x = 0.5;
    this.treeLine1.pivot.y = 0.5;

    this.treeLine2 = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/bgTreeLine2.png']);
    this.treeLine2.anchor.x = 0.5;
    this.treeLine2.anchor.y = 0.5;

    this.treeLine2.pivot.x = 0.5;
    this.treeLine2.pivot.y = 0.5;

    this.clouds = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/fgClouds.png']);
    this.clouds.anchor.x = 0.5;
    this.clouds.anchor.y = 0.5;

    this.clouds.pivot.x = 0.5;
    this.clouds.pivot.y = 0.5;

    this.wave = 0;
    this.spawning = false;

    this.createImpact = function(angle,range,damage)
    {
        var impact = new ImpactArea(angle,range,damage,this);
        this.impactAreas.push(impact);
    }

    this.spawnMiners = function()
    {
        for (var i = 0; i < 3; ++i) {
            StateManager.getState().miners.push(new Miner(Math.random() * 360, this, StateManager.getState().hotspotMiners));
            StateManager.getState().miners[StateManager.getState().miners.length-1].alpha = 0;
        }
    }

    this.spawnEnemies = function()
    {
        for(var i = 0; i < 1+Math.floor(this.wave*0.05*this.wave*0.75); ++i)
        {
            StateManager.getState().enemies.push(new Enemy(Math.random()*360,this, Math.random()*100 < 5 ? "big" : "small"));
            StateManager.getState().enemies[StateManager.getState().enemies.length-1].alpha = 0;
        }
    }

    this.update = function()
    {
        this.lavaLayer1.rotation += 0.01;
        this.lavaLayer2.rotation -= 0.01;
        this.lavaLayer3.rotation += 0.005;

        for(var i = 0; i < this.impactAreas.length; ++i)
        {
            this.impactAreas[i].update();
        }

        if (StateManager.getState().enemies.length == 0 && this.spawning == false)
        {
            var self = this;
            this.spawning = true;
            setTimeout(function()
            {
                self.wave++;
                self.spawnEnemies();

                if(self.wave % 3 == 0)
                {
                    self.spawnMiners();
                }

                for (var i = 0; i < StateManager.getState().miners.length; ++i) {
                    var miner = StateManager.getState().miners[i];

                    if(miner.health.__health + 20 > 100)
                    {
                        miner.health.__health = 100;
                    }
                    else
                    {
                        miner.health.__health += 20;
                    }
                    miner.health.updateHealthbar();
                }
                self.spawning = false;
            },1000);
        }
    }

    this.impactAreas = [];

    this.background.__z = 0;
    this.mountains.__z = 1;
    this.treeLine2.__z = 2;
    this.ground.__z = 3;
    this.treeLine1.__z = 4;
    this.clouds.__z = 999;
    this.timeScale = 1;

    this.__z = 5;

    Game.PIXI.Camera.addChild(this.background);
    
    Game.PIXI.Camera.addChild(this.mountains);
    Game.PIXI.Camera.addChild(this.treeLine2);
    Game.PIXI.Camera.addChild(this.ground);
    Game.PIXI.Camera.addChild(this.treeLine1);
    Game.PIXI.Camera.addChild(this.clouds);
    Game.PIXI.Camera.addChild(this);
    Game.PIXI.Camera.addChild(this.lava);

    this.flares = [];

    for(var i = 0; i < 11; ++i)
    {
        var flare = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprFlare' + String(i+1) + '.png']);
        this.flares.push(flare);
        flare.__z = 10000;
        
        flare.pivot.x = 0.5;
        flare.pivot.y = 0.5;

        flare.anchor.x = 0.5;
        flare.anchor.y = 0.5;
        

        flare.rotation -= Math.PI/2;
        flare.position.x -= 300;
        flare.position.y += 300;

        Game.PIXI.Camera.addChild(flare);
    }

    this.flares[0].position.x += 800;
    this.flares[0].position.y -= 800;
    this.flares[0].scale.x = 1.3;
    this.flares[0].scale.y = 1.3;

    this.flares[1].position.x += 870;
    this.flares[1].position.y -= 870;
    this.flares[1].scale.x = 1.5;
    this.flares[1].scale.y = 1.5;
    this.flares[1].anchor.x = 0.7;
    this.flares[1].anchor.y = 0.75;
    this.flares[1].pivot.x = 0.7;
    this.flares[1].pivot.y = 0.75;

    for(var i = 2; i < 11; ++i)
    {
        this.flares[i].position.x += 300+i*50;
        this.flares[i].position.y -= 300+i*50;
    }

    this.setFlareAlpha = function(alpha)
    {
        for(var i = 0; i < 11; ++i)
        {
            this.flares[i].alpha = alpha;
        }
    }

    this.spawnEnemies();
    this.spawnMiners();
}