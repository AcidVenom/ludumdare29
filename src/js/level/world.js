var World = function()
{
	var sprite = new PIXI.Sprite(PIXI.TextureCache[Utils.Assets.Images + 'level/sprWorld.png']),
        container = new PIXI.DisplayObjectContainer();

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

    this.background.scale.x = 1.4;
    this.background.scale.y = 1.4;

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
    this.clouds.pivot.y = 0.5

    Game.PIXI.Camera.addChild(this.background);
    Game.PIXI.Camera.addChild(this.ground);
    Game.PIXI.Camera.addChild(this.mountains);
    Game.PIXI.Camera.addChild(this.treeLine2);
    Game.PIXI.Camera.addChild(this.treeLine1);
    Game.PIXI.Camera.addChild(this);
    
}