var audio = null;  // Audio オブジェクト
var aud;
var loadFlg = false;


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
  aud = document.getElementById('mixAud');
};


// プリロード
aud.addEventListener('canplay',function(){
  if(!loadFlg){
    window.alert('準備完了');
  }
  loadFlg = true;
}, true);

function preload(){
  window.alert('preload');
  aud.load();
  if(!loadFlg){
  }else{
    window.alert('スタンバイ済');
  }
}

/* 再生(一時停止中は一時停止箇所から再生) */
play = function(){
  aud.play();
};

play2 = function(){
  aud.play();
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
