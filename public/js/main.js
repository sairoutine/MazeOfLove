(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(self.performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(self.performance||Date).now()},end:function(){a++;var c=(self.performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=self.performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);

},{}],2:[function(require,module,exports){
'use strict';
var StageScene   = require('./scene/stage');
var Stats = require('stats.js');

var Game = function(canvas) {
	this.stats = new Stats();
	this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom 

	document.body.appendChild( this.stats.dom );

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
	boss:      'img/enemy.png',
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
	this.stats.begin();

	// 素材が読み込み済になるまで待機
	if(!this.is_load_done) return;

	// シーン更新
	this.scene.run();
	this.scene.updateDisplay();

	// 経過フレーム数更新
	this.frame_count++;
	this.stats.end();
};

module.exports = Game;

},{"./scene/stage":7,"stats.js":1}],3:[function(require,module,exports){
'use strict';
var Game = require('./game');

window.onload = function() {
	// Canvas
	var mainCanvas = document.getElementById('mainCanvas');

	var game = new Game(mainCanvas);
	game.init();
	game.run();
};

},{"./game":2}],4:[function(require,module,exports){
'use strict';
var BulletObject = require('../object/bullet');

var Manager = function(scene, game) {
	this.game = game;
	this.scene = scene;
	this.objects = [];
};
Manager.prototype.run = function() {
	for(var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].run();
	}

	this.removeOutOfStageObjects();
};
Manager.prototype.updateDisplay = function() {
	for(var i = 0, len = this.objects.length; i < len; i++) {
		this.objects[i].updateDisplay();
	}
};
Manager.prototype.create = function(x, y, r, theta, sprite_x, sprite_y) {
	this.objects.push(new BulletObject(this.game, x, y, r, theta, sprite_x, sprite_y));
};
Manager.prototype.remove = function(i) {
	this.objects.splice(i, 1);

};
Manager.prototype.removeOutOfStageObjects = function() {
	for(var i = 0; i < this.objects.length; i++) {
		if(this.scene.isOutOfStage(this.objects[i])) {
			this.remove(i);
		}
	}
};


module.exports = Manager;

},{"../object/bullet":6}],5:[function(require,module,exports){
/* global dat */
'use strict';

var BossObject = function(scene, game) {
	this.scene = scene;
	this.game  = game;

	this.frame_count = 0;
	this.shot_theta = 90;


	this.maru_shot_theta = 0;

	this.add_shot_theta = 15;
	this.uzumaki_speed = 1;
	this.maru_percount = 50;
	this.uzumaki_percount = 25;
	this.maru_num = 18;

	this.create_gui();
};
BossObject.prototype.create_gui = function() {
	var self = this;
	var gui = new dat.GUI();
	gui.add(self, 'add_shot_theta', 0, 50);
	gui.add(self, 'uzumaki_speed', 0, 10);
	gui.add(self, 'uzumaki_percount', 0, 100).step(1);
	gui.add(self, 'maru_percount', 0, 100).step(1);
	gui.add(self, 'maru_num', 0, 100).step(1);
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
	var r = this.uzumaki_speed;

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
	if(this.frame_count % this.uzumaki_percount === 0) {
		this.shot_theta += this.add_shot_theta;
		this.maru_shot_theta += this.add_shot_theta;
	}
	for (var i=0; i<2; i++) {
		this.uzumaki_shot();
		this.shot_theta += 3;
	}

	// 円形弾
	if(this.frame_count % this.maru_percount === 0) {
		for (i=0; i<this.maru_num; i++) {
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

},{}],6:[function(require,module,exports){
'use strict';

var BulletObject = function(game, x, y, r, theta, sprite_x, sprite_y) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.r = r;
	this.theta = theta;

	this.sprite_x = sprite_x || 0;
	this.sprite_y = sprite_y || 0;
};
BulletObject.prototype.run = function() {
	this.x += this.calc_moveX();
	this.y += this.calc_moveY();
};
BulletObject.prototype.updateDisplay = function() {
	this.game.surface.save();
	this.game.surface.translate(this.x, this.y);
	this.game.surface.rotate(this._theta_to_radian(this.theta + 90));

	this.game.surface.drawImage(this.image(),
		// スプライトの取得位置
		this.spriteWidth()  * this.spriteX(), this.spriteHeight() * this.spriteY(),
		// スプライトのサイズ
		this.spriteWidth(), this.spriteHeight(),
		// オブジェクトのゲーム上の位置(translateした原点から)
		-this.spriteWidth()/2, -this.spriteHeight()/2,
		// オブジェクトのゲーム上のサイズ
		this.imageWidth(), this.imageHeight()
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
BulletObject.prototype.imageWidth = function () {
	return 12;
};
BulletObject.prototype.imageHeight = function () {
	return 12;
};

BulletObject.prototype.spriteWidth = function () {
	return 16;
};
BulletObject.prototype.spriteHeight = function () {
	return 16;
};
BulletObject.prototype.spriteX = function () {
	return this.sprite_x;
};
BulletObject.prototype.spriteY = function () {
	return this.sprite_y;
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

},{}],7:[function(require,module,exports){
'use strict';
var Boss = require('../object/boss');
var BulletManager = require('../manager/bullet');

var Scene = function(game) {
	this.game = game;

	this.boss = new Boss(this, game);
	this.bulletmanager = new BulletManager(this, game);
};
Scene.prototype.EXTRA_OUT_OF_STAGE_SIZE = 100;

Scene.prototype.run = function() {
	this.boss.run();
	this.bulletmanager.run();
};
Scene.prototype.updateDisplay = function() {
	this._showBackground();

	this.boss.updateDisplay();
	this.bulletmanager.updateDisplay();
};
Scene.prototype._showBackground = function() {
	this.game.surface.save();
	this.game.surface.fillStyle = "rgb(0, 0, 0)";
	this.game.surface.fillRect(0, 0, this.game.width, this.game.height);
	this.game.surface.restore();
};

Scene.prototype.isOutOfStage = function(object) {
	var x = object.x;
	var y = object.y;

	if(x + this.EXTRA_OUT_OF_STAGE_SIZE < 0 ||
	   y + this.EXTRA_OUT_OF_STAGE_SIZE < 0 ||
	   x > this.game.width  + this.EXTRA_OUT_OF_STAGE_SIZE ||
	   y > this.game.height + this.EXTRA_OUT_OF_STAGE_SIZE
	  ) {
		return true;
	}

	return false;
};

module.exports = Scene;

},{"../manager/bullet":4,"../object/boss":5}]},{},[3]);
