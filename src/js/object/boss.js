/* global dat */
'use strict';

var BossObject = function(scene, game) {
	this.scene = scene;
	this.game  = game;

	this.frame_count = 0;
	this.shot_theta = 90;

	this.add_shot_theta = 15;

	this.maru_shot_theta = 0;

	this.create_gui();
};
BossObject.prototype.create_gui = function() {
	var self = this;
	var gui = new dat.GUI();
	//gui.add(self, 'r', 0, 10);
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

BossObject.prototype.uzumaki_shot = function() {
	var x  = this.game.width / 2;
	var y = this.game.height / 2;
	var theta = this.shot_theta;
	var r = 1;

	this.scene.bulletmanager.create(x, y, r, theta, 9, 4);
};
BossObject.prototype.maru_shot = function(speed) {
	var x  = this.game.width / 2;
	var y = this.game.height / 2;
	var theta = this.maru_shot_theta;
	var r = speed;

	this.scene.bulletmanager.create(x, y, r, theta, 7, 3);
};

BossObject.prototype.run = function() {
	// 渦巻き弾
	if(this.frame_count % 25 === 0) {
		this.shot_theta += this.add_shot_theta;
		this.maru_shot_theta += this.add_shot_theta;
	}
	for (var i=0; i<2; i++) {
		this.uzumaki_shot();
		this.shot_theta += 3;
	}

	// 円形弾
	if(this.frame_count % 50 === 0) {
		for (i=0; i<18; i++) {
			this.maru_shot(2);
			this.maru_shot(2.5);
			this.maru_shot(3);
			this.maru_shot_theta += this.add_shot_theta;
		}
	}

	this.frame_count++;
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
