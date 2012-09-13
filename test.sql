USE apisnote;
SET NAMES utf8;

INSERT INTO canvases(name,description,add_datetime,mod_datetime,deleted)
VALUES('テスト','テストをするためのカンバス',NOW(),NOW(),0);


INSERT INTO canvases(name,description,add_datetime,mod_datetime,deleted)
VALUES('テスト2','テストをするためのカンバス2',NOW(),NOW(),0);

INSERT INTO postits(canvas_id,passage,postit_id,color_code,description,postop,posleft,add_datetime,mod_datetime,deleted)
VALUES(1,'テストやで',1,1,'',100,300,NOW(),NOW(),0);
