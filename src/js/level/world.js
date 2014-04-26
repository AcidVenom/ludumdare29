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

    this.position.x = Game.PIXI.Renderer.width / 2;
    this.position.y = Game.PIXI.Renderer.height / 2;

    Game.PIXI.Camera.addChild(this);
}