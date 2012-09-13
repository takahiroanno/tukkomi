var audio = null;  // Audio オブジェクト

/* 初期処理 */
// Audioやoggのサポートチェックは略
init = function(){
  // Audioオブジェクト作成
  audio = new Audio("");
  // load()直後に再生しないようにautoplayをfalseに設定
  audio.autoplay = false;
  // Audioファイルのアドレス指定
  audio.src = "2.mp3";


  audio2 = new Audio("");
  // load()直後に再生しないようにautoplayをfalseに設定
  audio2.autoplay = false;
  // Audioファイルのアドレス指定
  audio2.src = "1.mp3";
};

/* 再生(一時停止中は一時停止箇所から再生) */
play = function(){
  audio.play();
};

play2 = function(){
  audio2.play();
};

/* 先頭から再生 */
playfromstart = function(){
  audio.load();  // ロード・アルゴリズムを実行して初期状態に戻す
  audio.play();
};

/* 一時停止 */
pause = function(){  
  audio.pause();
};  

/* 停止 */
stop = function(){  
  // ended属性で終了判定する
  if(!audio.ended){
    audio.pause();
    audio.currentTime = 0;  // 再生位置を0秒にする
  }
};
