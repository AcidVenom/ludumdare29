var CameraController = {
	__camera: Game.PIXI.Camera,
	shake: function (magnitude, duration, count, easing) {
		var ease = easing || Linear.easeInOut,
			_count = 0;

		var tween = function () {
			TweenLite.to(
				CameraController.__camera.position,
				duration,
				{
					x: Math.random() * magnitude,
					y: Math.random() * magnitude,
					onComplete: function () {
						if (++_count !== count) {
							tween();
						} else {
							CameraController.reset(true);
						}
					}
				}
			);
		};
		tween();
	},
	reset: function (tween) {
		if(tween)
		{
			TweenLite.to(
				CameraController.__camera.position,
				0.5,
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