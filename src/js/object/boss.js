'use strict';

var BossObject = function(scene, game) {
	this.scene = scene;
	this.game  = game;

	this.frame_count = 0;
};

BossObject.prototype.image = function() {
	return this.game.images.boss;
};
BossObject.prototype.image_width = function() {
	return this.image().width * 0.1;
};
BossObject.prototype.image_height = function() {
	return this.image().height * 0.1;
};

BossObject.prototype.shot = function() {
	this.scene.bulletmanager.create();
};

BossObject.prototype.run = function() {
	// TODO: 弾を打つ間隔で if
	this.shot();
};

BossObject.prototype.updateDisplay = function() {
	var coord = this.get_coordinate_of_center();

	this.game.surface.save();
	this.game.surface.drawImage(this.image(), coord.width, coord.height, this.image_width(), this.image_height());
	this.game.surface.restore();
};

// Canvas の中心に位置できるよう座標を取得
BossObject.prototype.get_coordinate_of_center = function () {
	var width  = (this.game.width - this.image_width()) / 2;
	var height = (this.game.height - this.image_height()) / 2;
	return {
		width: width,
		height: height,
	};
};
module.exports = BossObject;
