USE apisnote;

DROP TABLE IF EXISTS canvases;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS postits;
DROP TABLE IF EXISTS links;

CREATE TABLE IF NOT EXISTS canvases(
  id  bigint NOT NULL AUTO_INCREMENT
, name varchar(50) NOT NULL
, description text NOT NULL
, add_datetime datetime NOT NULL
, mod_datetime datetime NOT NULL
, deleted int(1) NOT NULL
, PRIMARY KEY (id)
)ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS users(
  id  bigint NOT NULL AUTO_INCREMENT
, name varchar(50) NOT NULL
, description text NOT NULL
, add_datetime datetime NOT NULL
, mod_datetime datetime NOT NULL
, deleted int(1) NOT NULL
, PRIMARY KEY (id)
)ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS postits(
  id  bigint NOT NULL AUTO_INCREMENT
, canvas_id bigint NOT NULL 
, user_id bigint NOT NULL 
, session_id DECIMAL(20,0) NOT NULL
, postit_id bigint NOT NULL
, passage text NOT NULL
, color_code int(2) NOT NULL
, description text NOT NULL
, postop int NOT NULL
, posleft int NOT NULL
, add_datetime datetime NOT NULL
, mod_datetime datetime NOT NULL
, deleted int(1) NOT NULL
, PRIMARY KEY (id)
)ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS links(
  id  bigint NOT NULL AUTO_INCREMENT
, postit_id bigint NOT NULL 
, postit_id2 bigint NOT NULL 
, add_datetime datetime NOT NULL
, mod_datetime datetime NOT NULL
, deleted int(1) NOT NULL
, PRIMARY KEY (id)
)ENGINE=MyISAM DEFAULT CHARSET=utf8;


