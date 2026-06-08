USE fluento;

-- ─── Clean slate (order matters for FK) ───────────────────────────────────────
DELETE FROM user_progress;
DELETE FROM user_languages;
DELETE FROM words;
DELETE FROM lessons;
DELETE FROM levels;
DELETE FROM languages;
DELETE FROM passwords;
DELETE FROM users;

ALTER TABLE users          AUTO_INCREMENT = 1;
ALTER TABLE passwords      AUTO_INCREMENT = 1;
ALTER TABLE languages      AUTO_INCREMENT = 1;
ALTER TABLE levels         AUTO_INCREMENT = 1;
ALTER TABLE lessons        AUTO_INCREMENT = 1;
ALTER TABLE words          AUTO_INCREMENT = 1;
ALTER TABLE user_languages AUTO_INCREMENT = 1;
ALTER TABLE user_progress  AUTO_INCREMENT = 1;

-- ─── Languages (6 total) ──────────────────────────────────────────────────────
INSERT INTO languages (name, code, flag_emoji) VALUES
  ('English', 'en', '🇬🇧'),   -- 1
  ('Spanish', 'es', '🇪🇸'),   -- 2
  ('French',  'fr', '🇫🇷'),   -- 3
  ('German',  'de', '🇩🇪'),   -- 4
  ('Italian', 'it', '🇮🇹'),   -- 5
  ('Japanese','ja', '🇯🇵');   -- 6

-- ─── Levels ───────────────────────────────────────────────────────────────────
-- English
INSERT INTO levels (language_id, level_number, title) VALUES
  (1, 1, 'Beginner'),      -- 1
  (1, 2, 'Elementary'),    -- 2
  (1, 3, 'Intermediate');  -- 3

-- Spanish
INSERT INTO levels (language_id, level_number, title) VALUES
  (2, 1, 'Principiante'),  -- 4
  (2, 2, 'Elemental'),     -- 5
  (2, 3, 'Intermedio');    -- 6

-- French
INSERT INTO levels (language_id, level_number, title) VALUES
  (3, 1, 'Débutant'),      -- 7
  (3, 2, 'Élémentaire');   -- 8

-- German
INSERT INTO levels (language_id, level_number, title) VALUES
  (4, 1, 'Anfänger'),      -- 9
  (4, 2, 'Grundstufe');    -- 10

-- Italian
INSERT INTO levels (language_id, level_number, title) VALUES
  (5, 1, 'Principiante'),  -- 11
  (5, 2, 'Elementare');    -- 12

-- Japanese
INSERT INTO levels (language_id, level_number, title) VALUES
  (6, 1, 'Beginner');      -- 13

-- ─── Lessons ──────────────────────────────────────────────────────────────────
-- English Beginner (level 1)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (1, 1, 'Colors'),         -- 1
  (1, 2, 'Animals'),        -- 2
  (1, 3, 'Numbers'),        -- 3
  (1, 4, 'Greetings'),      -- 4
  (1, 5, 'Food & Drinks');  -- 5

-- English Elementary (level 2)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (2, 1, 'Family'),         -- 6
  (2, 2, 'Weather'),        -- 7
  (2, 3, 'Travel'),         -- 8
  (2, 4, 'Hobbies');        -- 9

-- English Intermediate (level 3)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (3, 1, 'Business'),       -- 10
  (3, 2, 'Technology'),     -- 11
  (3, 3, 'Culture');        -- 12

-- Spanish Principiante (level 4)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (4, 1, 'Colores'),        -- 13
  (4, 2, 'Animales'),       -- 14
  (4, 3, 'Números'),        -- 15
  (4, 4, 'Saludos');        -- 16

-- Spanish Elemental (level 5)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (5, 1, 'Familia'),        -- 17
  (5, 2, 'Comida'),         -- 18
  (5, 3, 'Viajes');         -- 19

-- French Débutant (level 7)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (7, 1, 'Couleurs'),       -- 20
  (7, 2, 'Animaux'),        -- 21
  (7, 3, 'Chiffres'),       -- 22
  (7, 4, 'Salutations');    -- 23

-- German Anfänger (level 9)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (9, 1, 'Farben'),         -- 24
  (9, 2, 'Tiere'),          -- 25
  (9, 3, 'Zahlen'),         -- 26
  (9, 4, 'Begrüßungen');    -- 27

-- Italian Principiante (level 11)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (11, 1, 'Colori'),        -- 28
  (11, 2, 'Animali'),       -- 29
  (11, 3, 'Numeri');        -- 30

-- Japanese Beginner (level 13)
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (13, 1, 'Hiragana'),      -- 31
  (13, 2, 'Greetings'),     -- 32
  (13, 3, 'Numbers');       -- 33

-- ─── Words (sample for lessons 1-5) ──────────────────────────────────────────
INSERT INTO words (lesson_id, word, translation, example_sentence) VALUES
  (1,'Red','אדום','The apple is red.'),
  (1,'Blue','כחול','The sky is blue.'),
  (1,'Green','ירוק','The tree is green.'),
  (1,'Yellow','צהוב','The sun is yellow.'),
  (1,'Black','שחור','The night is black.'),
  (2,'Cat','חתול','The cat is sleeping.'),
  (2,'Dog','כלב','The dog is running.'),
  (2,'Bird','ציפור','The bird is singing.'),
  (2,'Fish','דג','The fish is in the sea.'),
  (2,'Horse','סוס','The horse is fast.'),
  (3,'One','אחד','I have one cat.'),
  (3,'Two','שתיים','I have two dogs.'),
  (3,'Three','שלוש','I have three birds.'),
  (3,'Four','ארבע','There are four chairs.'),
  (3,'Five','חמש','She has five books.'),
  (4,'Hello','שלום','Hello, how are you?'),
  (4,'Goodbye','להתראות','Goodbye, see you tomorrow.'),
  (4,'Please','בבקשה','Please help me.'),
  (4,'Thank you','תודה','Thank you very much.'),
  (5,'Water','מים','I drink water.'),
  (5,'Bread','לחם','I eat bread.'),
  (5,'Coffee','קפה','I love coffee.'),
  (5,'Apple','תפוח','An apple a day.');

-- ─── Users (admin + 15 students) ─────────────────────────────────────────────
INSERT INTO users (name, email, role, status) VALUES
  ('Noemie Weiss',    'admin@fluento.com',    'admin',   'active'),   -- 1
  ('Alice Cohen',     'alice@fluento.com',    'student', 'active'),   -- 2
  ('Bob Levi',        'bob@fluento.com',      'student', 'active'),   -- 3
  ('Dana Mizrahi',    'dana@fluento.com',     'student', 'active'),   -- 4
  ('Eli Shapiro',     'eli@fluento.com',      'student', 'active'),   -- 5
  ('Fatima Hassan',   'fatima@fluento.com',   'student', 'active'),   -- 6
  ('Gabriel Silva',   'gabriel@fluento.com',  'student', 'active'),   -- 7
  ('Hannah Berg',     'hannah@fluento.com',   'student', 'active'),   -- 8
  ('Ivan Petrov',     'ivan@fluento.com',     'student', 'active'),   -- 9
  ('Julia Martin',    'julia@fluento.com',    'student', 'active'),   -- 10
  ('Kobi Peretz',     'kobi@fluento.com',     'student', 'suspended'),-- 11
  ('Lena Müller',     'lena@fluento.com',     'student', 'active'),   -- 12
  ('Marco Rossi',     'marco@fluento.com',    'student', 'active'),   -- 13
  ('Nina Tanaka',     'nina@fluento.com',     'student', 'active'),   -- 14
  ('Omar Khalil',     'omar@fluento.com',     'student', 'active'),   -- 15
  ('Priya Patel',     'priya@fluento.com',    'student', 'active'),   -- 16
  ('Rafael Torres',   'rafael@fluento.com',   'student', 'active');   -- 17

-- ─── Passwords (all: Student1! — real bcrypt hash) ────────────────────────────
INSERT INTO passwords (user_id, password_hash) VALUES
  (1,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- admin123 placeholder
  (2,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (3,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (4,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (5,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (6,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (7,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (8,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (9,  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (10, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (11, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (12, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (13, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (14, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (15, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (16, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
  (17, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password

-- ─── User Languages ───────────────────────────────────────────────────────────
INSERT INTO user_languages (user_id, language_id) VALUES
  (2,  1), (2,  3),        -- Alice: English + French
  (3,  2),                 -- Bob: Spanish
  (4,  1), (4,  4),        -- Dana: English + German
  (5,  1),                 -- Eli: English
  (6,  2), (6,  5),        -- Fatima: Spanish + Italian
  (7,  2),                 -- Gabriel: Spanish
  (8,  3), (8,  4),        -- Hannah: French + German
  (9,  1), (9,  6),        -- Ivan: English + Japanese
  (10, 3),                 -- Julia: French
  (11, 1),                 -- Kobi: English (suspended)
  (12, 4),                 -- Lena: German
  (13, 5),                 -- Marco: Italian
  (14, 6),                 -- Nina: Japanese
  (15, 2), (15, 3),        -- Omar: Spanish + French
  (16, 1), (16, 5),        -- Priya: English + Italian
  (17, 2);                 -- Rafael: Spanish

-- ─── User Progress (varied scores, spread across past 7 days) ────────────────
INSERT INTO user_progress (user_id, lesson_id, score, completed, completed_at) VALUES
  -- Alice (English advanced + French starter)
  (2, 1,  95, TRUE,  NOW() - INTERVAL 6 DAY),
  (2, 2,  88, TRUE,  NOW() - INTERVAL 5 DAY),
  (2, 3,  92, TRUE,  NOW() - INTERVAL 4 DAY),
  (2, 4,  85, TRUE,  NOW() - INTERVAL 3 DAY),
  (2, 5,  78, TRUE,  NOW() - INTERVAL 2 DAY),
  (2, 6,  70, TRUE,  NOW() - INTERVAL 1 DAY),
  (2, 7,  65, TRUE,  NOW()),
  (2, 20, 55, TRUE,  NOW() - INTERVAL 1 DAY),
  (2, 21,  0, FALSE, NULL),

  -- Bob (Spanish)
  (3, 13, 80, TRUE,  NOW() - INTERVAL 5 DAY),
  (3, 14, 72, TRUE,  NOW() - INTERVAL 4 DAY),
  (3, 15, 68, TRUE,  NOW() - INTERVAL 2 DAY),
  (3, 16,  0, FALSE, NULL),

  -- Dana (English + German)
  (4, 1,  90, TRUE,  NOW() - INTERVAL 6 DAY),
  (4, 2,  85, TRUE,  NOW() - INTERVAL 5 DAY),
  (4, 3,  60, TRUE,  NOW() - INTERVAL 3 DAY),
  (4, 24, 75, TRUE,  NOW() - INTERVAL 4 DAY),
  (4, 25, 80, TRUE,  NOW() - INTERVAL 2 DAY),
  (4, 26,  0, FALSE, NULL),

  -- Eli (English, struggling)
  (5, 1,  45, FALSE, NULL),
  (5, 2,  30, FALSE, NULL),
  (5, 3,  20, FALSE, NULL),

  -- Fatima (Spanish + Italian, very active)
  (6, 13, 95, TRUE,  NOW() - INTERVAL 6 DAY),
  (6, 14, 90, TRUE,  NOW() - INTERVAL 5 DAY),
  (6, 15, 88, TRUE,  NOW() - INTERVAL 4 DAY),
  (6, 16, 82, TRUE,  NOW() - INTERVAL 3 DAY),
  (6, 17, 78, TRUE,  NOW() - INTERVAL 2 DAY),
  (6, 28, 91, TRUE,  NOW() - INTERVAL 1 DAY),
  (6, 29, 85, TRUE,  NOW()),

  -- Gabriel (Spanish)
  (7, 13, 70, TRUE,  NOW() - INTERVAL 3 DAY),
  (7, 14, 65, TRUE,  NOW() - INTERVAL 2 DAY),
  (7, 15, 55, TRUE,  NOW() - INTERVAL 1 DAY),
  (7, 16, 48, FALSE, NULL),

  -- Hannah (French + German)
  (8, 20, 88, TRUE,  NOW() - INTERVAL 6 DAY),
  (8, 21, 82, TRUE,  NOW() - INTERVAL 5 DAY),
  (8, 22, 76, TRUE,  NOW() - INTERVAL 3 DAY),
  (8, 23, 71, TRUE,  NOW() - INTERVAL 1 DAY),
  (8, 24, 90, TRUE,  NOW() - INTERVAL 4 DAY),
  (8, 25, 85, TRUE,  NOW() - INTERVAL 2 DAY),
  (8, 26,  0, FALSE, NULL),

  -- Ivan (English + Japanese)
  (9, 1,  75, TRUE,  NOW() - INTERVAL 5 DAY),
  (9, 2,  70, TRUE,  NOW() - INTERVAL 4 DAY),
  (9, 31, 60, TRUE,  NOW() - INTERVAL 3 DAY),
  (9, 32, 55, TRUE,  NOW() - INTERVAL 1 DAY),
  (9, 33,  0, FALSE, NULL),

  -- Julia (French, moderate)
  (10, 20, 78, TRUE,  NOW() - INTERVAL 4 DAY),
  (10, 21, 72, TRUE,  NOW() - INTERVAL 3 DAY),
  (10, 22, 65, TRUE,  NOW() - INTERVAL 1 DAY),
  (10, 23,  0, FALSE, NULL),

  -- Kobi (suspended, some old progress)
  (11, 1,  50, TRUE,  NOW() - INTERVAL 6 DAY),
  (11, 2,  30, FALSE, NULL),

  -- Lena (German, doing well)
  (12, 24, 92, TRUE,  NOW() - INTERVAL 5 DAY),
  (12, 25, 87, TRUE,  NOW() - INTERVAL 4 DAY),
  (12, 26, 80, TRUE,  NOW() - INTERVAL 2 DAY),
  (12, 27, 75, TRUE,  NOW()),

  -- Marco (Italian)
  (13, 28, 85, TRUE,  NOW() - INTERVAL 3 DAY),
  (13, 29, 78, TRUE,  NOW() - INTERVAL 2 DAY),
  (13, 30, 70, TRUE,  NOW() - INTERVAL 1 DAY),

  -- Nina (Japanese)
  (14, 31, 88, TRUE,  NOW() - INTERVAL 4 DAY),
  (14, 32, 82, TRUE,  NOW() - INTERVAL 2 DAY),
  (14, 33, 75, TRUE,  NOW()),

  -- Omar (Spanish + French)
  (15, 13, 90, TRUE,  NOW() - INTERVAL 6 DAY),
  (15, 14, 85, TRUE,  NOW() - INTERVAL 5 DAY),
  (15, 15, 80, TRUE,  NOW() - INTERVAL 3 DAY),
  (15, 20, 75, TRUE,  NOW() - INTERVAL 4 DAY),
  (15, 21, 68, TRUE,  NOW() - INTERVAL 2 DAY),
  (15, 22,  0, FALSE, NULL),

  -- Priya (English + Italian, very strong)
  (16, 1,  98, TRUE,  NOW() - INTERVAL 6 DAY),
  (16, 2,  95, TRUE,  NOW() - INTERVAL 5 DAY),
  (16, 3,  92, TRUE,  NOW() - INTERVAL 4 DAY),
  (16, 4,  90, TRUE,  NOW() - INTERVAL 3 DAY),
  (16, 5,  88, TRUE,  NOW() - INTERVAL 2 DAY),
  (16, 6,  85, TRUE,  NOW() - INTERVAL 1 DAY),
  (16, 28, 91, TRUE,  NOW() - INTERVAL 3 DAY),
  (16, 29, 87, TRUE,  NOW()),

  -- Rafael (Spanish)
  (17, 13, 82, TRUE,  NOW() - INTERVAL 4 DAY),
  (17, 14, 76, TRUE,  NOW() - INTERVAL 3 DAY),
  (17, 15, 70, TRUE,  NOW() - INTERVAL 1 DAY),
  (17, 16, 65, TRUE,  NOW());
