# ReflectionDarts

遊びたい方はこちらから→https://maigomaigo.github.io/ReflectionDarts/

操作もルールもシンプルなゲームを作りました。暇つぶしにどうぞ！

### 操作方法

ゲーム画面をクリックするだけ

### ルール

的を上手く狙って高得点を目指そう！

### 高得点を取るコツ

上左右の壁に当たるごとに得点倍率が増えます。なるべく多く反射させてより高い点数に当てましょう！

的の得点は繰り返し同じ並びで出現します。制限時間内に4周ちょっとするので時間いっぱい使って頑張ってください。

------

以下コード解説

**script.js**

// Text init

​	score、time、bulletsは随時更新するので数字の部分を取得、初期値を入力してゲーム準備

// bullet setting

​	発射用の弾クラスを作成。

​	constructor()で初期化、render()で描画、update()で情報更新

// pointBoard setting

​	的クラスを作成。

​	constructor()で初期化、render()で描画、update()で情報更新

​	当たり判定はupdate()で随時確かめる。

// canvas  init

​	キャンバスの生成、アニメーションフレームの設定。

​	キャンバスは2dContextで横：縦＝3：2

// get Click event

​	クリックイベントを扱う、ゲームの進捗ごとに処理を変更

// start Page

​	ゲーム開始画面の生成

// frame move

​	1フレームごとに行う処理、それぞれの情報更新及びゲームの終了を確認している。