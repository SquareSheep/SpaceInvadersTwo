let ctx, c, b, back, f, fore, w, h, i, k, j, u, o, m, l, fw, fh, ch, cw;
let temp, temp2, speed, dist, count, ang, angle, ang2, angle2, dist2, speed2, index, index2, go,x, y;
let frames = 0, pausedFrames = 0, pause = 0;
let mouseX = 0, mouseY = 0; let overX = 0, overY = 0;
let keys = [], build = [], tower = [], ship = [], miss = [], eff = [], eff2 = [];
let state = [], menuState = 0, gameState = 1, currState = 0;
let resW = 600, resH = 700;
let devW = window.innerWidth, devH = window.innerHeight;
let scale = Math.max(window.innerWidth / resW, window.innerHeight / resH);
let scores = [], score, combo = 1, currCD = 0,time, CD = 13;
state[menuState] = {
	"render":function() {
	},
	"setUp":function() {
		fore.clearRect(0,0,f.width,f.height);
		ctx.clearRect(0,0,f.width,f.height);
		clear();
		fore.font = "16px Arial";
		fore.fillStyle = "white";
		fore.fillText("SPACE INVADERS TWO", f.width / 2,fh * 0.25, fw * 0.5, fh * 0.1);
		fore.font = "16px Arial";
		fore.fillText("PRESS X TO START", f.width / 2,fh * 0.3, fw * 0.5, fh * 0.1);
		fore.fillText("SCORES:", f.width / 2,fh * 0.55, fw * 0.7, fh * 0.1);
		for (i = scores.length - 1 ; i >= Math.max(scores.length - 5,0) ; i --) {
			fore.fillText(scores[i], fw/2, fh * 0.6 + (scores.length - 1 - i) * 25);
		}
		temp = 0;
		for (i = 0 ; i < scores.length ; i ++) {
			temp = Math.max(scores[i], temp);
		}
		fore.fillText("HIGH SCORE: " + temp, f.width / 2,fh * 0.9, fw * 0.7, fh * 0.1);
		if (scores.length == 0) fore.fillText("NONE", fw/2, fh * 0.6);
	},
	"update":function() {
		if (keys[88]) {
			changeState(gameState);
		}
	}
}
state[gameState] = {
	"render":function() {
		ctx.clearRect(0,0,c.width,c.height);
		fore.clearRect(0,0,f.width,f.height);
		fore.fillText("SCORE: " + score, 50,50);
		fore.fillText("COMBO: " + combo + "x", 50,75);
		if (frames < time) {
			fore.fillText("TIME: " + Math.floor((time - frames)/60), 50,100);
		} else {
			fore.fillText("TIMES UP!", 50,100);
		}
		renderMiss();
		renderEff();
		renderShip();
		renderBuild();
	},
	"setUp":function() {
		fore.clearRect(0,0,f.width, f.height);
		ctx.clearRect(0,0,b.width, b.height);
		clear();
		combo = 1;
		score = 0;
		time = 1800;
		for (i = 0 ; i < 16 ; i ++) {
			if (i % 4 == 2) {
				build[build.length] = new Tower(i * cw / 16 + 8, ch - 8);
			} else {
				build[build.length] = new Building(i * cw / 16 + 8, ch - 8);
			}
		}
	},
	"update":function() {
		if (frames == time) {
			scores[scores.length] = score;
			saveScores();
			ship.length = 0;
		}
		if (frames == time + 90) {
			changeState(menuState);
		}
		if (frames % 60 == 0 && frames < time) ship[ship.length] = new SmallUFO(Math.random() * cw, -50);
		if (keys[69]) changeState(menuState);
		if (currCD == 0 && keys[121]) {
			dist = 10000000;
			o = -1;
			for (i = 0 ; i < tower.length ; i ++) {
				temp = findDist(tower[i].x, tower[i].y, mouseX, mouseY);
				if (tower[i].currCD == 0 && temp < dist) {
					dist = temp;
					o = i;
				}
			}
			if (o != -1) {
				tower[o].currCD = tower[o].CD;
				miss[miss.length] = new Bullet(tower[o].x, tower[o].y, mouseX, mouseY);
				particle.spawn({x:tower[o].x, y:tower[o].y,vw:-0.5,w:5,lifeSpan:5,rend:particleBloom});
			}
			currCD = CD;
		}
		if (currCD > 0) currCD --;
		updateBuild();
		updateMiss();
		updateShip();
		updateEff();
	}
}
function start() {
	if (localStorage.getItem("scores") != null && localStorage.getItem("scores") != "") {
		scores = localStorage.getItem("scores").split(",");
	}
	c = document.getElementById("ctxCanvas");
	ctx = c.getContext("2d");
	b = document.getElementById("backCanvas");
	back = b.getContext("2d");
	f = document.getElementById("foreCanvas");
	fore = f.getContext("2d");
	c.width = 250;
	c.height = 250;
	f.width = 450;
	f.height = 450;
	w = c.width;
	cw = c.width;
	h = c.height;
	ch = c.height;
	fw = f.width;
	fh = f.height;
	fore.imageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	fore.fillStyle = "white";
	fore.strokStyle = "white";
	ctx.font = "10px Arial";
	fore.textAlign = "center";
	ctx.textAlign = "center";
	c.addEventListener("mousemove", mouseMove, false);
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	f.addEventListener("mousemove", mouseMove, false);
	changeState(menuState);
	setEffs();
	setInterval(update, 1000 /60);
	render();
}
