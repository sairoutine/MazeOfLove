'use strict';

var BulletObject = function(game) {
	this.game = game;
};
BulletObject.prototype.run = function() {
};
BulletObject.prototype.updateDisplay = function() {
	this.game.surface.save();
	this.game.surface.drawImage(this.image(),
		// スプライトの取得位置
		this.spriteWidth()  * this.spriteX(), this.spriteHeight() * this.spriteY(),
		// スプライトのサイズ
		this.spriteWidth(), this.spriteHeight(),
		// オブジェクトのゲーム上の位置
		0, 0,
		// オブジェクトのゲーム上のサイズ
		this.spriteWidth(), this.spriteHeight()
	);

	this.game.surface.restore();
};
BulletObject.prototype.image = function() {
	return this.game.images.bullet;
};


BulletObject.prototype.spriteWidth = function () {
	return 16;
};
BulletObject.prototype.spriteHeight = function () {
	return 16;
};
BulletObject.prototype.spriteX = function () {
	return 9;
};
BulletObject.prototype.spriteY = function () {
	return 3;
};


module.exports = BulletObject;
