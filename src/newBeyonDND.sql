-- Create database and select it
CREATE DATABASE IF NOT EXISTS BeyonDND;
USE BeyonDND;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS session_characters;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS campaign_characters;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS verification_codes;
DROP TABLE IF EXISTS character_class;
DROP TABLE IF EXISTS user_characters;
DROP TABLE IF EXISTS `character`;
DROP TABLE IF EXISTS `class`;
DROP TABLE IF EXISTS race;
DROP TABLE IF EXISTS `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- USER
CREATE TABLE `user` (
                        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                        display_name VARCHAR(40) NOT NULL,
                        email VARCHAR(64) UNIQUE NOT NULL,
                        password VARCHAR(128) NOT NULL,
                        role ENUM('user','admin') NOT NULL DEFAULT 'user',
                        gdpr_consent DATETIME,
                        banned BOOL NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- RACES
CREATE TABLE race (
                      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(40) NOT NULL,
                      description VARCHAR(256) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CLASSES
CREATE TABLE `class` (
                         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(40) NOT NULL,
                         description VARCHAR(256) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CHARACTERS
CREATE TABLE `character` (
                             id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(40) NOT NULL,
                             handle VARCHAR(50) NOT NULL,
                             class_id INT UNSIGNED NOT NULL,
                             level INT UNSIGNED NOT NULL DEFAULT 1,
                             race_id INT UNSIGNED NOT NULL,
                             image VARCHAR(128),
                             owner_id INT UNSIGNED NOT NULL,
                             bio VARCHAR(512),
                             private BOOL NOT NULL DEFAULT TRUE,
                             FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE,
                             FOREIGN KEY (owner_id) REFERENCES `user`(id) ON UPDATE CASCADE,
                             FOREIGN KEY (class_id) REFERENCES class(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- USER_CHARACTERS (Many-to-Many: user <-> character)
CREATE TABLE user_characters (
                                 character_id INT UNSIGNED NOT NULL,
                                 user_id INT UNSIGNED NOT NULL,
                                 PRIMARY KEY (character_id, user_id),
                                 FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                                 FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- VERIFICATION_CODES
CREATE TABLE verification_codes (
                                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                    user_id INT UNSIGNED NOT NULL,
                                    code VARCHAR(64) NOT NULL,
                                    expiration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PAYMENTS
CREATE TABLE payments (
                          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          user_id INT UNSIGNED,
                          paid TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          reason VARCHAR(150),
                          amount BIGINT,
                          FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CAMPAIGN
CREATE TABLE campaign (
                          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50) NOT NULL,
                          signups_open BOOL NOT NULL DEFAULT FALSE,
                          dungeon_master_id INT UNSIGNED NOT NULL,
                          max_players INT NOT NULL DEFAULT 4,
                          banner VARCHAR(255) NULL,
                          outline TEXT NOT NULL,
                          public BOOL DEFAULT FALSE,
                          invite VARCHAR(7) DEFAULT NULL,
                          FOREIGN KEY (dungeon_master_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CAMPAIGN_CHARACTERS (Many-to-Many: campaign <-> character)
CREATE TABLE campaign_characters (
                                     campaign_id INT UNSIGNED NOT NULL,
                                     character_id INT UNSIGNED NOT NULL,
                                     status ENUM('invited', 'joined', 'kicked', 'abandoned') NULL DEFAULT 'invited',
                                     PRIMARY KEY (campaign_id, character_id),
                                     FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE CASCADE,
                                     FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SESSION
CREATE TABLE session (
                         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         campaign_id INT UNSIGNED NOT NULL,
                         title VARCHAR(50) NOT NULL,
                         excerpt TEXT,
                         writeup TEXT,
                         session_date DATETIME,
                         signup_deadline DATETIME,
                         FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SESSION_CHARACTERS (Many-to-Many: session <-> character)
CREATE TABLE session_characters (
                                    session_id INT UNSIGNED NOT NULL,
                                    character_id INT UNSIGNED NOT NULL,
                                    PRIMARY KEY (session_id, character_id),
                                    FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
                                    FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- MESSAGES
CREATE TABLE messages (
                          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          message TEXT NOT NULL,
                          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          campaign_id INT UNSIGNED NOT NULL,
                          author_id INT UNSIGNED NOT NULL,
                          FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE CASCADE,
                          FOREIGN KEY (author_id) REFERENCES `character`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- POSTS
CREATE TABLE posts (
                       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                       author_character_id INT UNSIGNED NOT NULL,
                       author_user_id INT UNSIGNED NOT NULL,
                       body VARCHAR(255) NOT NULL,
                       FOREIGN KEY (author_character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                       FOREIGN KEY (author_user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- POST_LIKES
CREATE TABLE post_likes (
                            character_id INT UNSIGNED NOT NULL,
                            post_id INT UNSIGNED NOT NULL,
                            PRIMARY KEY (character_id, post_id),
                            FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PREMADE_CHARACTER
CREATE TABLE premade_character (
                                   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                   name VARCHAR(40) NOT NULL,
                                   race_id INT UNSIGNED NOT NULL,
                                   class_id INT UNSIGNED NOT NULL,
                                   description VARCHAR(512) NOT NULL,
                                   image VARCHAR(128),
                                   FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE,
                                   FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- REPORTS
CREATE TABLE reports (
                         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         author_id INT UNSIGNED,
                         content_type ENUM('user','character','campaign','session','message') NOT NULL,
                         content_id INT UNSIGNED,
                         reason VARCHAR(32),
                         user_description VARCHAR(256),
                         status ENUM('active', 'user_banned', 'content_removed', 'ignored') NOT NULL DEFAULT 'active',
                         FOREIGN KEY (author_id) REFERENCES `user`(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
