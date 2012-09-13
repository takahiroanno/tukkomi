
//グローバル変数の定義
var NUMBEROFGROUPS; //総グループ数

// initArrayの配列番号用の変数を作成
var GROUP_INFO;
var DATA_ARRAY;

// checkNewTweet関連
var count=[];//New Tweetsの数
var idMax=[];//今表示しているツイートの中のidの最大値
var idMin=[];//今表示しているツイートの中のidの最小値
var TweetsInArticleLength=[];//Article内のTweetsの数
var count;
var checkcount = 0;



//グループの情報を取得
//class_id=1のグループ数を読み込む。
function GetGroupInfo(){
	//alert("関数loadgroups");
	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/class_data/"+class_id,
 	null,callbackGetGroupInfo());
};


function callbackGetGroupInfo(){
	return function(json,status){
		NUMBEROFGROUPS=json.length;
		GROUP_INFO=json;	
			
		//表示の初期化
		
		initSideBox(NUMBEROFGROUPS,GROUP_INFO);//サイドバーの初期化
		group_wrap_width(NUMBEROFGROUPS);　//横幅を初期化
		
		appendOtherColumn(0,"CLASS-TIMELINE");//All-TLカラムの初期化
		appendOtherColumn(1,"Fav");//Favカラムの初期化			
		appendGroupColumn(NUMBEROFGROUPS,GROUP_INFO);//グループナビを追加
		initTweets();//LoadTweets
		
		
	};
};



//sideBoxの初期化
function initSideBox(NUMBEROFGROUPS,GROUP_INFO){
	for (var group_id = 0; group_id < NUMBEROFGROUPS; group_id++ ){
		
		var real_id = GROUP_INFO[group_id].id;
		var groupName = GROUP_INFO[group_id].name;
		$(".group_list_box").append($("<button class=pager href='#group"+real_id+"'>"+groupName+"</button><br />"));
	}
};

	
//column全体(group_column_wrap)の全体の長さを設定
function group_wrap_width(NUMBEROFGROUPS){
	$("#group_column_wrap").css("width", 280*(NUMBEROFGROUPS +2) +"px");
};
	
//グループナビの初期化
function appendGroupColumn(NUMBEROFGROUPS,GROUP_INFO){

	for (var group_id = 0; group_id < NUMBEROFGROUPS; group_id++ ){
		var real_id = GROUP_INFO[group_id].id;	


	$("<div class=group_column>")
		.attr("id", "group" + real_id)
		.appendTo(".group_column_wrap");

	//column_headerとgroup_title追加
	$("<div class=column_upper_wrap id='"+"column_upper_wrap"+real_id+"'><div class=column_header id='"+"headerwrap"+real_id+"'></div></div>")
		//.attr("id", "headerwrap" + real_id)
		.find(".column_header")
		.append($("<div class=group_title>"+GROUP_INFO[group_id].name+"</div>"))
		.append("member:"+GROUP_INFO[group_id].users.length+"<br />tweets:").end()
		.appendTo($("#group" + real_id));
			
	//group_navにimgを追加
	$("<div class=group_nav>")
		.attr("id","group_nav"+real_id)
		.appendTo("#column_upper_wrap"+real_id);

	$("<div class=img_wrap>").attr("id","img_wrap"+real_id)
		.appendTo("#group_nav" + real_id);

	//class_dataのapiからuserのimg_urlを5つ持ってくる
	//!!!img_urlが5つ（3つ）に達していないときにエラーが出ないように処理を追加
	var group_users=GROUP_INFO[group_id].users;
	if (group_users.length>5){
		for (var k=0; k<5; k++){
				$("<div class=nav_img><img src=# class=#  /></div>").find("img").attr("src", group_users[k].img_url).attr("class","img"+k).end()
				.appendTo("#img_wrap"+real_id);

	}}else{
		for (var k=0; k<group_users.length; k++){
				$("<div class=nav_img><img src=# class=#  /></div>").find("img").attr("src", group_users[k].img_url).attr("class","img"+k).end()
				.appendTo("#img_wrap"+real_id);
	}};
	

	//group_navに議事録のボタンを追加
//	$("<a class=nav_button id='nav_button" + group_id + "' href='"+GROUP_INFO[group_id].log+"' target='_blank' >議事ログ</a>").appendTo("#img_wrap"+real_id);
	$("<a href='"+GROUP_INFO[group_id].log+"' target='_blank'><img class=nav_button id='nav_button" + group_id + "' src='images/スクリーンショット 2012-05-27 15.47.49.png'  ></a>").appendTo("#img_wrap"+real_id);
//	$("<button class=nav_button id='nav_button" + group_id + "' href='#' target='_blank' >議事ログ</button>").appendTo("#img_wrap"+real_id);
//	$("<button class=nav_button id='nav_button" + group_id + "' href= '#' onclick='"+clickNavButton()+"'>議事ログ</button>").appendTo("#img_wrap"+real_id);
	function clickNavButton(){
		$("#nav_button"+group_id).live("click",function(){
		//実際にreal_idを取得してから、そこのaddressに飛ばしたい。
		//group_id = $(this).attr('id').slice(10);
		document.location = window.open(GROUP_INFO[group_id].log);
	});
	};

	//アーティクルのボックスを作っている
	$("<div class=article >" )
		.attr("id", "article"+ real_id)
		.appendTo($("#group" + real_id));

	//ループ終了		
	};　

};

//All-TLとFavのcolumnの初期化	
function appendOtherColumn(AllFav,Title){
	$("<div class=group_column>")
		.attr("id", "group"+AllFav)
		.appendTo(".group_column_wrap");

	//column_headerとgroup_title追加
	$("<div class=column_upper_wrap id='"+"column_upper_wrap"+AllFav+"'><div class=column_header id='"+"headerwrap"+AllFav+"'></div></div>")
		//.attr("id", "headerwrap"+AllFav)
		.find(".column_header")
		.append($("<div class=group_title>"+Title+"</div>")).end()
		.appendTo($("#group"+AllFav));

	//group_navを追加する。
	$("<div class=group_nav>")
		.appendTo($("#column_upper_wrap"+AllFav));

	//アーティクルのボックスを作っている
	$("<div class=article >" )
		.attr("id", "article"+AllFav)
		.appendTo($("#group"+AllFav));
	//ループ終了

};	

function initTweets(){
//	alert("NUMBEROFGROUPS"+NUMBEROFGROUPS);
	for (var group_id = 0; group_id < NUMBEROFGROUPS; group_id++ ){
		var real_id = GROUP_INFO[group_id].id;
		initTweetsByGroup(real_id,0,10,callbackinitTweetsByGroup);
		ClickNewTweetEvent(real_id);
		ClickOldTweetEvent(real_id);			
	};
	
	initTweetsTLALL(0,10,callbackinitTweetsByGroup);
	initTweetsFav(0,10,callbackinitTweetsByGroup);
	
	ClickNewTweetEventTLALL();
	ClickNewTweetEventFav();
	
	ShowOldTweets(0);
	ShowOldTweets(1);
	
	ClickOldTweetEventTLALL();
	ClickOldTweetEventFav();
	
	//以降、新着の監視をはじめる
	setTimer();
	
	
	
};

//getJSON関連の処理。引数を変えることで、新たにtweetをロードするときも使い回す。
function initTweetsByGroup(real_id,tweet_start,tweet_count,func){
	
	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/group_tl/"+ real_id +"/"+tweet_start+"/"+tweet_count+"/",
 		null,func(real_id) );	

};

// init関数の中のloadTweets　からのクロージャ
function callbackinitTweetsByGroup(real_id){
	return function(json,status){
		idMax[real_id] = json[0].tw_id;
		
		for (var i = 0; i<json.length; i++ ){

			appendTweets(i,real_id,json);
			
		};
		//OldTweetsの表示を下に加える
		ShowOldTweets(real_id);
	};
};

//TLALLのtweetをロード
function initTweetsTLALL(tweet_start,tweet_count,func){
	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/class_tl/"+class_id+"/"+tweet_start+"/"+tweet_count+"/",
 		null,func(0) );	
}

//Favのtweetをロード	
function initTweetsFav(tweet_start,tweet_count,func){
	
	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/fav_tl/"+class_id+"/"+tweet_start+"/"+tweet_count+"/",
 		null,func(1) );	

};

//tweetをarticleにappendする（新たにロードするときもここのコードを使い回す）
function appendTweets(i,real_id,json){
	if (json[i].fav == 1){
		$("<div class=tweet>")
			.attr("id",json[i].tw_id)
			.addClass("fav")
			.append($("<div class=tweet_img_wrap><div class=tweet_img><a href='https://twitter.com/#!/"+json[i].name+"' target='_blank'><img src='"+json[i].img_url+"' class=#  /></a></div></div>"))
			.find("div.tweet_img_wrap")
			.append($("<a class='fav_button' href=# 　></a>")
			.append("fav")
			.attr("id",real_id+"fav_button"+json[i].tw_id)).end()
			
			.append($("<div class=tweet_content_wrap></div>")
			.append($("<div class=tweet_upper_content></div>")
			.append($("<a class= tweet_name href='https://twitter.com/#!/"+json[i].name+"' target='_blank' ></a>")
			.append(json[i].name))
			.append($("<div class= tweet_time></div>")
			.append(json[i].post_datetime)))

			.append($("<div class=tweet_txt></div>")
			.append(json[i].txt)

			))
			.appendTo($("#article"+ real_id));

		//favを押した時に色を変えるイベントを追加。
		$("#"+real_id+"fav_button"+json[i].tw_id).live("click",
			fav_click(json[i].tw_id)
		);
				
	}else{
		$("<div class=tweet>")
			.attr("id",json[i].tw_id)

			.append($("<div class=tweet_img_wrap><div class=tweet_img><a href='https://twitter.com/#!/"+json[i].name+"' target='_blank'><img src='"+json[i].img_url+"' class=#  /></a></div></div>"))
			.find("div.tweet_img_wrap")
			.append($("<a class='fav_button'　href=# 　></a>")
			.append("fav")
			.attr("id",real_id+"fav_button"+json[i].tw_id)).end()
			
			.append($("<div class=tweet_content_wrap></div>")
			.append($("<div class=tweet_upper_content></div>")
			.append($("<a class= tweet_name href='https://twitter.com/#!/"+json[i].name+"' target='_blank' ></a>")
			.append(json[i].name))
			.append($("<div class= tweet_time></div>")
			.append(json[i].post_datetime)))

			.append($("<div class=tweet_txt></div>")
			.append(json[i].txt)

			))
			.appendTo($("#article"+ real_id));


		//favを押した時に色を変えるイベントを追加。
		$("#"+real_id+"fav_button"+json[i].tw_id).live("click",
			fav_click(json[i].tw_id)
		);

	};
	
	//tweet_txt　でurl、hash、@のものがあったら、リンク付きに置換
	$(".tweet_txt").each(function(){
		var txt = $(this).text();
		txt = txt .replace(/(http:\/\/[\x21-\x7e]+)/gi,'<a class ="tweet_url" href="$1" target="_blank">$1</a>')
				  .replace(/#(\w+)/g,'<a class ="tweet_hash" href="http://twitter.com/#search?q=%23$1" target="_blank">#$1</a>')
				  .replace(/@(\w+)/g,'<a class ="tweet_at" href="http://twitter.com/$1" target="_blank">@$1</a>');
		$(this).html(txt);
	});
	
	//a要素にhoverした時にunderline付ける
	addHover();	
};


//a要素にhoverした時にunderline付ける
function addHover(){$("a").hover(function(){
	$(this).css("text-decoration","underline")
	},function(){
		$(this).css("text-decoration","none")
	});
};


//古いツイートがあることを表示
function ShowOldTweets(real_id){
	
	$("#oldTweet"+real_id).remove();
	
	//Article内のTweetsの数
	TweetsInArticleLength[real_id] = $("#article"+real_id+">div.tweet").length;
	
	idMin[real_id] = $("#article"+real_id+">div.tweet:last-child").attr("id");
	
	//articleの1番下にoldTweetsの表示追加
	$("<div><button class=oldTweet href=#>More Tweet</button></div>")
		.attr("id","oldTweet"+real_id)
		.appendTo($("#article"+real_id));
	
	//a要素にhoverした時にunderline付ける
	addHover();
	
};

//更新を確認
function CheckNewTweets(){
/*
	for (var group_id = 0; group_id < NUMBEROFGROUPS; group_id++ ){
		var real_id = GROUP_INFO[group_id].id;
		CheckNewTweetsByGroup(real_id);
	};
*/
	if(checkcount == 0){
		CheckNewTweetsTLALL();
	}else if(checkcount == 1) {
		CheckNewTweetsFav();
	}else{
	var real_id = GROUP_INFO[checkcount-2].id;
	CheckNewTweetsByGroup(real_id);
	}
	if(checkcount==NUMBEROFGROUPS+1){
	checkcount = 0;
	}else{
	checkcount++;
	}
};

//各グループの更新
function CheckNewTweetsByGroup (real_id){
	//ここもinitTweetsで1~50までを見た方がいい？
	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/group_tl_recent/"+ real_id +"/",
	null,callbackCheckNewTweetsByGroup(real_id));
}

//TLALLの更新
function CheckNewTweetsTLALL(){

	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/class_tl/"+class_id+"/0/50/",
	null,callbackCheckNewTweetsByGroup(0));
};

//Favの更新
function CheckNewTweetsFav(){
	
	$.getJSON("http://quizchannel.sakura.ne.jp/classy/index.php/api/fav_tl_recent/"+class_id,
	null,callbackCheckNewTweetsByGroup(1));
};

//上でたたいたapiのtw_idとidMaxからcountの個数を割り出す
function callbackCheckNewTweetsByGroup(real_id){
	return function (json,status){
		count[real_id] = 0;
		
		for(i=0;i<json.length;i++){
			if(json[i].tw_id > idMax[real_id]){
				count[real_id]++;
			}else{
				break;
			}
		}
		if(count[real_id] == 0){}
		else{
		real_id2 = real_id;
		ShowNewTweetsCount(real_id);}		
	};
};

//countを表示
function ShowNewTweetsCount(real_id){
		
		//過去のやつを消す
		$("#newTweet"+real_id).remove();
		
		//以下countをarticleのトップに表示
		$("<div><button class=newTweet href=#>"+count[real_id]+"New Tweet!</button></div>")
			.attr("id","newTweet"+real_id)
			.prependTo($("#article"+real_id));
	
		//a要素にhoverした時にunderline付ける
		addHover();
};
	
//各グループの新しいtweetの表示をクリックしたときの処理
function ClickNewTweetEvent(real_id){
	$("#newTweet"+real_id).live("click",function(event){
						
		//prependToを使うので、iの大きい方から処理
		$(this).remove();
		initTweetsByGroup(real_id,0,count[real_id]+15,callbackClickNewTweetEvent);
		return false;
	});
};	

//TLALLの新しいtweetの表示をクリックしたときの処理
function ClickNewTweetEventTLALL(){
	$("#newTweet0").live("click",function(event){
								
		$(this).remove();
		initTweetsTLALL(0,count[0]+15,callbackClickNewTweetEvent);
		return false;
	});
};

//Favの新しいtweetの表示をクリックしたときの処理
function ClickNewTweetEventFav(){
	$("#newTweet1").live("click",function(event){
					
		$(this).remove();
		initTweetsFav(0,count[0]+15,callbackClickNewTweetEvent);
		return false;
	});
};

//実際にいくつツイートを表示すればよいか判別し、追加する
function callbackClickNewTweetEvent(real_id){
	
	return function(json,status){
	
		var indexNew = 0;
		for(i = 0;i < json.length ;i++){
			if(json[i].tw_id > idMax[real_id]){
				indexNew++;
			}else{
				break;
			}
		}
		//idMax更新
		idMax[real_id] = json[0].tw_id;
		
		for (var i = indexNew-1 ; i>=0; i-- ){
				
		//ここはprependToを使う(=appendTweetsを使えない)ので、新しくコードを書く
		if (json[i].fav == 1){
			$("<div class=tweet>")
				.attr("id",json[i].tw_id)
				.addClass("fav")
				.append($("<div class=tweet_img_wrap><div class=tweet_img><a href='https://twitter.com/#!/"+json[i].name+"' target='_blank'><img src='"+json[i].img_url+"' class=#  /></a></div></div>"))
				.find("div.tweet_img_wrap")
				.append($("<a class='fav_button' href=# 　></a>")
				.append("fav")
				.attr("id",real_id+"fav_button"+json[i].tw_id)).end()

				.append($("<div class=tweet_content_wrap></div>")
				.append($("<div class=tweet_upper_content></div>")
				.append($("<a class= tweet_name href='https://twitter.com/#!/"+json[i].name+"' target='_blank' ></a>")
				.append(json[i].name))
				.append($("<div class= tweet_time></div>")
				.append(json[i].post_datetime)))

				.append($("<div class=tweet_txt></div>")
				.append(json[i].txt)

				))
				.prependTo($("#article"+ real_id));

			//favを押した時に色を変えるイベントを追加。
			$("#"+real_id+"fav_button"+json[i].tw_id).live("click",
				fav_click(json[i].tw_id)
			);

		}else{
			$("<div class=tweet>")
				.attr("id",json[i].tw_id)

				.append($("<div class=tweet_img_wrap><div class=tweet_img><a href='https://twitter.com/#!/"+json[i].name+"' target='_blank'><img src='"+json[i].img_url+"' class=#  /></a></div></div>"))
				.find("div.tweet_img_wrap")
				.append($("<a class='fav_button'　href=# 　></a>")
				.append("fav")
				.attr("id",real_id+"fav_button"+json[i].tw_id)).end()

				.append($("<div class=tweet_content_wrap></div>")
				.append($("<div class=tweet_upper_content></div>")
				.append($("<a class= tweet_name href='https://twitter.com/#!/"+json[i].name+"' target='_blank' ></a>")
				.append(json[i].name))
				.append($("<div class= tweet_time></div>")
				.append(json[i].post_datetime)))

				.append($("<div class=tweet_txt></div>")
				.append(json[i].txt)

				))
				.prependTo($("#article"+ real_id));


			//favを押した時に色を変えるイベントを追加。
			$("#"+real_id+"fav_button"+json[i].tw_id).live("click",
				fav_click(json[i].tw_id)
			);

		};
		
		//tweet_txt　でurl、hash、@のものがあったら、リンク付きに置換
		$(".tweet_txt").each(function(){
			var txt = $(this).text();
			txt = txt .replace(/(http:\/\/[\x21-\x7e]+)/gi,'<a class ="tweet_url" href="$1" target="_blank">$1</a>')
					  .replace(/#(\w+)/g,'<a class ="tweet_hash" href="http://twitter.com/#search?q=%23$1" target="_blank">#$1</a>')
					  .replace(/@(\w+)/g,'<a class ="tweet_at" href="http://twitter.com/$1" target="_blank">@$1</a>');
			$(this).html(txt);
		});
		
		//a要素にhoverした時にunderline付ける
		addHover();
		
			//ループ終了
		};

		
		
		//押した時に現状の位置を保持して見やすくする。
		$("#article"+real_id)
			.scrollTop($("#article"+real_id)
			.children("div")
			.eq(count[real_id])
			.position().top);
		

		//アーティクル内のtweet数も更新
		TweetsInArticleLength[real_id] = $("#article"+real_id+">div.tweet").length;
	
	};
	
};

//下の古いtweetの表示をクリックしたときの処理
function ClickOldTweetEvent(real_id){ 
	$("#oldTweet"+real_id).live("click",function(event){
		$(this).remove();
		initTweetsByGroup(real_id,TweetsInArticleLength[real_id]+count[real_id],10,callbackClickOldTweetEvent);
		return false;	
	});
};

//TLALLの下の古いtweetの表示をクリックしたときの処理
function ClickOldTweetEventTLALL(){
	$("#oldTweet0").live("click",function(event){
		$(this).remove();
		initTweetsTLALL(TweetsInArticleLength[0]+count[0],10,callbackClickOldTweetEvent);
		return false;
	});	
};

//FAVの下の古いtweetの表示をクリックしたときの処理
function ClickOldTweetEventFav(){
	$("#oldTweet1").live("click",function(event){
		$(this).remove();
		initTweetsFav(TweetsInArticleLength[1]+count[1],10,callbackClickOldTweetEvent);
		return false;
	});	
};


function callbackClickOldTweetEvent(real_id){
	
	return function(json,status){
			var indexOld = 0;
			for(i = 0;i < json.length ;i++){
				if(json[i].tw_id >= idMin[real_id]){
					indexOld++;
				}else{
					break;
				}
			}
			
			for (var i =indexOld; i<json.length;  i++ ){

				appendTweets(i,real_id,json);
			};

	//更新
	TweetsInArticleLength[real_id] = $("#article"+real_id+">div.tweet").length;
	idMin[real_id] = $("#article"+real_id+">div.tweet:last-child").attr("id");

	//もう一回一連の処理(1番下に表示追加）を行う
	ShowOldTweets(real_id,json)
	
	};
	
};

//10秒に1回やる処理
function setTimer() {
	setInterval(function(){
		CheckNewTweets();
},5000)};



