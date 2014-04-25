function ClickButton (obj) {
	this.object = new PIXI.Sprite(PIXI.TextureCache[obj.asset]);

	this.init = function () {
		this.object.position.x = Sugar.isNumber(obj.x) ? obj.x : 0;
		this.object.position.y = Sugar.isNumber(obj.y) ? obj.y : 0;
		this.object.setInteractive(true);
		this.object.anchor.x = 0.5;
		this.object.anchor.y = 0.5;
		Game.PIXI.Stage.addChild(this.object);

		this.setZ(Sugar.isNumber(obj.z) ? obj.z : Game.Utils.zLayers.GUI);
	};

	this.object.mouseover = function () {
		this.scale.x = 1.05;
		this.scale.y = 1.05;
	};

	this.object.mouseout = function () {
		this.scale.x = 1;
		this.scale.y = 1;
	};

	this.object.mouseup = function () {
		if (Sugar.isFunction(obj.onMouseUp)) {
			obj.onMouseUp(this);
		}
	};

	this.object.mousedown = function () {
		if (Sugar.isFunction(obj.onMouseDown)) {
			obj.onMouseDown(this);
		}
	};

	this.update = function () {
	};

	this.destroy = function () {
		Game.PIXI.Stage.removeChild(this.object);
	};
}

ClickButton.prototype = new Game.Object();
ClickButton.prototype.constructor = ClickButton;