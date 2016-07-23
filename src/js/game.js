'use strict';
var StageScene   = require('./scene/stage');

var Game = function(canvas) {
	this.surface = canvas.getContext('2d');
	this.width = Number(canvas.getAttribute('width'));
	this.height = Number(canvas.getAttribute('height'));

	this.scene = new StageScene(this);

	this.images = {};

	this.loadedImageNum = 0;
	this.is_load_done = false;

	this.frame_count = 0;
};
Game.prototype.IMAGES = {
	enemy:     'img/enemy.png',
	bullet:    'img/bullet.png',
};
Game.prototype.init = function() {
	var self = this;

	var onload_function = function() {
		// 画像が読み込まれたら読み込んだ数を+1
		self.loadedImageNum++;

		// 全素材数
		var material_num = Object.keys(self.IMAGES).length;
		// 読み込んだ素材数
		var loaded_material_num = self.loadedImageNum;

		// 素材を全て読み込んだら
		if(loaded_material_num >= material_num) {
			self.is_load_done = true;
		}
	};

	for(var key in self.IMAGES) {
		self.images[key] = new Image();
		self.images[key].src = self.IMAGES[key] ;
		self.images[key].onload = onload_function;
	}
};
Game.prototype.run = function() {
	// 次の描画タイミングで再呼び出ししてループ
	requestAnimationFrame(this.run.bind(this));

	// 素材が読み込み済になるまで待機
	if(!this.is_load_done) return;

	// シーン更新
	this.scene.run();
	this.scene.updateDisplay();

	// 経過フレーム数更新
	this.frame_count++;
};

module.exports = Game;
