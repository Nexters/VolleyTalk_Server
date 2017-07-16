#! /bin/bash
echo "Create DB and Table for VolleyTalk"
echo "=================================="
echo ""
echo "Input your MySql account"
read account
echo ""
echo "Input your MySql password"
read password

mysql -u $account -p $password -e "
create database volleytalk;

CREATE TABLE volleytalk.tb_userinfo ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	userid               varchar(50) NOT NULL  ,
	nickname             varchar(100)    ,
	email                varchar(100)    ,
	profileimg_thumb     varchar(100)    ,
	bgimg                varchar(100)    ,
	regdate              datetime   DEFAULT CURRENT_TIMESTAMP ,
	likecount            int   DEFAULT 0 ,
	commentcount         int   DEFAULT 0 ,
	PRIMARY KEY ( seq, userid ),
	UNIQUE KEY ( userid )
 );


CREATE TABLE volleytalk.tb_like ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	liketype             varchar(10)  NOT NULL  ,
	typeseq              int  NOT NULL  ,
	userid               varchar(50)  NOT NULL  ,
	regdate              datetime   DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( userid ) REFERENCES volleytalk.tb_userinfo ( userid )
 );
CREATE INDEX idx_tb_like ON volleytalk.tb_like ( userid );


CREATE TABLE volleytalk.tb_team ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	name                 varchar(30)  NOT NULL  ,
	gender               varchar(1)  NOT NULL  ,
	extablish            varchar(10)  NOT NULL  ,
	homeground           varchar(10)  NOT NULL  ,
	likecount            int   DEFAULT 0 ,
	postcount            int   DEFAULT 0 ,
	PRIMARY KEY ( seq )
 );


 CREATE TABLE volleytalk.tb_team_posts ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	teamseq              int  NOT NULL  ,
	title                varchar(100)  NOT NULL  ,
	contents             varchar(1000)  NOT NULL  ,
	img_url              varchar(100)    ,
	img_url_thumb        varchar(100)    ,
	author               varchar(50)  NOT NULL  ,
	likecount            int    ,
	commentcount         int    ,
	regdate              datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( teamseq ) REFERENCES volleytalk.tb_team ( seq )
 );


CREATE TABLE volleytalk.tb_team_comments ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	postseq              int  NOT NULL  ,
	comment              varchar(100)  NOT NULL  ,
	author               varchar(50)  NOT NULL  ,
	regdate              datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( postseq ) REFERENCES volleytalk.tb_team_posts ( seq )
 );
CREATE INDEX idx_tb_comments ON volleytalk.tb_team_comments ( postseq );


CREATE TABLE volleytalk.tb_player ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	teamseq              int  NOT NULL  ,
	name                 varchar(10)  NOT NULL  ,
	birth                varchar(15)    ,
	physical             varchar(10)    ,
	position             varchar(10)    ,
	gender               varchar(1)  NOT NULL  ,
	likecount            int    ,
	postcount            int    ,
	profileimg_url       varchar(100)    ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( teamseq ) REFERENCES volleytalk.tb_team ( seq )
 );
CREATE INDEX idx_tb_player ON volleytalk.tb_player ( teamseq );


CREATE TABLE volleytalk.tb_player_posts ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	playerseq            int  NOT NULL  ,
	title                varchar(100)  NOT NULL  ,
	contents             varchar(1000)  NOT NULL  ,
	img_url              varchar(100)    ,
	img_url_thumb        varchar(100)    ,
	author               varchar(50)  NOT NULL  ,
	likecount            int    ,
	commentcount         int    ,
	regdate              datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( playerseq ) REFERENCES volleytalk.tb_player ( seq )
 );
CREATE INDEX idx_tb_posts_0 ON volleytalk.tb_player_posts ( playerseq );


CREATE TABLE volleytalk.tb_player_comments ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	postseq              int  NOT NULL  ,
	comment              varchar(100)  NOT NULL  ,
	author               varchar(50)  NOT NULL  ,
	regdate              datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( postseq ) REFERENCES volleytalk.tb_player_posts ( seq )
 );
CREATE INDEX idx_tb_comments_0 ON volleytalk.tb_player_comments ( postseq );


CREATE TABLE volleytalk.tb_cheering ( 
	seq                  int  NOT NULL  AUTO_INCREMENT,
	playerseq            int  NOT NULL  ,
	comment              varchar(100)  NOT NULL  ,
	author               varchar(50)  NOT NULL  ,
	regdate              datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY ( seq ),
	FOREIGN KEY ( playerseq ) REFERENCES volleytalk.tb_player ( seq )
 );
CREATE INDEX idx_tb_cheering ON volleytalk.tb_cheering ( playerseq );
"
echo ""
echo "=================================="
echo "Finish -- Create DB and Table for VolleyTalk "