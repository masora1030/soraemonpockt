class Enemy {
	constructor(x, y, angle, kind) {
		this.kind = kind; // 敵の種類
		this.BULLET_NUM = 3; // 敵の最大弾数
		this.bullet = Array(this.BULLET_NUM); // 弾の変数
		for(var i = 0;i < 5;i++) {
			this.bullet[i] = new Bullet();
		}
		this.x = x; // X座標
		this.y = y; // Y座標
		this.width = 32; // 幅
		this.height = 32; // 高さ
		this.angle = angle; // 角度
		this.spd = 3; // 速度
		this.cnt = 0; // カウンタ
	}

	getBulletNum() { // 発射されていない弾を検索
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(!this.bullet[i].exist) {
				return i;
			}
		}
		return -1;
	}

	shot() {
		if(this.cnt % 20 == 0) { // 20カウントずつ発射
			var num = this.getBulletNum(); // 発射されてない弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 4, 4, this.angle, 5);
			}
		}
		//	発射された弾を更新
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				this.bullet[i].move();
			}
		}
		//	カウンタを更新
		this.cnt++;
	}

	move() {
		//	X・Y座標を更新
		this.x += Math.cos(this.angle) * this.spd;
		this.y += Math.sin(this.angle) * this.spd;

		//	壁に当たったら跳ね返る
		if(this.x < this.width / 2 || this.x > WIDTH - this.width / 2) {
			var r = this.angle - Math.PI / 2;
			this.angle = this.angle - 2 * r;
			this.spd *= 1.01;
		}
		else if(this.y < this.height || this.y > HEIGHT - this.height / 2) {
			var r = this.angle - Math.PI * 2;
			this.angle = this.angle - 2 * r;
			this.spd *= 1.01;
		}
	}

	draw(context) {
		//	敵を描画
		context.font = "48px serif";
		context.fillStyle = "rgb(0, 0, 0)";
		switch(this.kind) {
			case 0: context.fillStyle = "rgb(200, 0, 0)"; context.fillText("T", this.x - this.width/2, this.y - this.height/2); break;
			case 1: context.fillText("a", this.x - this.width/2, this.y - this.height/2); break;
			case 2: context.fillText("k", this.x - this.width/2, this.y - this.height/2); break;
			case 3: context.fillText("s", this.x - this.width/2, this.y - this.height/2); break;
			case 4: context.fillText("h", this.x - this.width/2, this.y - this.height/2); break;
			case 5: context.fillText("i", this.x - this.width/2, this.y - this.height/2); break;
			case 6: context.fillText("m", this.x - this.width/2, this.y - this.height/2); break;
			case 7: context.fillStyle = "rgb(200, 0, 0)"; context.fillText("S", this.x - this.width/2, this.y - this.height/2); break;
			case 8: context.fillText("o", this.x - this.width/2, this.y - this.height/2); break;
			case 9: context.fillText("r", this.x - this.width/2, this.y - this.height/2); break;
		}

		//	敵の弾を描画
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				this.bullet[i].draw(context);
			}
		}
	}
}

class BossEnemy {
	constructor(x, y) {
		this.BULLET_NUM = 100; // 敵の最大弾数
		this.bullet = Array(this.BULLET_NUM); // 弾の変数
		for(var i = 0;i < 100;i++) {
			this.bullet[i] = new Bullet();
		}
		this.x = x; // X座標
		this.y = y; // Y座標
		this.width = 150; // 幅
		this.height = 150; // 高さ
		this.angle = Math.PI*Math.random(); // 角度
		this.spd = 1; // 速度
		this.cnt = 0; // カウン
		this.hp = 30; // 体力
		this.img = new Image();
		this.img.src = '../static/img/self.png';
	}

	getBulletNum() { // 発射されていない弾を検索
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(!this.bullet[i].exist) {
				return i;
			}
		}
		return -1;
	}

	shot() {
		if(this.cnt % 19 == 0) { // 30カウントずつ発射
			var num = this.getBulletNum(); // 発射されてない弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 6, 6, this.angle+2*Math.PI*this.cnt/200, 6);
			}
			num = this.getBulletNum(); // 発射されてない弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 10, 10, this.angle+2*Math.PI*this.cnt/200-Math.PI*2/3, 4);
			}
			num = this.getBulletNum(); // 発射されてない弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 30, 30, this.angle+2*Math.PI*this.cnt/200+Math.PI*2/3, 2);
			}
		}
		//	発射された弾を更新
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				this.bullet[i].move();
			}
		}
		//	カウンタを更新
		this.cnt++;
	}

	move() {
		this.angle+=Math.PI/1000
		this.angle+=Math.PI/1000
		//	X・Y座標を更新
		this.x += Math.cos(this.angle) * this.spd;
		this.y += Math.sin(this.angle) * this.spd;

		//	壁に当たったら跳ね返る
		if(this.x < this.width / 2 || this.x > WIDTH - this.width / 2) {
			var r = this.angle - Math.PI / 2;
			this.angle = this.angle - 2 * r;
			this.spd *= 1.01;
		}
		else if(this.y < this.height || this.y > HEIGHT - this.height / 2) {
			var r = this.angle - Math.PI * 2;
			this.angle = this.angle - 2 * r;
			this.spd *= 1.01;
		}
	}

	draw(context) {
		//	敵を描画
		context.drawImage(this.img,this.x-this.width/2,this.y-this.height/2,this.width,this.width);
		if (bossstart) {
			context.font = "bold 20px sans-serif";
			if (this.hp >= 10) {
				context.fillStyle = "rgb(0, 220, 50)";
			} else {
				context.fillStyle = "rgb(200, 0, 50)";
			}
			context.fillText("HP : " + String(this.hp), this.x-this.width/2+10, this.y-90);
		}

		//	敵の弾を描画
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				this.bullet[i].draw(context);
			}
		}
	}
}





class Bullet {
	constructor() {
		this.exist = false; // 存在フラグ
		this.x = 0; // X座標
		this.y = 0; // Y座標
		this.width = 0; // 幅
		this.height = 0; // 高さ
		this.angle = 0; // 角度
		this.spd = 0; // 速度
	}

	enter(x, y, width, height, angle, spd) {
		this.exist = true; // 存在フラグをオンにする
		this.x = x; // X座標を設定
		this.y = y; // Ｙ座標を設定
		this.width = width; // 幅を設定
		this.height = height; // 高さを設定
		this.angle = angle; // 角度を設定
		this.spd = spd; // 速度を設定
	}

	move() {
		//	X・Y座標を更新
		this.x += Math.cos(this.angle) * this.spd;
		this.y += Math.sin(this.angle) * this.spd;

		//	画面外に出たら消す
		if(this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT) {
			this.exist = false;
		}
	}

	draw(context) {
		//	弾を描画
		context.fillStyle = "rgb(30, 180, 30)";
		context.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
	}
}






class Player {
	constructor() {
	    this.BULLET_NUM = 10; // 弾の最大発射数
		this.bullet = Array(this.BULLET_NUM);
		for(var i = 0;i < this.BULLET_NUM;i++) {
			this.bullet[i] = new Bullet();
		}
		this.cnt = 0; // カウンタ
		this.residue = 5; // 残基
        this.deffect = false; // ダメージエフェクトのフラグ
		this.x = WIDTH / 2; // X座標
		this.y = HEIGHT * 3 / 4; // Y座標
		this.width = 24; // 幅
		this.height = 30; // 高さ
	}

	getBulletNum() {	//	発射されていない弾を検索
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(!this.bullet[i].exist) {
				return i;
			}
		}
		return -1;
	}

	shot(key) {
		var num; // 発射できる弾の番号
		if(key[KEY_Z] == 1) {
			num = this.getBulletNum(); // 弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 4, 36, -Math.PI / 2, 10);
				//	Zキー状態を更新
				key[KEY_Z]++;
			}
		}
	}

	move(key) {
		var diagonal = 1.0; // 斜め方向への補正値
		var hori = false, vert = false; // 横・縦移動のフラグ

		//	横移動が行われた場合
		if(key[KEY_RIGHT] != 0 || key[KEY_LEFT] != 0) {
			hori = true;
		}
		//	縦移動が行われた場合
		if(key[KEY_UP] != 0 || key[KEY_DOWN] != 0) {
			vert = true;
		}
		//	横・縦移動が行われた場合（斜め移動）
		if(hori && vert) {
			diagonal = Math.sqrt(2.0); // 補正値をルート2にする
		}

		//	移動後の座標を計算
		var mx = this.x + (key[KEY_RIGHT] - key[KEY_LEFT]) * 6 / diagonal;
		var my = this.y + (key[KEY_DOWN] - key[KEY_UP]) * 6 / diagonal;

		//	画面外に飛び出ていなければX座標を更新する
		if(!(mx < this.width / 2 || mx > WIDTH - this.width / 2)) {
			this.x = mx;
		}
		if(!(my < this.height / 2 || my > HEIGHT - this.height / 2)) {
			this.y = my;
		}
	}

	draw(context) {
		//	プレイヤーを描画
        //	ダメージエフェクトで1カウントずつ交互に表示・非表示を切り替える
		if(!(this.deffect && this.cnt % 2 == 0)) {
			context.fillStyle = "rgb(255, 0, 150)";
			context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		}

		//	発射された弾を更新・描画
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				if (gamestart) {
					this.bullet[i].move();
				}
				this.bullet[i].draw(context);
			}
		}

		//	カウンタが100になったらリセットし、ダメージエフェクトを解除
		if(this.cnt > 100) {
			this.cnt = 0;
			this.deffect = false;
		}

		this.cnt++; // カウンタを更新
	}
}






let WIDTH = 1400; // 画面の幅
let HEIGHT = 700; // 画面の高さ

var key = Array(5);
let KEY_RIGHT	= 0;
let KEY_LEFT	= 1;
let KEY_UP		= 2;
let KEY_DOWN	= 3;
let KEY_Z		= 4;
key[KEY_RIGHT]	= 0;
key[KEY_LEFT]	= 0;
key[KEY_UP]		= 0;
key[KEY_DOWN]	= 0;
key[KEY_Z]		= 0;

var player = new Player(); // Playerクラスのインスタンス
let ENEMY_NUM = 13; // 敵の数
var enemy = Array(ENEMY_NUM); // Enemyクラスのインスタンス（配列）
var boss  = new BossEnemy(WIDTH/2,HEIGHT/2);
var kind = [0, 1, 2, 1, 3, 4, 5, 6, 1, 7 ,8, 9, 1]; // 敵の種類を設定

//	Enemyの初期化
for(var i = 0;i < 9;i++) {
	enemy[i] = new Enemy(WIDTH * (i + 3) / 15, HEIGHT / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 8, kind[i]);
}
for (var i = 9;i < 13;i++) {
	enemy[i] = new Enemy(WIDTH * (i - 1) / 15, HEIGHT / 4 + 50, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 8, kind[i]);
}

var canvas; // Canvas
var context; // Context

canvas = document.getElementById("canvas"); // Canvasを取得
canvas.width  = 1400;
canvas.height = 700;
context = canvas.getContext("2d"); // CanvasからContextを取得

var score = 0; // スコア
var gamestart = false; // ゲームスタートフラグ
var gameover = false; // ゲームオーバーフラグ
var bossstart = false; // boss出現
var gameclear = false;
var pauseflag = false;
var cnt = 0;

function gameStart() {
	gamestart = true;
}

function gameEnd() {
	gameover = false; // ゲームオーバーを解
	bossstart = false; // boss出現
	gameclear = false;
	pauseflag = false;
	player.residue = 5; // 残基をリセット
	player.deffect = false; // ダメージエフェクトを解除
	player.x = WIDTH / 2; // X座標をリセット
	player.y = HEIGHT * 3 / 4; // Y座標をリセット
	score = 0; // スコアをリセット

	//	Enemyの初期化
	for(var i = 0;i < 9;i++) {
		enemy[i] = new Enemy(WIDTH * (i + 3) / 15, HEIGHT / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 8, kind[i]);
	}
	for (var i = 9;i < 13;i++) {
		enemy[i] = new Enemy(WIDTH * (i - 1) / 15, HEIGHT / 4 + 50, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 8, kind[i]);
	}
	boss  = new BossEnemy(WIDTH/2,HEIGHT/2);
	gamestart = false;
}

function gamePause() {
	gamestart = !gamestart;
	pauseflag = true;
}

function bossStart() {
	bossstart = true;
	boss.img.src = '../static/img/selfboss.png';
	var startMsec = new Date();
  	while (new Date() - startMsec < 1000);
	// bossの動き始める動きを
}

function bossEnd() {
	bossstart = false;
	// bossの負ける動きを
}

requestAnimationFrame(main); // main関数を実行 この時点でゲームスタート

function main() {

	context.clearRect(0, 0, WIDTH, HEIGHT); // 画面消去

	if(gamestart) {

		if (!gameover && !gameclear) { // ゲームオーバーでなければ実行する
			player.shot(key); // プレイヤーのショット
		}

		player.move(key); // プレイヤーを操作
		player.draw(context); // プレイヤーを描画

		for (var i = 0; i < ENEMY_NUM; i++) {
			if (!gameclear) {
				enemy[i].shot(); // 敵のショット
				enemy[i].move(); // 敵を移動
			}
			enemy[i].draw(context); // 敵を描画
		}

		if (bossstart && !gameclear) {
			boss.shot(); // bossのショット
			boss.move(); // bossを移動
		}
		boss.draw(context); // bossを描画

		if (!gameover && !gameclear) {
			//	敵とプレイヤーの当たり判定
			for (var i = 0; i < ENEMY_NUM; i++) {
				if (!player.deffect && Math.abs(player.x - enemy[i].x) < (player.width + enemy[i].width) / 2 &&
					Math.abs(player.y - enemy[i].y) < (player.height + enemy[i].height) / 2) {
					player.cnt = 0; // プレイヤーのカウンタをリセット
					player.residue--; // プレイヤーの残基を減らす
					player.deffect = true; // ダメージエフェクトを開始する
				}
			}

			// Bossとプレイヤーの当たり判定
			if (bossstart) {
				if (!player.deffect && Math.abs(player.x - boss.x) < (player.width + boss.width) / 2 &&
					Math.abs(player.y - boss.y) < (player.height + boss.height) / 2) {
					player.cnt = 0; // プレイヤーのカウンタをリセット
					player.residue--; // プレイヤーの残基を減らす
					player.deffect = true; // ダメージエフェクトを開始する
				}
			}

			//	プレイヤーと敵の弾の当たり判定
			for (var i = 0; i < ENEMY_NUM; i++) {
				for (var j = 0; j < enemy[i].BULLET_NUM; j++) {
					if (enemy[i].bullet[j].exist) {
						if (!player.deffect && Math.abs(player.x - enemy[i].bullet[j].x) < (player.width + enemy[i].bullet[j].width) / 2 &&
							Math.abs(player.y - enemy[i].bullet[j].y) < (player.height + enemy[i].bullet[j].height) / 2) {
							player.cnt = 0; // プレイヤーのカウンタをリセット
							player.residue--; // プレイヤーの残基を減らす
							player.deffect = true; // ダメージエフェクトを開始する
						}
					}
				}
			}

			// プレイヤーとBossの弾の当たり判定
			if (bossstart) {
				for (var j = 0; j < boss.BULLET_NUM; j++) {
					if (boss.bullet[j].exist) {
						if (!player.deffect && Math.abs(player.x - boss.bullet[j].x) < (player.width + boss.bullet[j].width) / 2 &&
							Math.abs(player.y - boss.bullet[j].y) < (player.height + boss.bullet[j].height) / 2) {
							player.cnt = 0; // プレイヤーのカウンタをリセット
							player.residue--; // プレイヤーの残基を減らす
							player.deffect = true; // ダメージエフェクトを開始する
						}
					}
				}
			}

			//	プレイヤーの弾と敵の当たり判定
			for (var i = 0; i < player.BULLET_NUM; i++) {
				if (player.bullet[i].exist) {
					for (var j = 0; j < ENEMY_NUM; j++) {
						if (Math.abs(player.bullet[i].x - enemy[j].x) < (player.bullet[i].width + enemy[j].width) / 2 &&
							Math.abs(player.bullet[i].y - enemy[j].y) < (player.bullet[i].height + enemy[j].height) / 2) {
							enemy[j].x = WIDTH / 12 + Math.random() * WIDTH * 5 / 6; // ランダムなX座標に設定
							enemy[j].y = HEIGHT / 8; // Y座標を設定
							enemy[j].angle = Math.PI * 2 * Math.random(); // ランダムな角度に設定
							player.bullet[i].exist = false; // プレイヤーの弾を消す
							switch (enemy[j].kind) {
								case 0:
									score += 300;
									break; // スコアを100アップ
								case 1:
									score += 100;
									break; // スコアを100アップ
								case 2:
									score += 100;
									break; // スコアを100アップ
								case 3:
									score += 100;
									break; // スコアを100アップ
								case 4:
									score += 100;
									break; // スコアを100アップ
								case 5:
									score += 100;
									break; // スコアを100アップ
								case 6:
									score += 100;
									break; // スコアを100アップ
								case 7:
									score += 300;
									break; // スコアを100アップ
								case 8:
									score += 100;
									break; // スコアを100アップ
								case 9:
									score += 100;
									break; // スコアを100アッっぷ
							}
						}
					}

					if (bossstart) {
						if (Math.abs(player.bullet[i].x - boss.x) < (player.bullet[i].width + boss.width) / 2 &&
							Math.abs(player.bullet[i].y - boss.y) < (player.bullet[i].height + boss.height) / 2) {
							player.bullet[i].exist = false; // プレイヤーの弾を消す
							if (boss.hp > 0) {
								boss.hp -= 1;
							} else {
								score += 10000;
							}
						}
					}
				}
			}
		}

		if (!bossstart && score >= 1000 && !gameclear && !gameover) {
			bossStart();
		}

		if (player.residue == 0 && !gameclear && !gameover) { // 残基が0になったら
			gameover = true; // ゲームオーバーにする

			//	プレイヤーの弾をすべて消す
			for (var i = 0; i < player.BULLET_NUM; i++) {
				player.bullet[i].exist = false;
			}
		}

		if (bossstart && !gameclear && !gameover){
			if (boss.hp == 0) { // bossの体力が0になったら
				bossEnd();
				gameclear = true; // ゲームクリアにする

				//	プレイヤーの弾をすべて消す
				for (var i = 0; i < player.BULLET_NUM; i++) {
					player.bullet[i].exist = false;
				}
			}
		}

		//	残基の表示
		for (var i = 0; i < player.residue; i++) {
			context.fillStyle = "rgb(255, 0, 225)";
			context.fillRect(player.x - player.width/2 - 15 + i*12, player.y + player.height/2 + 6, 6, 6);
		}

		//	スコアの表示
		context.font = "bold 20px sans-serif";
		context.fillStyle = "rgb(0, 0, 0)";
		context.fillText("SCORE: " + score, 10, 60);

		//	ゲームオーバー後の内容
		if (gameover) {
			//	GAME OVERと表示する
			context.font = "bold 60px sans-serif";
			context.fillStyle = "rgb(255, 100, 100)";
			context.fillText("GAME OVER...", WIDTH / 4, HEIGHT / 3 + 100);
			context.fillStyle = "rgb(0, 0, 0)";
			context.fillText("Your Score : " + String(score), WIDTH / 4, HEIGHT / 2 + 100);

			//	Press Enter to Continueと表示する
			context.fillStyle = "rgb(255, 100, 100)";
			context.font = "bold 40px sans-serif";
			context.fillStyle = "rgba(255, 100, 100, " + (Math.sin(Math.PI * 2 * cnt / 200)) + ")";
			context.fillText("Press Enter to Reset", WIDTH / 4, HEIGHT * 2 / 3 + 100);

			//	カウンタを更新
			cnt++;
			//	カウンタを200でリセットする
			if (cnt == 200) cnt = 0;
		}

		//  ゲームクリアの内容
		if (gameclear) {
			//	GAME CLEARと表示する
			context.font = "bold 60px sans-serif";
			context.fillStyle = "rgb(220, 220, 50)";
			context.fillText("GAME CLEAR!!!", WIDTH / 4, HEIGHT / 3 + 100);
			context.fillStyle = "rgb(0, 0, 0)";
			context.fillText("Your Score : " + String(score), WIDTH / 4, HEIGHT / 2 + 100);

			//	Press Enter to Continueと表示する
			context.fillStyle = "rgb(220, 220, 50)";
			context.font = "bold 40px sans-serif";
			context.fillStyle = "rgba(220, 220, 50, " + (Math.sin(Math.PI * 2 * cnt / 200)) + ")";
			context.fillText("Press Enter to Reset", WIDTH / 4, HEIGHT * 2 / 3 + 100);

			//	カウンタを更新
			cnt++;
			//	カウンタを200でリセットする
			if (cnt == 200) cnt = 0;
		}

		if (!gameclear && !gameover && gamestart) {
			context.font = "bold 50px sans-serif";
			context.fillStyle = "rgba(100, 100, 100, 0.2)";
			context.fillText("SHOT  : PRESS [Z]    MOVE  : ARROW KEYS", WIDTH / 4, HEIGHT * 2 / 3);
			context.fillText("PAUSE : PRESS [X]", WIDTH / 4, HEIGHT * 5 / 6);
			context.font = "bold 40px sans-serif";
			context.fillText("SCORE : " + String(score), WIDTH / 2 - 100, HEIGHT * 11 / 12);
		}
	} else {
		for (var i = 0; i < ENEMY_NUM; i++) {
			enemy[i].draw(context); // 敵を描画
		}
		boss.draw(context); // bossを描画
		if (!gameclear && !gameover && pauseflag) {
			player.draw(context); // プレイヤーを描画
			//	残基の表示
			for (var i = 0; i < player.residue; i++) {
				context.fillStyle = "rgb(255, 0, 225)";
				context.fillRect(player.x - player.width/2 - 15 + i*12, player.y + player.height/2 + 6, 6, 6);
			}
			context.font = "bold 50px sans-serif";
			context.fillStyle = "rgba(100, 100, 100, 0.2)";
			context.fillText("RESET PAUSE : PRESS [X]", WIDTH / 4, HEIGHT * 5 / 6);
			context.font = "bold 40px sans-serif";
			context.fillText("SCORE : " + String(score), WIDTH / 2 - 100, HEIGHT * 11 / 12);
		}
	}

	requestAnimationFrame(main); // ループ
}

document.addEventListener("keydown", e => {
	var keyCode = e.keyCode; // キーコードを取得

    // 動き
	switch(keyCode) {
		case 39: key[KEY_RIGHT]	= 1; break;
		case 37: key[KEY_LEFT]	= 1; break;
		case 38: key[KEY_UP]	= 1; break;
		case 40: key[KEY_DOWN]	= 1; break;
		case 90: key[KEY_Z]++;		 break;
		case 88: if (gamestart || pauseflag) {gamePause();} break;
		case 13:
			//	ゲームオーバー後にEnterが押されたら
			if(gameover || gameclear) {
				gameover = false; // ゲームオーバーを解
				bossstart = false; // boss出現
				gameclear = false;
				pauseflag = false;
				player.residue = 5; // 残基をリセット
				player.deffect = false; // ダメージエフェクトを解除
				player.x = WIDTH / 2; // X座標をリセット
				player.y = HEIGHT * 3 / 4; // Y座標をリセット
				score = 0; // スコアをリセット

				//	Enemyの初期化
				for(var i = 0;i < 9;i++) {
					enemy[i] = new Enemy(WIDTH * (i + 3) / 15, HEIGHT / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 8, kind[i]);
				}
				for (var i = 9;i < 13;i++) {
					enemy[i] = new Enemy(WIDTH * (i - 1) / 15, HEIGHT / 4 + 50, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 8, kind[i]);
				}
				boss  = new BossEnemy(WIDTH/2,HEIGHT/2);
				gamestart = false;
			}
			break;
	}
});

document.addEventListener("keyup", e => {
	var keyCode = e.keyCode; // キーコードを取得

    // 動き
	switch(keyCode) {
		case 39: key[KEY_RIGHT]	= 0; break;
		case 37: key[KEY_LEFT]	= 0; break;
		case 38: key[KEY_UP]	= 0; break;
		case 40: key[KEY_DOWN]	= 0; break;
		case 90: key[KEY_Z]		= 0; break;
	}
});