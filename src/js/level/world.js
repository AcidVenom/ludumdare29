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

    Game.PIXI.Camera.addChild(this);
}