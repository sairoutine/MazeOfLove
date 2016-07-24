'use strict';

var BulletObject = function(game, x, y, r, theta) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.r = r;
	this.theta = theta;
};
BulletObject.prototype.run = function() {
	this.x += this.calc_moveX();
	this.y += this.calc_moveY();
};
BulletObject.prototype.updateDisplay = function() {
	this.game.surface.save();
	this.game.surface.drawImage(this.image(),
		// スプライトの取得位置
		this.spriteWidth()  * this.spriteX(), this.spriteHeight() * this.spriteY(),
		// スプライトのサイズ
		this.spriteWidth(), this.spriteHeight(),
		// オブジェクトのゲーム上の位置
		this.rx(), this.ry(),
		// オブジェクトのゲーム上のサイズ
		this.spriteWidth(), this.spriteHeight()
	);

	this.game.surface.restore();
};
BulletObject.prototype.image = function() {
	return this.game.images.bullet;
};

// 実x座標
BulletObject.prototype.rx = function () {
	return(this.x - this.spriteWidth());
};
// 実y座標
BulletObject.prototype.ry = function () {
	return(this.y - this.spriteHeight());

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
// θ -> ラジアンに変換
BulletObject.prototype._theta_to_radian = function(theta){
	var radian = theta / 180 * Math.PI;
	return radian;
};

// ラジアン -> θ に変換
BulletObject.prototype._radian_to_theta = function(radian) {
	return (radian * 180 / Math.PI) | 0;
};

// X軸の移動を計算
BulletObject.prototype.calc_moveX = function() {
	var move_x = this.r * Math.cos(this._theta_to_radian(this.theta));
	return move_x;
};

// Y軸の移動を計算
BulletObject.prototype.calc_moveY = function() {
	var move_y = this.r * Math.sin(this._theta_to_radian(this.theta));
	return move_y;
} ;
module.exports = BulletObject;
