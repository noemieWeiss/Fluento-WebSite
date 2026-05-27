CREATE DATABASE IF NOT EXISTS fluento;
USE fluento;

CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  role         ENUM('student', 'admin') DEFAULT 'student',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE languages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(45) NOT NULL,
  code       VARCHAR(10)  NOT NULL,
  flag_emoji VARCHAR(10)
);

CREATE TABLE levels (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  language_id  INT NOT NULL,
  level_number INT NOT NULL,
  title        VARCHAR(100),
  FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE TABLE lessons (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  level_id      INT NOT NULL,
  lesson_number INT NOT NULL,
  title         VARCHAR(100),
  FOREIGN KEY (level_id) REFERENCES levels(id)
);

CREATE TABLE words (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id        INT NOT NULL,
  word             VARCHAR(100) NOT NULL,
  translation      VARCHAR(100) NOT NULL,
  image_url        VARCHAR(255),
  audio_url        VARCHAR(255),
  example_sentence TEXT,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE user_languages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  language_id INT NOT NULL,
  started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id),
  FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE TABLE user_progress (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  lesson_id    INT NOT NULL,
  score        INT DEFAULT 0,
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id)   REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
