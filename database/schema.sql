CREATE DATABASE IF NOT EXISTS fluento;
USE fluento;

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  role        ENUM('admin', 'student') DEFAULT 'student',
  status      ENUM('active', 'suspended') DEFAULT 'active',
  xp          INT DEFAULT 0,
  streak      INT DEFAULT 0,
  last_active TIMESTAMP NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Passwords ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS passwords (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Languages ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS languages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(45) NOT NULL,
  code       VARCHAR(10) NOT NULL,
  flag_emoji VARCHAR(10)
);

-- ─── Levels ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS levels (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  language_id  INT NOT NULL,
  level_number INT NOT NULL,
  title        VARCHAR(100),
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- ─── Lessons ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  level_id      INT NOT NULL,
  lesson_number INT NOT NULL,
  title         VARCHAR(100),
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
);

-- ─── Words ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS words (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id        INT NOT NULL,
  word             VARCHAR(100) NOT NULL,
  translation      VARCHAR(100) NOT NULL,
  image_url        VARCHAR(255),
  audio_url        VARCHAR(255),
  example_sentence TEXT,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ─── User Languages ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_languages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  language_id INT NOT NULL,
  started_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
);

-- ─── User Progress ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  lesson_id    INT NOT NULL,
  score        INT DEFAULT 0,
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ─── XP Transactions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_transactions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  amount     INT NOT NULL,
  reason     VARCHAR(255),
  given_by   INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (given_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Badges ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  emoji       VARCHAR(10),
  description TEXT,
  created_by  INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── User Badges ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id  INT NOT NULL,
  badge_id INT NOT NULL,
  given_by INT NOT NULL,
  given_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  FOREIGN KEY (given_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Warnings ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS warnings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  message    TEXT NOT NULL,
  given_by   INT NOT NULL,
  seen       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (given_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Surprise Quizzes ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS surprise_quizzes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  question   TEXT NOT NULL,
  option_a   VARCHAR(200) NOT NULL,
  option_b   VARCHAR(200) NOT NULL,
  option_c   VARCHAR(200) NOT NULL,
  option_d   VARCHAR(200) NOT NULL,
  correct    ENUM('a','b','c','d') NOT NULL,
  xp_reward  INT DEFAULT 20,
  active     BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Quiz Answers ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_answers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id    INT NOT NULL,
  user_id    INT NOT NULL,
  answer     ENUM('a','b','c','d') NOT NULL,
  correct    BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES surprise_quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Blocks ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blocks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  blocker_id INT NOT NULL,
  blocked_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
);
