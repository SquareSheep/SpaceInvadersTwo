function newImagesArray(x) {
	var ar = [];
	for (var i = 0 ; i < x.length ; i ++) {
		ar[i] = newImage(x[i]);
	}
	return ar;
}
function newImagesArray2(x, n) {
	var ar = [];
	for (var i = 1 ; i <= n; i ++) {
		ar[i - 1] = newImage(x + " (" + i + ")");
	}
	return ar;
}
function newImage(x) {
	var img = new Image();
	img.src = x + ".png";
	return img;
}
let SmallUFOImage = newImagesArray2("SmallUFO", 3);
let SmallUFODeathImage = newImagesArray2("Small UFO Death", 5);
let CannonImage = newImagesArray2("Cannon", 3);
let TowerImage = newImage("Tower");
let BuildingImage = newImagesArray2("Building", 3);
let BulletImage = newImagesArray2("Bullet", 3);
let ExplosionImage = newImagesArray2("Explosion", 3);