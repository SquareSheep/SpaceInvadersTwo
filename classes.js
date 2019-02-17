c = {
	"width":350,
	"height":350,
}
let cam = {
	"x":0,
	"y":0,
	"behave":function() {
	}
}
function setEffs() {
	eff[0] = particle;
}
let particle = {
	"ar":[],
	"arm":0,
	"rend":(q) => ctx.fillRect(Math.floor(q.x - q.w), 
	Math.floor(q.y - q.w), Math.ceil(q.w * 2), Math.ceil(q.w * 2)),
	"spawn":function({x,y,w = 2, vx = 0, vy = 0, lifeSpan = 10 + Math.floor(Math.random() * 10), vw = rand(), 
	rend = this.rend}) {
		if (this.ar[this.arm] == null) this.ar[this.arm] = {};
		this.ar[this.arm].x = x;
		this.ar[this.arm].y = y;
		this.ar[this.arm].w = w;
		this.ar[this.arm].vx = vx;
		this.ar[this.arm].vy = vy;
		this.ar[this.arm].lifeSpan = lifeSpan;
		this.ar[this.arm].vw = vw;
		this.ar[this.arm].rend = rend;
		this.arm ++;
	},
	"render":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].rend(this.ar[k]);
		}
	},
	"update":function() {
		for (k = 0 ; k < this.arm ; k ++) {
			this.ar[k].x += this.ar[k].vx;
			this.ar[k].y += this.ar[k].vy;
			this.ar[k].w += this.ar[k].vw;
			this.ar[k].lifeSpan --;
			if (this.ar[k].lifeSpan <= 0) {
				remove(this, k);
				k --;
			}
		}
	}
}
class Text {
	constructor(text, x, y, lifeSpan = 30, vy = -1) {
		this.x = x * f.width / cw;
		this.y = y * f.height / ch;
		this.text = text;
		this.lifeSpan = 30;
		this.vy = vy;
	}
	render() {
		fore.fillText(this.text, this.x, this.y);
	}
	update() {
		this.lifeSpan --;
		this.y += this.vy;
	}
}
class ImageEff {
	constructor(image, x, y, w, vx = 0, vy = 0,lifeSpan = Math.floor(Math.random() * 10) + 5) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.vx = vx;
		this.vy = vy;
		this.image = image;
		this.lifeSpan = lifeSpan;
		this.maxLife = lifeSpan;
	}
	render() {
		ctx.drawImage(this.image[this.image.length - 1 - Math.floor(this.lifeSpan / this.maxLife * this.image.length)], this.x - this.w, this.y - this.w, this.w * 2, this.w * 2);
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.lifeSpan --;
	}
}
class SmallUFODeath extends ImageEff {
	constructor(q) {
		super(SmallUFODeathImage, q.x, q.y, q.w, q.vx * q.dir, -q.vy,Math.floor(Math.random() * 25) + 17);
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.vy += 0.1;
		this.lifeSpan --;
		if (Math.random() > 0.5) particle.spawn({x:this.x, y:this.y,vw:Math.random() * 0.05,w:Math.random(),vx:this.vx + rand() * 3,vy:this.vy + rand() * 3});
	}
}
class Building {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 8;
		this.h = 8;
		this.image = BuildingImage[Math.floor(Math.random() * BuildingImage.length)];
	}
}
class Tower extends Building {
	constructor(x, y) {
		super(x, y);
		this.currCD = 0;
		this.CD = 25;
		tower[tower.length] = this;
	}
}
class SmallUFO {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 8;
		this.HP = 1;
		this.Y = 100 + rand() * 50;
		this.vx = 1;
		this.vy = 1.5;
		this.dir = 1;
		this.currCD = 120;
		this.score = 10;
		this.tick = Math.floor(Math.random() * 5);
		this.CD = 120;
		if (Math.random() > 0.5) this.dir = -1;
	}
	render() {
		ctx.drawImage(SmallUFOImage[Math.floor(frames / 10) % SmallUFOImage.length], this.x - this.w, this.y - this.w, this.w * 2, this.w * 2);
	}
	update() {
		if (this.y < this.Y) this.y += this.vy;
		this.x += this.vx * this.dir;
		if (this.x > cw - this.w) this.dir = -1;
		if (this.x < this.w) this.dir = 1;
		if ((frames + this.tick) % 60 == 0 && Math.random() > 0.6) this.dir *= -1;
		if (this.currCD > 0) {
			this.currCD --;
		} else {
			this.currCD = this.CD;
			ship[ship.length] = new Bomb(this.x, this.y);
		}
	}
	hurt(q) {
		ang = Math.atan2(this.y - q.y, this.x - q.x);
		this.vx += Math.cos(ang) * q.speed / 5;
		this.vy -= Math.sin(ang) * q.speed / 5;
	}
	death() {
		eff2[eff2.length] = new SmallUFODeath(this);
	}
}
class Bomb {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 4;
		this.HP = 1;
		this.vy = 0.5;
		this.ay = 0.02;
		this.score = 5;
	}
	render() {
		ctx.drawImage(BulletImage[Math.floor(frames / 10) % BulletImage.length], this.x - this.w, this.y - this.w, this.w * 2, this.w * 2);
	}
	update() {
		this.y += this.vy;
		this.vy += this.ay;
	}
	hurt(q) {
		
	}
	death() {
		eff2[eff2.length] = new ImageEff(ExplosionImage, this.x, this.y, this.w, this.vx * this.dir, -this.vy);
	}
}
class Bullet {
	constructor(x, y, X, Y) {
		this.x = x;
		this.y = y;
		this.w = 5;
		this.angle = Math.atan2(Y - y, X - x);
		this.speed = 7;
		this.vx = Math.cos(this.angle) * this.speed;
		this.vy = Math.sin(this.angle) * this.speed;
		this.lifeSpan = Math.floor(Math.sqrt(findDist(x, y, X, Y)) / this.speed);
		this.tick = Math.floor(Math.random() * 35);
		this.r = 25;
	}
}