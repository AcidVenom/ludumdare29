var CameraController = {
	__camera: Game.PIXI.Camera,
	shake: function (magnitude, duration, count, angle) {
		var _count = 0;

		var tween = function () {
			TweenLite.to(
				CameraController.__camera.position,
				duration,
				{	
					x: Math.random()*magnitude,
					y: Math.random()*magnitude,
					onComplete: function () {
						if (++_count !== count) {
							tween();
						} else {
							CameraController.reset(true, duration);
						}
					}
				}
			);
		};
		tween();
	},
	reset: function (tween, duration) {
		if(tween)
		{
			TweenLite.to(
				CameraController.__camera.position,
				duration*2,
				{
					x: 0,
					y: 0
				}
			);
			return;
		}
		this.__camera.position.x = 0;
		this.__camera.position.y = 0;
	}
};