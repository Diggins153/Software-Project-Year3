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
                        is_paying BOOLEAN DEFAULT FALSE,
                        last_consent_date DATETIME,
                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- RACES
CREATE TABLE race (
                      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(40) NOT NULL,
                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CLASSES
CREATE TABLE `class` (
                         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(40) NOT NULL,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CHARACTERS
CREATE TABLE `character` (
                             id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(40) NOT NULL,
                             handle VARCHAR(50) NOT NULL,
                             race_id INT UNSIGNED NOT NULL,
                             image VARCHAR(128),
                             owner_id INT UNSIGNED NOT NULL,
                             created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE,
                             FOREIGN KEY (owner_id) REFERENCES `user`(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- USER_CHARACTERS (Many-to-Many: user <-> character)
CREATE TABLE user_characters (
                                 character_id INT UNSIGNED NOT NULL,
                                 user_id INT UNSIGNED NOT NULL,
                                 PRIMARY KEY (character_id, user_id),
                                 FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                                 FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CHARACTER_CLASS (Many-to-Many: character <-> class)
CREATE TABLE character_class (
                                 character_id INT UNSIGNED NOT NULL,
                                 class_id INT UNSIGNED NOT NULL,
                                 level INT NOT NULL DEFAULT '1',
                                 PRIMARY KEY (character_id, class_id),
                                 FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                                 FOREIGN KEY (class_id) REFERENCES `class`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- VERIFICATION_CODES
CREATE TABLE verification_codes (
                                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                    user_id INT UNSIGNED NOT NULL,
                                    code VARCHAR(64) NOT NULL,
                                    expiration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- PAYMENTS
CREATE TABLE payments (
                          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          user_id INT UNSIGNED NOT NULL,
                          paid TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          reason VARCHAR(150),
                          amount BIGINT,
                          FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CAMPAIGN
CREATE TABLE campaign (
                          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50) NOT NULL,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          signups_open TINYINT(1) NOT NULL DEFAULT '0',
                          dungeon_master_id INT UNSIGNED NOT NULL,
                          max_players INT NOT NULL DEFAULT '4',
                          banner VARCHAR(255) NOT NULL,
                          outline TEXT NOT NULL,
                          FOREIGN KEY (dungeon_master_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CAMPAIGN_CHARACTERS (Many-to-Many: campaign <-> character)
CREATE TABLE campaign_characters (
                                     campaign_id INT UNSIGNED NOT NULL,
                                     character_id INT UNSIGNED NOT NULL,
                                     PRIMARY KEY (campaign_id, character_id),
                                     FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE CASCADE,
                                     FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- SESSION_CHARACTERS (Many-to-Many: session <-> character)
CREATE TABLE session_characters (
                                    session_id INT UNSIGNED NOT NULL,
                                    character_id INT UNSIGNED NOT NULL,
                                    PRIMARY KEY (session_id, character_id),
                                    FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
                                    FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- MESSAGES
CREATE TABLE messages (
                          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          message VARCHAR(256) NOT NULL,
                          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                          campaign_id INT UNSIGNED NOT NULL,
                          FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- POSTS
CREATE TABLE posts (
                       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                       author_character_id INT UNSIGNED NOT NULL,
                       authd_user_id INT UNSIGNED NOT NULL,
                       body VARCHAR(255) NOT NULL,
                       FOREIGN KEY (author_character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                       FOREIGN KEY (authd_user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- POST_LIKES
CREATE TABLE post_likes (
                            character_id INT UNSIGNED NOT NULL,
                            post_id INT UNSIGNED NOT NULL,
                            PRIMARY KEY (character_id, post_id),
                            FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE,
                            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;