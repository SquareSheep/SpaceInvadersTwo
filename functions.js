rand = () => (Math.random() - 0.5);
rgb = (r, g, b, a=1) => "rgba(" + r + "," + g + "," + b + "," + a+ ")";
length = (x, y) => x * x + y * y;
findDist2 = (x1, y1) => (x1.x - y1.x) * (x1.x - y1.x) + (x1.y - y1.y) * (x1.y - y1.y);
findDist = (x1, y1, x2, y2) => (x1 - x2) * (x1- x2) + (y1 - y2) * (y1 - y2);
function saveScores() {
	str = scores[0];
	for (i = 1 ; i < scores.length ; i ++) {
		str += "," + scores[i];
	}
	localStorage.setItem("scores",str);
}
function clear() {
	frames = 0;
	paused = false;
	score = 0;
	ship.length = 0;
	build.length = 0;
	eff2.length = 0;
	miss.length = 0;
}
function remove(q,index) {
	q.temp = q.ar[index];
	q.ar[index] = q.ar[q.arm - 1];
	q.ar[q.arm - 1] = q.temp;
	q.arm --;
}
function renderEff() {
	for (i = 0 ; i < eff.length ; i ++) {
		eff[i].render();
	}
	for (i = 0 ; i < eff2.length ; i ++) {
		eff2[i].render();
	}
}
function updateEff() {
	for (i = 0 ; i < eff.length ; i ++) {
		eff[i].update();
	}
	for (i = 0 ; i < eff2.length ; i ++) {
		eff2[i].update();
		if (eff2[i].lifeSpan <= 0) {
			eff2.splice(i, 1);
			i --;
		}
	}
}
function renderShip() {
	for (i = ship.length - 1 ; i >= 0 ; i --) {
		ship[i].render();
	}
}
function updateShip() {
	for (i = 0 ; i < ship.length ; i ++) {
		ship[i].update();
		for (k = 0 ; k < miss.length ; k ++) {
			if (findDist2(miss[k], ship[i]) < (miss[k].w + ship[i].w) * (miss[k].w + ship[i].w)) {
				missDeath(miss[k]);
				miss.splice(k, 1);
				k --;
			}
		}
		if (ship[i].HP <= 0) {
			score += ship[i].score * combo;
			eff2[eff2.length] = new Text("+" + ship[i].score * combo, ship[i].x, ship[i].y);
			ship[i].death();
			ship.splice(i, 1);
			i --;
		}
	}
}
function renderBuild() {
	ctx.fillStyle = "white";
	for (i = 0 ; i < build.length ; i ++) {
		if (build[i].currCD == null) {
			ctx.drawImage(build[i].image, build[i].x - build[i].w, build[i].y - build[i].h, build[i].w* 2, build[i].h* 2);
		} else {
			ctx.drawImage(TowerImage, build[i].x - build[i].w, build[i].y - build[i].h, build[i].w* 2, build[i].h* 2);
			ctx.save();
			ctx.translate(build[i].x, build[i].y - build[i].h);
			ctx.rotate(Math.atan2(mouseY - build[i].y + build[i].h, mouseX - build[i].x) - Math.PI / 2);
			ctx.drawImage(CannonImage[Math.floor(build[i].currCD / build[i].CD * CannonImage.length)], -3, 0, 6,12);
			ctx.restore();
		}
	}
}
function updateBuild() {
	for (i = 0 ; i < tower.length ; i ++) {
		if (tower[i].currCD > 0) tower[i].currCD --;
	}
	for (i = 0 ; i < build.length ; i ++) {
		for (k = 0 ; k < ship.length ; k ++) {
			if (Math.abs(build[i].y - ship[k].y) < ship[k].w + build[i].w) {
				if (Math.abs(build[i].x - ship[k].x) < ship[k].w + build[i].w) {
					if (build[i].currCD != null) {
						build[i].currCD = -1;
						score -= 200;
						eff2[eff2.length] = new Text("-200", build[i].x, build[i].y);
					} else {
						score -= 100;
						eff2[eff2.length] = new Text("-100", build[i].x, build[i].y);
					}
					particle.spawn({x:build[i].x, y:build[i].y,vw:-0.25,w:build[i].w * 2,lifeSpan:25,rend:buildingDeath});
					build.splice(i, 1);
					if (i > 0) i --;
					ship[k].death();
					ship.splice(k, 1);
					k --;
				}
			}
		}
	}
}
function renderMiss() {
	ctx.fillStyle = "white";
	for (i = 0 ; i < miss.length ; i ++) {
		ctx.save();
		ctx.translate(miss[i].x, miss[i].y);
		ctx.rotate(miss[i].angle - Math.PI / 2);
		ctx.drawImage(BulletImage[Math.floor(frames / 10) % BulletImage.length],-miss[i].w / 2, -miss[i].w / 2, miss[i].w, miss[i].w);
		ctx.restore();
	}
}
function updateMiss() {
	for (i = 0 ; i < miss.length ; i ++) {
		miss[i].x += miss[i].vx;
		miss[i].y += miss[i].vy;
		if (Math.random() > 0.5) particle.spawn({x:miss[i].x, y:miss[i].y,vw:Math.random() * 0.1,w:Math.random(),vx:rand(),vy:rand()});
		miss[i].lifeSpan --;
		if (miss[i].lifeSpan <= 0 || miss[i].y < 15) {
			missDeath(miss[i]);
			miss.splice(i, 1);
			i --;
		}
	}
}
function missDeath(q) {
	go = false;
	for (o = 0 ; o < ship.length ; o ++) {
		if (findDist2(ship[o], q) < (ship[o].w + q.r) * (ship[o].w + q.r)) {
			ship[o].hurt(q);
			ship[o].HP --;
			particle.spawn({x:ship[o].x, y:ship[o].y,vw:1,w:5,lifeSpan:5,rend:particleBloom});
			if (ship[o].HP == 0) combo ++;
			go = true;
		}
	}
	if (!go) combo = 1;
	particle.spawn({x:q.x, y:q.y,vw:-1,w:q.r,lifeSpan:15,rend:particleBloom});
	eff2[eff2.length] = new ImageEff(ExplosionImage, q.x, q.y, q.w);
}
function particleBloom(q) {
	ctx.beginPath();
	ctx.arc(Math.floor(q.x), Math.floor(q.y), q.w, 0,Math.PI * 2);
	ctx.fill();
}
function buildingDeath(q) {
	ctx.beginPath();
	ctx.arc(Math.floor(q.x), Math.floor(q.y), q.w, 0,Math.PI * 2);
	ctx.fill();
	if (frames % 4 == 0) {
		particle.spawn({x:q.x + rand() * q.w, y:q.y + rand() * q.w,vw:-0.75,w:q.w * Math.random() / 2,lifeSpan:15});
	}
}
function changeState(x) {
	currState = x;
	state[currState].setUp();
}
function render() {
	state[currState].render();
	window.requestAnimationFrame(render);
}
function update() {
	if (!pause) {
		state[currState].update();
		frames ++;
	}
}
function mouseUp(e) {
	keys[121] = false;
}
function mouseDown(e) {
	keys[121] = true;
}
function keyDown(e) {
	if (e.keyCode == 80 && !keys[80]) {
		if (pause) {
			frames = pausedFrames;
		} else {
			pausedFrames = frames;
		}
		pause = !pause;
	}
	keys[e.keyCode] = true;
}
function keyUp(e) {
	keys[e.keyCode] = false;
}
function mouseMove(e) {
	let rect = c.getBoundingClientRect();
    let scaleX = w / rect.width;
    let scaleY = h / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX + cam.x;
    mouseY = (e.clientY - rect.top) * scaleY + cam.y;
	overX = (e.clientX - rect.left) * scaleX;
	overY = (e.clientY - rect.top) * scaleY;
}
