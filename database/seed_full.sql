SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
USE fluento;

-- ─────────────────────────────────────────────────────────────────────────────
-- CLEAN SLATE
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM audit_logs;
DELETE FROM automation_rules;
DELETE FROM system_broadcasts;
DELETE FROM quiz_answers;
DELETE FROM student_profiles;
DELETE FROM surprise_quizzes;
DELETE FROM warnings;
DELETE FROM user_badges;
DELETE FROM badges;
DELETE FROM xp_transactions;
DELETE FROM user_progress;
DELETE FROM user_languages;
DELETE FROM blocks;
DELETE FROM words;
DELETE FROM lessons;
DELETE FROM levels;
DELETE FROM languages;
DELETE FROM passwords;
DELETE FROM roles_to_users;
DELETE FROM users;
DELETE FROM roles;
DELETE FROM route_permissions;

ALTER TABLE audit_logs        AUTO_INCREMENT = 1;
ALTER TABLE automation_rules  AUTO_INCREMENT = 1;
ALTER TABLE system_broadcasts AUTO_INCREMENT = 1;
ALTER TABLE users             AUTO_INCREMENT = 1;
ALTER TABLE passwords         AUTO_INCREMENT = 1;
ALTER TABLE languages         AUTO_INCREMENT = 1;
ALTER TABLE levels            AUTO_INCREMENT = 1;
ALTER TABLE lessons           AUTO_INCREMENT = 1;
ALTER TABLE words             AUTO_INCREMENT = 1;
ALTER TABLE user_languages    AUTO_INCREMENT = 1;
ALTER TABLE user_progress     AUTO_INCREMENT = 1;
ALTER TABLE xp_transactions   AUTO_INCREMENT = 1;
ALTER TABLE badges            AUTO_INCREMENT = 1;
ALTER TABLE user_badges       AUTO_INCREMENT = 1;
ALTER TABLE warnings          AUTO_INCREMENT = 1;
ALTER TABLE surprise_quizzes  AUTO_INCREMENT = 1;
ALTER TABLE quiz_answers       AUTO_INCREMENT = 1;
ALTER TABLE student_profiles  AUTO_INCREMENT = 1;
ALTER TABLE roles             AUTO_INCREMENT = 1;
ALTER TABLE roles_to_users    AUTO_INCREMENT = 1;
ALTER TABLE route_permissions AUTO_INCREMENT = 1;


-- ─────────────────────────────────────────────────────────────────────────────
-- ROLES & PERMISSIONS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO roles (name) VALUES
  ('admin'),   -- 1
  ('student'); -- 2

INSERT INTO route_permissions (prefix, role) VALUES
  ('/api/student',   'student'),
  ('/api/languages', 'student'),
  ('/api/lessons',   'student'),
  ('/api/progress',  'student'),
  ('/api/admin',     'admin'),
  ('/api/student',   'admin'),
  ('/api/languages', 'admin'),
  ('/api/lessons',   'admin'),
  ('/api/progress',  'admin'),
  ('/api/users',     'admin'),
  ('/api/rewards',   'admin');


-- ─────────────────────────────────────────────────────────────────────────────
-- LANGUAGES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO languages (name, code, flag_emoji) VALUES
  ('English', 'en', '🇬🇧'),   -- 1
  ('Spanish', 'es', '🇪🇸'),   -- 2
  ('French',  'fr', '🇫🇷'),   -- 3
  ('German',  'de', '🇩🇪'),   -- 4
  ('Italian', 'it', '🇮🇹'),   -- 5
  ('Japanese','ja', '🇯🇵');   -- 6


-- ─────────────────────────────────────────────────────────────────────────────
-- LEVELS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO levels (language_id, level_number, title) VALUES
  (1, 1, 'Beginner'),      -- 1
  (1, 2, 'Elementary'),    -- 2
  (1, 3, 'Intermediate'),  -- 3
  (2, 1, 'Principiante'),  -- 4
  (2, 2, 'Elemental'),     -- 5
  (2, 3, 'Intermedio'),    -- 6
  (3, 1, 'Débutant'),      -- 7
  (3, 2, 'Élémentaire'),   -- 8
  (4, 1, 'Anfänger'),      -- 9
  (4, 2, 'Grundstufe'),    -- 10
  (5, 1, 'Principiante'),  -- 11
  (5, 2, 'Elementare'),    -- 12
  (6, 1, 'Beginner');      -- 13


-- ─────────────────────────────────────────────────────────────────────────────
-- LESSONS
-- ─────────────────────────────────────────────────────────────────────────────
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


-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — English Beginner (lessons 1–5)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url) VALUES
  (1,1,'Red',   'אדום',      'The apple is red.',         'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'),
  (1,1,'Blue',  'כחול',      'The sky is blue.',          'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400'),
  (1,1,'Green', 'ירוק',      'The tree is green.',        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'),
  (1,2,'Yellow','צהוב',      'The sun is yellow.',        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'),
  (1,2,'Black', 'שחור',      'The night is black.',       'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400'),
  (2,1,'Cat',   'חתול',      'The cat is sleeping.',      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'),
  (2,1,'Dog',   'כלב',       'The dog is running.',       'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'),
  (2,1,'Bird',  'ציפור',     'The bird is singing.',      'https://images.unsplash.com/photo-1444664886087-685d411bf72d?w=400'),
  (2,2,'Fish',  'דג',        'The fish is in the sea.',   'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'),
  (2,2,'Horse', 'סוס',       'The horse is fast.',        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'),
  (3,1,'One',   'אחד',       'I have one cat.',           'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (3,1,'Two',   'שתיים',     'I have two dogs.',          'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (3,1,'Three', 'שלוש',      'I have three birds.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (3,2,'Four',  'ארבע',      'There are four chairs.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (3,2,'Five',  'חמש',       'She has five books.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (4,1,'Hello', 'שלום',      'Hello, how are you?',       'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (4,1,'Goodbye','להתראות',  'Goodbye, see you tomorrow.','https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (4,1,'Please','בבקשה',     'Please help me.',           'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (4,2,'Thank you','תודה',   'Thank you very much.',      'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (4,2,'Sorry', 'סליחה',     'I am sorry for being late.','https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (5,1,'Water', 'מים',       'I drink water.',            'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'),
  (5,1,'Bread', 'לחם',       'I eat bread.',              'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  (5,1,'Coffee','קפה',       'I love coffee.',            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
  (5,2,'Apple', 'תפוח',      'An apple a day.',           'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400'),
  (5,2,'Milk',  'חלב',       'I drink milk every morning.','https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400');

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — English Elementary (lessons 6–9)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url, audio_url) VALUES
  (6,1,'Mother',     'אמא',     'My mother is kind.',              'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400', 'https://www.soundjay.com/human/sounds/female-voice-1.mp3'),
  (6,1,'Father',     'אבא',     'My father works hard.',           'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', NULL),
  (6,1,'Sister',     'אחות',    'My sister is funny.',             'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400', NULL),
  (6,1,'Brother',    'אח',      'My brother is tall.',             'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', NULL),
  (6,1,'Baby',       'תינוק',   'The baby is sleeping.',           'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400', NULL),
  (6,2,'Grandmother','סבתא',    'My grandmother cooks well.',      'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400', NULL),
  (6,2,'Grandfather','סבא',     'My grandfather tells stories.',   'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', NULL),
  (6,2,'Uncle',      'דוד',     'My uncle lives far away.',        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', NULL),
  (6,2,'Aunt',       'דודה',    'My aunt bakes cakes.',            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', NULL),
  (6,2,'Cousin',     'בן דוד',  'My cousin visits on weekends.',   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', NULL),
  (7,1,'Sun',        'שמש',     'The sun is bright today.',        'https://images.unsplash.com/photo-1530569673472-307dc017a82d?w=400', NULL),
  (7,1,'Rain',       'גשם',     'The rain is cold.',               'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400', NULL),
  (7,1,'Snow',       'שלג',     'Children love snow.',             'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400', NULL),
  (7,1,'Wind',       'רוח',     'The wind is strong.',             'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=400', NULL),
  (7,1,'Cloud',      'ענן',     'A big cloud covers the sky.',     'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400', NULL),
  (7,2,'Hot',        'חם',      'It is very hot today.',           'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400', NULL),
  (7,2,'Cold',       'קר',      'It is cold in winter.',           'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400', NULL),
  (7,2,'Storm',      'סופה',    'A big storm is coming.',          'https://images.unsplash.com/photo-1461513099936-f9c1bdbdafdf?w=400', NULL),
  (7,2,'Rainbow',    'קשת בענן','I see a rainbow after rain.',     'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=400', NULL),
  (7,2,'Fog',        'ערפל',    'The fog makes it hard to see.',   'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400', NULL),
  (8,1,'Airport',    'שדה תעופה','We arrive at the airport early.','https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400', NULL),
  (8,1,'Hotel',      'מלון',    'The hotel is very comfortable.',  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', NULL),
  (8,1,'Passport',   'דרכון',   'Show me your passport please.',   'https://images.unsplash.com/photo-1547701096-da3b3ef89524?w=400', NULL),
  (8,1,'Ticket',     'כרטיס',   'I have a ticket to Paris.',       'https://images.unsplash.com/photo-1520095972714-909e91b038e5?w=400', NULL),
  (8,1,'Suitcase',   'מזוודה',  'My suitcase is heavy.',           'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', NULL),
  (8,2,'Train',      'רכבת',    'The train is fast.',              'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400', NULL),
  (8,2,'Bus',        'אוטובוס', 'The bus arrives at noon.',        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400', NULL),
  (8,2,'Map',        'מפה',     'I need a map of the city.',       'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400', NULL),
  (8,2,'Camera',     'מצלמה',   'I take photos with my camera.',   'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', NULL),
  (8,2,'Beach',      'חוף ים',  'The beach is beautiful.',         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', NULL),
  (9,1,'Music',      'מוזיקה',  'I love listening to music.',      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', NULL),
  (9,1,'Reading',    'קריאה',   'Reading is my favorite hobby.',   'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', NULL),
  (9,1,'Cooking',    'בישול',   'Cooking is fun and creative.',    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', NULL),
  (9,1,'Swimming',   'שחייה',   'I go swimming every morning.',    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400', NULL),
  (9,1,'Drawing',    'ציור',    'She loves drawing landscapes.',   'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', NULL),
  (9,2,'Dancing',    'ריקוד',   'We go dancing on Fridays.',       'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=400', NULL),
  (9,2,'Football',   'כדורגל',  'He plays football every weekend.','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', NULL),
  (9,2,'Hiking',     'טיולים',  'We go hiking in the mountains.',  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', NULL),
  (9,2,'Photography','צילום',   'Photography is an art form.',     'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400', NULL),
  (9,2,'Gaming',     'משחקי וידאו','Gaming helps me relax.',       'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400', NULL);

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — English Intermediate (lessons 10–12)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url, audio_url) VALUES
  (10,1,'Meeting',  'פגישה',     'We have a meeting at nine.',        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400', NULL),
  (10,1,'Contract', 'חוזה',      'Please sign the contract.',         'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400', NULL),
  (10,1,'Budget',   'תקציב',     'The budget is limited.',            'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400', NULL),
  (10,1,'Client',   'לקוח',      'The client is very happy.',         'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', NULL),
  (10,1,'Deadline', 'דדליין',    'The deadline is tomorrow.',         'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400', NULL),
  (10,2,'Profit',   'רווח',      'The company made a profit.',        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', NULL),
  (10,2,'Manager',  'מנהל',      'The manager approved the plan.',    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', NULL),
  (10,2,'Report',   'דוח',       'Write a report by Friday.',         'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', NULL),
  (10,2,'Invoice',  'חשבונית',   'Send the invoice to the client.',   'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400', NULL),
  (10,2,'Strategy', 'אסטרטגיה',  'We need a new strategy.',           'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', NULL),
  (11,1,'Computer', 'מחשב',      'I work on a computer all day.',     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NULL),
  (11,1,'Internet', 'אינטרנט',   'The internet connects the world.',  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', NULL),
  (11,1,'Phone',    'טלפון',     'My phone needs charging.',          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', NULL),
  (11,1,'Password', 'סיסמה',     'Use a strong password.',            'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=400', NULL),
  (11,1,'Website',  'אתר',       'Visit our website for more info.',  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400', NULL),
  (11,2,'Software', 'תוכנה',     'Update your software regularly.',   'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=400', NULL),
  (11,2,'Download', 'הורדה',     'Download the app for free.',        'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400', NULL),
  (11,2,'Screen',   'מסך',       'The screen is very bright.',        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', NULL),
  (11,2,'Battery',  'סוללה',     'The battery is almost empty.',      'https://images.unsplash.com/photo-1619651899498-fdc81d8c6c62?w=400', NULL),
  (11,2,'Keyboard', 'מקלדת',     'I type fast on a keyboard.',        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', NULL),
  (12,1,'Museum',   'מוזיאון',   'The museum is open today.',         'https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=400', NULL),
  (12,1,'Festival', 'פסטיבל',    'The festival lasts three days.',    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', NULL),
  (12,1,'Tradition','מסורת',     'This is an old tradition.',         'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400', NULL),
  (12,1,'Art',      'אמנות',     'Art expresses feelings.',           'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', NULL),
  (12,1,'Music',    'מוזיקה',    'Music brings people together.',     'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400', NULL),
  (12,2,'Dance',    'ריקוד',     'Dance is part of our culture.',     'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=400', NULL),
  (12,2,'Food',     'אוכל',      'Food reflects culture.',            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', NULL),
  (12,2,'Language', 'שפה',       'Language is part of identity.',     'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', NULL),
  (12,2,'History',  'היסטוריה',  'History teaches us lessons.',       'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400', NULL),
  (12,2,'Ceremony', 'טקס',       'The ceremony was beautiful.',       'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400', NULL);

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — Spanish (lessons 13–19)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url) VALUES
  (13,1,'Rojo',    'אדום',  'El cielo es rojo al atardecer.', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'),
  (13,1,'Azul',    'כחול',  'El mar es azul.',                'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400'),
  (13,1,'Verde',   'ירוק',  'La hierba es verde.',            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'),
  (13,2,'Amarillo','צהוב',  'El sol es amarillo.',            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'),
  (13,2,'Negro',   'שחור',  'La noche es negra.',             'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400'),
  (13,2,'Blanco',  'לבן',   'La nieve es blanca.',            'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400'),
  (14,1,'Gato',      'חתול', 'El gato duerme.',    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'),
  (14,1,'Perro',     'כלב',  'El perro corre.',    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'),
  (14,1,'Pájaro',    'ציפור','El pájaro canta.',   'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400'),
  (14,1,'Pez',       'דג',   'El pez nada.',       'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'),
  (14,1,'Caballo',   'סוס',  'El caballo es rápido.','https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'),
  (14,2,'León',      'אריה', 'El león es fuerte.', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400'),
  (14,2,'Elefante',  'פיל',  'El elefante es grande.','https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400'),
  (14,2,'Mono',      'קוף',  'El mono salta.',     'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400'),
  (14,2,'Serpiente', 'נחש',  'La serpiente es larga.','https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=400'),
  (14,2,'Mariposa',  'פרפר', 'La mariposa vuela.', 'https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=400'),
  (15,1,'Uno',    'אחד',   'Tengo un gato.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,1,'Dos',    'שתיים', 'Tengo dos perros.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,1,'Tres',   'שלוש',  'Hay tres sillas.',     'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,1,'Cuatro', 'ארבע',  'Hay cuatro mesas.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,1,'Cinco',  'חמש',   'Tengo cinco libros.',  'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,2,'Seis',   'שש',    'Son las seis.',        'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,2,'Siete',  'שבע',   'Hay siete días.',      'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,2,'Ocho',   'שמונה', 'Hay ocho meses.',      'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,2,'Nueve',  'תשע',   'Son las nueve.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (15,2,'Diez',   'עשר',   'Tengo diez dedos.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (16,1,'Hola',         'שלום',      'Hola, ¿cómo estás?',       'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,1,'Adiós',        'להתראות',   'Adiós, hasta mañana.',     'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,1,'Por favor',    'בבקשה',     'Por favor, ayúdame.',       'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,1,'Gracias',      'תודה',      'Muchas gracias.',           'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,1,'Buenos días',  'בוקר טוב',  'Buenos días, señor.',       'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,2,'Buenas noches','לילה טוב',  'Buenas noches a todos.',    'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,2,'¿Cómo estás?', 'מה שלומך?', '¿Cómo estás hoy?',         'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,2,'Bien',         'טוב',       'Estoy muy bien.',           'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,2,'Lo siento',    'סליחה',     'Lo siento mucho.',          'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (16,2,'De nada',      'על לא דבר', 'De nada, amigo.',           'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (17,1,'Madre',   'אמא',   'Mi madre es amable.',               'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400'),
  (17,1,'Padre',   'אבא',   'Mi padre trabaja mucho.',           'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
  (17,1,'Hermana', 'אחות',  'Mi hermana es divertida.',          'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'),
  (17,1,'Hermano', 'אח',    'Mi hermano es alto.',               'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'),
  (17,1,'Bebé',    'תינוק', 'El bebé duerme.',                   'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400'),
  (17,2,'Abuela',  'סבתא',  'Mi abuela cocina bien.',            'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400'),
  (17,2,'Abuelo',  'סבא',   'Mi abuelo cuenta historias.',       'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'),
  (17,2,'Tío',     'דוד',   'Mi tío vive lejos.',                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'),
  (17,2,'Tía',     'דודה',  'Mi tía hace pasteles.',             'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'),
  (17,2,'Primo',   'בן דוד','Mi primo viene los fines de semana.','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'),
  (18,1,'Agua',    'מים',   'Bebo agua.',        'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400'),
  (18,1,'Pan',     'לחם',   'Como pan.',         'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'),
  (18,1,'Arroz',   'אורז',  'El arroz está listo.','https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400'),
  (18,1,'Carne',   'בשר',   'La carne está deliciosa.','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400'),
  (18,1,'Fruta',   'פרי',   'La fruta es sana.', 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400'),
  (18,2,'Leche',   'חלב',   'La leche es blanca.','https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'),
  (18,2,'Huevo',   'ביצה',  'Como un huevo.',    'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400'),
  (18,2,'Queso',   'גבינה', 'El queso es amarillo.','https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400'),
  (18,2,'Verdura', 'ירק',   'Las verduras son sanas.','https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'),
  (18,2,'Café',    'קפה',   'Me gusta el café.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
  (19,1,'Aeropuerto','שדה תעופה','El aeropuerto está lejos.','https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'),
  (19,1,'Hotel',   'מלון',  'El hotel es cómodo.','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'),
  (19,1,'Pasaporte','דרכון','Necesito mi pasaporte.','https://images.unsplash.com/photo-1547701096-da3b3ef89524?w=400'),
  (19,1,'Maleta',  'מזוודה','Mi maleta es pesada.','https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400'),
  (19,1,'Tren',    'רכבת',  'El tren es rápido.','https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400'),
  (19,2,'Autobús', 'אוטובוס','El autobús llega al mediodía.','https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400'),
  (19,2,'Mapa',    'מפה',   'Necesito un mapa.','https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400'),
  (19,2,'Playa',   'חוף ים','La playa es hermosa.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'),
  (19,2,'Montaña', 'הר',    'La montaña es alta.','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'),
  (19,2,'Ciudad',  'עיר',   'La ciudad es grande.','https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400');

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — French (lessons 20–23)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url) VALUES
  (20,1,'Rouge',  'אדום',  'La pomme est rouge.',     'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'),
  (20,1,'Bleu',   'כחול',  'Le ciel est bleu.',       'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400'),
  (20,1,'Vert',   'ירוק',  'L''arbre est vert.',      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'),
  (20,1,'Jaune',  'צהוב',  'Le soleil est jaune.',    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'),
  (20,1,'Noir',   'שחור',  'La nuit est noire.',      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400'),
  (20,2,'Blanc',  'לבן',   'La neige est blanche.',   'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400'),
  (20,2,'Orange', 'כתום',  'L''orange est orange.',   'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'),
  (20,2,'Rose',   'ורוד',  'La fleur est rose.',      'https://images.unsplash.com/photo-1490750967868-88df5691cc3a?w=400'),
  (20,2,'Violet', 'סגול',  'Le raisin est violet.',   'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400'),
  (20,2,'Gris',   'אפור',  'Le ciel est gris.',       'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400'),
  (21,1,'Chat',   'חתול',  'Le chat dort.',            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'),
  (21,1,'Chien',  'כלב',   'Le chien court.',          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'),
  (21,1,'Oiseau', 'ציפור', 'L''oiseau chante.',        'https://images.unsplash.com/photo-1444664886087-685d411bf72d?w=400'),
  (21,1,'Poisson','דג',    'Le poisson nage.',         'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'),
  (21,1,'Cheval', 'סוס',   'Le cheval est rapide.',    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'),
  (21,2,'Lion',   'אריה',  'Le lion est fort.',        'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400'),
  (21,2,'Éléphant','פיל',  'L''éléphant est grand.',   'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400'),
  (21,2,'Lapin',  'ארנב',  'Le lapin est blanc.',      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400'),
  (21,2,'Vache',  'פרה',   'La vache mange de l''herbe.','https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400'),
  (21,2,'Cochon', 'חזיר',  'Le cochon est rose.',      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400'),
  (22,1,'Un',     'אחד',   'J''ai un chat.',           'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,1,'Deux',   'שתיים', 'J''ai deux chiens.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,1,'Trois',  'שלוש',  'Il y a trois chaises.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,1,'Quatre', 'ארבע',  'Il y a quatre tables.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,1,'Cinq',   'חמש',   'J''ai cinq livres.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,2,'Six',    'שש',    'Il est six heures.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,2,'Sept',   'שבע',   'Il y a sept jours.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,2,'Huit',   'שמונה', 'Il est huit heures.',      'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,2,'Neuf',   'תשע',   'J''ai neuf stylos.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (22,2,'Dix',    'עשר',   'J''ai dix doigts.',        'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (23,1,'Bonjour',          'שלום/בוקר טוב','Bonjour, comment allez-vous?',      'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,1,'Au revoir',        'להתראות',      'Au revoir, à demain.',              'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,1,'S''il vous plaît', 'בבקשה',        'S''il vous plaît, aidez-moi.',      'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,1,'Merci',            'תודה',         'Merci beaucoup.',                   'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,1,'Bonsoir',          'ערב טוב',      'Bonsoir à tous.',                   'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,2,'Bonne nuit',       'לילה טוב',     'Bonne nuit, dormez bien.',          'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,2,'Comment ça va?',   'מה שלומך?',    'Comment ça va aujourd''hui?',       'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,2,'Très bien',        'טוב מאוד',     'Je vais très bien.',                'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,2,'Excusez-moi',      'סליחה',        'Excusez-moi, où est la gare?',      'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (23,2,'De rien',          'בבקשה',        'De rien, avec plaisir.',            'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400');

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — German (lessons 24–27)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url) VALUES
  (24,1,'Rot',    'אדום',  'Der Apfel ist rot.',      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'),
  (24,1,'Blau',   'כחול',  'Der Himmel ist blau.',    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400'),
  (24,1,'Grün',   'ירוק',  'Der Baum ist grün.',      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'),
  (24,1,'Gelb',   'צהוב',  'Die Sonne ist gelb.',     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'),
  (24,1,'Schwarz','שחור',  'Die Nacht ist schwarz.',  'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400'),
  (24,2,'Weiß',   'לבן',   'Der Schnee ist weiß.',    'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400'),
  (24,2,'Orange', 'כתום',  'Die Orange ist orange.',  'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'),
  (24,2,'Rosa',   'ורוד',  'Die Blume ist rosa.',     'https://images.unsplash.com/photo-1490750967868-88df5691cc3a?w=400'),
  (24,2,'Lila',   'סגול',  'Die Traube ist lila.',    'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400'),
  (24,2,'Grau',   'אפור',  'Der Himmel ist grau.',    'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400'),
  (25,1,'Katze',  'חתול',  'Die Katze schläft.',      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'),
  (25,1,'Hund',   'כלב',   'Der Hund läuft.',         'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'),
  (25,1,'Vogel',  'ציפור', 'Der Vogel singt.',        'https://images.unsplash.com/photo-1444664886087-685d411bf72d?w=400'),
  (25,1,'Fisch',  'דג',    'Der Fisch schwimmt.',     'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'),
  (25,1,'Pferd',  'סוס',   'Das Pferd ist schnell.',  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'),
  (25,2,'Löwe',   'אריה',  'Der Löwe ist stark.',     'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400'),
  (25,2,'Elefant','פיל',   'Der Elefant ist groß.',   'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400'),
  (25,2,'Bär',    'דוב',   'Der Bär ist braun.',      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400'),
  (25,2,'Kuh',    'פרה',   'Die Kuh gibt Milch.',     'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400'),
  (25,2,'Schaf',  'כבש',   'Das Schaf ist weiß.',     'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400'),
  (26,1,'Eins',   'אחד',   'Ich habe eine Katze.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,1,'Zwei',   'שתיים', 'Ich habe zwei Hunde.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,1,'Drei',   'שלוש',  'Es gibt drei Stühle.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,1,'Vier',   'ארבע',  'Es gibt vier Tische.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,1,'Fünf',   'חמש',   'Ich habe fünf Bücher.',   'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,2,'Sechs',  'שש',    'Es ist sechs Uhr.',       'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,2,'Sieben', 'שבע',   'Es gibt sieben Tage.',    'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,2,'Acht',   'שמונה', 'Es ist acht Uhr.',        'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,2,'Neun',   'תשע',   'Ich habe neun Stifte.',   'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (26,2,'Zehn',   'עשר',   'Ich habe zehn Finger.',   'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (27,1,'Hallo',          'שלום',     'Hallo, wie geht es dir?',              'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,1,'Tschüss',        'להתראות',  'Tschüss, bis morgen.',                 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,1,'Bitte',          'בבקשה',    'Bitte hilf mir.',                      'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,1,'Danke',          'תודה',     'Vielen Dank.',                         'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,1,'Guten Morgen',   'בוקר טוב', 'Guten Morgen, wie schläfst du?',       'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,2,'Gute Nacht',     'לילה טוב', 'Gute Nacht, schlaf gut.',              'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,2,'Wie geht es dir?','מה שלומך?','Wie geht es dir heute?',              'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,2,'Gut',            'טוב',      'Mir geht es gut.',                     'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,2,'Entschuldigung', 'סליחה',    'Entschuldigung, wo ist der Bahnhof?',  'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400'),
  (27,2,'Bitte sehr',     'בבקשה',    'Bitte sehr, kein Problem.',            'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400');

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — Italian (lessons 28–30)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url) VALUES
  (28,1,'Rosso',    'אדום',  'La mela è rossa.',       'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400'),
  (28,1,'Blu',      'כחול',  'Il cielo è blu.',         'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400'),
  (28,1,'Verde',    'ירוק',  'L''albero è verde.',      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'),
  (28,1,'Giallo',   'צהוב',  'Il sole è giallo.',       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'),
  (28,1,'Nero',     'שחור',  'La notte è nera.',        'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400'),
  (28,2,'Bianco',   'לבן',   'La neve è bianca.',       'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400'),
  (28,2,'Arancione','כתום',  'L''arancia è arancione.', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'),
  (28,2,'Rosa',     'ורוד',  'Il fiore è rosa.',        'https://images.unsplash.com/photo-1490750967868-88df5691cc3a?w=400'),
  (28,2,'Viola',    'סגול',  'L''uva è viola.',         'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400'),
  (28,2,'Grigio',   'אפור',  'Il cielo è grigio.',      'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=400'),
  (29,1,'Gatto',    'חתול',  'Il gatto dorme.',         'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'),
  (29,1,'Cane',     'כלב',   'Il cane corre.',          'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'),
  (29,1,'Uccello',  'ציפור', 'L''uccello canta.',       'https://images.unsplash.com/photo-1444664886087-685d411bf72d?w=400'),
  (29,1,'Pesce',    'דג',    'Il pesce nuota.',         'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'),
  (29,1,'Cavallo',  'סוס',   'Il cavallo è veloce.',    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'),
  (29,2,'Leone',    'אריה',  'Il leone è forte.',       'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400'),
  (29,2,'Elefante', 'פיל',   'L''elefante è grande.',   'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400'),
  (29,2,'Mucca',    'פרה',   'La mucca dà latte.',      'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400'),
  (29,2,'Coniglio', 'ארנב',  'Il coniglio è bianco.',   'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400'),
  (29,2,'Orso',     'דוב',   'L''orso è marrone.',      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400'),
  (30,1,'Uno',      'אחד',   'Ho un gatto.',            'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,1,'Due',      'שתיים', 'Ho due cani.',            'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,1,'Tre',      'שלוש',  'Ci sono tre sedie.',      'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,1,'Quattro',  'ארבע',  'Ci sono quattro tavoli.', 'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,1,'Cinque',   'חמש',   'Ho cinque libri.',        'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,2,'Sei',      'שש',    'Sono le sei.',            'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,2,'Sette',    'שבע',   'Ci sono sette giorni.',   'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,2,'Otto',     'שמונה', 'Sono le otto.',           'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,2,'Nove',     'תשע',   'Ho nove penne.',          'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400'),
  (30,2,'Dieci',    'עשר',   'Ho dieci dita.',          'https://images.unsplash.com/photo-1569534403236-b34e93e0df2e?w=400');

-- ─────────────────────────────────────────────────────────────────────────────
-- WORDS — Japanese (lessons 31–33)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO words (lesson_id, class_order, word, translation, example_sentence, image_url) VALUES
  (31,1,'あ (a)', 'א (a)',  'あ is the first hiragana.',  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,1,'い (i)', 'י (i)',  'い is the second hiragana.', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,1,'う (u)', 'ו (u)',  'う is used in many words.',  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,1,'え (e)', 'ה (e)',  'え sounds like "e".',        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,1,'お (o)', 'ו (o)',  'お sounds like "o".',        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,2,'か (ka)','קה (ka)','か starts many words.',      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,2,'き (ki)','קי (ki)','き sounds like "ki".',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,2,'く (ku)','קו (ku)','く sounds like "ku".',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,2,'け (ke)','קה (ke)','け sounds like "ke".',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (31,2,'こ (ko)','קו (ko)','こ sounds like "ko".',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,1,'こんにちは',  'שלום',       'こんにちは、元気ですか？',           'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,1,'おはよう',    'בוקר טוב',   'おはよう、今日も頑張ろう！',         'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,1,'こんばんは',  'ערב טוב',    'こんばんは、今日は良い日でした。',   'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,1,'さようなら',  'להתראות',    'さようなら、またね。',               'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,1,'ありがとう',  'תודה',       'ありがとう、助かりました。',         'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,2,'すみません',  'סליחה',      'すみません、どこですか？',           'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,2,'はい',        'כן',         'はい、そうです。',                   'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,2,'いいえ',      'לא',         'いいえ、違います。',                 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,2,'お願いします','בבקשה',      'お願いします、助けてください。',     'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (32,2,'どうぞ',      'הינה/בבקשה', 'どうぞ、召し上がれ。',               'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,1,'いち (1)',  'אחד',   'いちばんです。',         'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,1,'に (2)',    'שתיים', 'ふたつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,1,'さん (3)', 'שלוש',  'みっつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,1,'し (4)',    'ארבע',  'よっつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,1,'ご (5)',    'חמש',   'いつつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,2,'ろく (6)', 'שש',    'むっつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,2,'しち (7)', 'שבע',   'ななつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,2,'はち (8)', 'שמונה', 'やっつあります。',       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,2,'く (9)',    'תשע',   'ここのつあります。',     'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400'),
  (33,2,'じゅう (10)','עשר', 'とおあります。',         'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400');


-- ─────────────────────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO users (name, email, status) VALUES
  ('Noemie Weiss',  'admin@fluento.com',   'active'),   -- 1  (admin)
  ('Alice Cohen',   'alice@fluento.com',   'active'),   -- 2
  ('Bob Levi',      'bob@fluento.com',     'active'),   -- 3
  ('Dana Mizrahi',  'dana@fluento.com',    'active'),   -- 4
  ('Eli Shapiro',   'eli@fluento.com',     'active'),   -- 5
  ('Fatima Hassan', 'fatima@fluento.com',  'active'),   -- 6
  ('Gabriel Silva', 'gabriel@fluento.com', 'active'),   -- 7
  ('Hannah Berg',   'hannah@fluento.com',  'active'),   -- 8
  ('Ivan Petrov',   'ivan@fluento.com',    'active'),   -- 9
  ('Julia Martin',  'julia@fluento.com',   'active'),   -- 10
  ('Kobi Peretz',   'kobi@fluento.com',    'suspended'),-- 11
  ('Lena Müller',   'lena@fluento.com',    'active'),   -- 12
  ('Marco Rossi',   'marco@fluento.com',   'active'),   -- 13
  ('Nina Tanaka',   'nina@fluento.com',    'active'),   -- 14
  ('Omar Khalil',   'omar@fluento.com',    'active'),   -- 15
  ('Priya Patel',   'priya@fluento.com',   'active'),   -- 16
  ('Rafael Torres', 'rafael@fluento.com',  'active');   -- 17

INSERT INTO student_profiles (user_id, xp, streak) VALUES
  (2,  420,  7), (3,  180,  3), (4,  310,  5), (5,   60,  1),
  (6,  550, 10), (7,  200,  4), (8,  390,  6), (9,  240,  4),
  (10, 160,  2), (11,  50,  0), (12, 430,  8), (13, 270,  4),
  (14, 340,  6), (15, 480,  9), (16, 620, 12), (17, 230,  3);

INSERT INTO roles_to_users (user_id, role_id) VALUES
  (1,  1),
  (2,  2),(3,  2),(4,  2),(5,  2),(6,  2),(7,  2),(8,  2),(9,  2),
  (10, 2),(11, 2),(12, 2),(13, 2),(14, 2),(15, 2),(16, 2),(17, 2);

INSERT INTO passwords (user_id, password_hash) VALUES
  (1,  '$2b$10$Jgx98zxUktyBRd34rRMWQe0BJaHCd4/X/2MEA4dUhqnKz60W2Y2U2'),
  (2,  '$2b$10$vnZxUW0D3fjWGM72DAt78.cavmbnTsEYwJTYH6E2jKA9.RtLEIvQy'),
  (3,  '$2b$10$jr25Elh2bRYXPsUSe6dHbeR2TA6AExZYCnisKnRzGJ/UKP0Ibgqqq'),
  (4,  '$2b$10$RSaNHOV2okeYgNsgBTZIZOOEIDykx5EWP5F6.zcNSjRA3t82WUKRe'),
  (5,  '$2b$10$pn87oA0UpoMlCsY1iZ96dePCTDkquZuZuuw42/PpFLyfn5hLsyHlW'),
  (6,  '$2b$10$upKIl2ye71Jcb.EXMW7/tukupeBUsmZaeOkN0ZZzbNjMcQ3xJYxka'),
  (7,  '$2b$10$1vLtUDna661eWrFnlkmRc.NwrMcs76ZG12TSxQ5Ewwg7kqI1yYkEm'),
  (8,  '$2b$10$7ULtWC.XBSix6PGduRJQM.N8CUUOiVfr7n8PqzVh9rtbNclU5Iqv.'),
  (9,  '$2b$10$LFR1IYAUlVgZY2QE6PqMBexv6B706oAYquCsg4.zRPhvOaIx4p8Le'),
  (10, '$2b$10$lJm/NEbIXJkeJZcQXob21OQTuK0HvUmNck2x4eCU3x3zXxDNiSp02'),
  (11, '$2b$10$Zx8lZH/sxWJSU5sSl8VTL.1KbszHw7rH4iHqvM192eBlcTuYRJoQq'),
  (12, '$2b$10$cG8UV/anQUXERZA/fdtmJuH.Fw4T8DbyThnSxMCZfXDwr1a9N1pIu'),
  (13, '$2b$10$r3mjTLfyRvw2chJMPGNBWehGL.nB3zSDotjhaJXRq7RDkBVnuvLXS'),
  (14, '$2b$10$7b3PLAeq9gMKECMm.OOH7.oBUXKR0iBCt6nLzXvll.NgoiEMtA2Iu'),
  (15, '$2b$10$/9dpKEJJWBuiCuU/adlsBuaRYF5yKcNX8.SKDdVhmPgZD0rDhQMPm'),
  (16, '$2b$10$I9mOkdxZogGTgn3hfKwvLuAoQSPTgIG5oMf.KS/l4B8bJc.ak/VhS'),
  (17, '$2b$10$nLdYtQzzHqRyXtcfqEySdeQmEl2qqsYgRHA3p18qWggtaIzIV1pM2');

INSERT INTO user_languages (user_id, language_id) VALUES
  (2,1),(2,3),(3,2),(4,1),(4,4),(5,1),(6,2),(6,5),(7,2),
  (8,3),(8,4),(9,1),(9,6),(10,3),(11,1),(12,4),(13,5),
  (14,6),(15,2),(15,3),(16,1),(16,5),(17,2);


-- ─────────────────────────────────────────────────────────────────────────────
-- PROGRESS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO user_progress (user_id, lesson_id, score, completed, completed_at) VALUES
  (2,1,95,TRUE,NOW()-INTERVAL 6 DAY),(2,2,88,TRUE,NOW()-INTERVAL 5 DAY),
  (2,3,92,TRUE,NOW()-INTERVAL 4 DAY),(2,4,85,TRUE,NOW()-INTERVAL 3 DAY),
  (2,5,78,TRUE,NOW()-INTERVAL 2 DAY),(2,6,70,TRUE,NOW()-INTERVAL 1 DAY),
  (2,7,65,TRUE,NOW()),(2,20,55,TRUE,NOW()-INTERVAL 1 DAY),(2,21,0,FALSE,NULL),
  (3,13,80,TRUE,NOW()-INTERVAL 5 DAY),(3,14,72,TRUE,NOW()-INTERVAL 4 DAY),
  (3,15,68,TRUE,NOW()-INTERVAL 2 DAY),(3,16,0,FALSE,NULL),
  (4,1,90,TRUE,NOW()-INTERVAL 6 DAY),(4,2,85,TRUE,NOW()-INTERVAL 5 DAY),
  (4,3,60,TRUE,NOW()-INTERVAL 3 DAY),(4,24,75,TRUE,NOW()-INTERVAL 4 DAY),
  (4,25,80,TRUE,NOW()-INTERVAL 2 DAY),(4,26,0,FALSE,NULL),
  (5,1,45,FALSE,NULL),(5,2,30,FALSE,NULL),(5,3,20,FALSE,NULL),
  (6,13,95,TRUE,NOW()-INTERVAL 6 DAY),(6,14,90,TRUE,NOW()-INTERVAL 5 DAY),
  (6,15,88,TRUE,NOW()-INTERVAL 4 DAY),(6,16,82,TRUE,NOW()-INTERVAL 3 DAY),
  (6,17,78,TRUE,NOW()-INTERVAL 2 DAY),(6,28,91,TRUE,NOW()-INTERVAL 1 DAY),
  (6,29,85,TRUE,NOW()),
  (7,13,70,TRUE,NOW()-INTERVAL 3 DAY),(7,14,65,TRUE,NOW()-INTERVAL 2 DAY),
  (7,15,55,TRUE,NOW()-INTERVAL 1 DAY),(7,16,48,FALSE,NULL),
  (8,20,88,TRUE,NOW()-INTERVAL 6 DAY),(8,21,82,TRUE,NOW()-INTERVAL 5 DAY),
  (8,22,76,TRUE,NOW()-INTERVAL 3 DAY),(8,23,71,TRUE,NOW()-INTERVAL 1 DAY),
  (8,24,90,TRUE,NOW()-INTERVAL 4 DAY),(8,25,85,TRUE,NOW()-INTERVAL 2 DAY),
  (8,26,0,FALSE,NULL),
  (9,1,75,TRUE,NOW()-INTERVAL 5 DAY),(9,2,70,TRUE,NOW()-INTERVAL 4 DAY),
  (9,31,60,TRUE,NOW()-INTERVAL 3 DAY),(9,32,55,TRUE,NOW()-INTERVAL 1 DAY),
  (9,33,0,FALSE,NULL),
  (10,20,78,TRUE,NOW()-INTERVAL 4 DAY),(10,21,72,TRUE,NOW()-INTERVAL 3 DAY),
  (10,22,65,TRUE,NOW()-INTERVAL 1 DAY),(10,23,0,FALSE,NULL),
  (11,1,50,TRUE,NOW()-INTERVAL 6 DAY),(11,2,30,FALSE,NULL),
  (12,24,92,TRUE,NOW()-INTERVAL 5 DAY),(12,25,87,TRUE,NOW()-INTERVAL 4 DAY),
  (12,26,80,TRUE,NOW()-INTERVAL 2 DAY),(12,27,75,TRUE,NOW()),
  (13,28,85,TRUE,NOW()-INTERVAL 3 DAY),(13,29,78,TRUE,NOW()-INTERVAL 2 DAY),
  (13,30,70,TRUE,NOW()-INTERVAL 1 DAY),
  (14,31,88,TRUE,NOW()-INTERVAL 4 DAY),(14,32,82,TRUE,NOW()-INTERVAL 2 DAY),
  (14,33,75,TRUE,NOW()),
  (15,13,90,TRUE,NOW()-INTERVAL 6 DAY),(15,14,85,TRUE,NOW()-INTERVAL 5 DAY),
  (15,15,80,TRUE,NOW()-INTERVAL 3 DAY),(15,20,75,TRUE,NOW()-INTERVAL 4 DAY),
  (15,21,68,TRUE,NOW()-INTERVAL 2 DAY),(15,22,0,FALSE,NULL),
  (16,1,98,TRUE,NOW()-INTERVAL 6 DAY),(16,2,95,TRUE,NOW()-INTERVAL 5 DAY),
  (16,3,92,TRUE,NOW()-INTERVAL 4 DAY),(16,4,90,TRUE,NOW()-INTERVAL 3 DAY),
  (16,5,88,TRUE,NOW()-INTERVAL 2 DAY),(16,6,85,TRUE,NOW()-INTERVAL 1 DAY),
  (16,28,91,TRUE,NOW()-INTERVAL 3 DAY),(16,29,87,TRUE,NOW()),
  (17,13,82,TRUE,NOW()-INTERVAL 4 DAY),(17,14,76,TRUE,NOW()-INTERVAL 3 DAY),
  (17,15,70,TRUE,NOW()-INTERVAL 1 DAY),(17,16,65,TRUE,NOW());


-- ─────────────────────────────────────────────────────────────────────────────
-- QUIZZES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO surprise_quizzes (title, question, option_a, option_b, option_c, option_d, correct, xp_reward, active, created_by) VALUES
  ('Colors Quiz',    'What color is the sky?',                       'Red',      'Blue',    'Green',    'Yellow',      'B', 20, TRUE,  1),
  ('Animals Quiz',   'Which animal says "meow"?',                    'Dog',      'Horse',   'Cat',      'Bird',        'C', 20, TRUE,  1),
  ('Numbers Quiz',   'How many days in a week?',                     'Five',     'Six',     'Seven',    'Eight',       'C', 20, TRUE,  1),
  ('Greetings Quiz', 'How do you say "thank you" in English?',       'Please',   'Hello',   'Sorry',    'Thank you',   'D', 20, TRUE,  1),
  ('Food Quiz',      'Which is a drink?',                            'Bread',    'Apple',   'Water',    'Cat',         'C', 20, TRUE,  1),
  ('Family Quiz',    'What is the female parent called?',            'Father',   'Brother', 'Sister',   'Mother',      'D', 25, TRUE,  1),
  ('Weather Quiz',   'What falls from the sky in winter?',           'Sun',      'Rain',    'Snow',     'Wind',        'C', 25, TRUE,  1),
  ('Travel Quiz',    'Where do you go to catch a plane?',            'Hotel',    'Airport', 'Train',    'Beach',       'B', 25, TRUE,  1),
  ('Tech Quiz',      'What do you use to browse the internet?',      'Keyboard', 'Battery', 'Computer', 'Screen',      'C', 30, TRUE,  1),
  ('Spanish Quiz',   'How do you say "thank you" in Spanish?',       'Hola',     'Adiós',   'Gracias',  'Bienvenido',  'C', 25, TRUE,  1);


-- ─────────────────────────────────────────────────────────────────────────────
-- BADGES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO badges (name, emoji, description, created_by) VALUES
  ('First Step',    '🌱', 'Completed your first lesson',          1),  -- 1
  ('Fast Learner',  '⚡', 'Completed 5 lessons in one week',      1),  -- 2
  ('Streak Master', '🔥', 'Maintained a 7-day streak',            1),  -- 3
  ('Polyglot',      '🌍', 'Learning 2 or more languages',         1),  -- 4
  ('Top Scorer',    '🏆', 'Scored 90%+ on 3 lessons',             1),  -- 5
  ('Dedicated',     '💪', 'Logged in for 30 consecutive days',    1),  -- 6
  ('Word Wizard',   '✨', 'Learned over 100 words',               1);  -- 7

-- First Step
INSERT INTO user_badges (user_id, badge_id, given_by) VALUES
  (2,1,1),(3,1,1),(4,1,1),(6,1,1),(7,1,1),(8,1,1),(9,1,1),(10,1,1),
  (11,1,1),(12,1,1),(13,1,1),(14,1,1),(15,1,1),(16,1,1),(17,1,1);
-- Streak Master
INSERT INTO user_badges (user_id, badge_id, given_by) VALUES
  (2,3,1),(6,3,1),(8,3,1),(15,3,1),(16,3,1);
-- Polyglot
INSERT INTO user_badges (user_id, badge_id, given_by) VALUES
  (2,4,1),(4,4,1),(6,4,1),(8,4,1),(9,4,1),(15,4,1),(16,4,1);
-- Top Scorer
INSERT INTO user_badges (user_id, badge_id, given_by) VALUES
  (16,5,1),(2,5,1),(6,5,1),(12,5,1);
-- Fast Learner
INSERT INTO user_badges (user_id, badge_id, given_by) VALUES
  (2,2,1),(6,2,1),(8,2,1),(16,2,1);


-- ─────────────────────────────────────────────────────────────────────────────
-- XP TRANSACTIONS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO xp_transactions (user_id, amount, reason, given_by) VALUES
  (2,  100, 'Completed English Beginner level',   1),
  (2,   50, 'Perfect score on Colors lesson',     1),
  (2,   30, 'Weekly streak bonus',                1),
  (3,   80, 'Completed Spanish Principiante',     1),
  (4,   90, 'Great progress this week',           1),
  (5,   20, 'First lesson attempt',               1),
  (6,  150, 'Completed Spanish + Italian levels', 1),
  (6,   50, 'Perfect score bonus',                1),
  (7,   70, 'Consistent practice',                1),
  (8,  120, 'Excellent French progress',          1),
  (9,   80, 'Learning two languages',             1),
  (10,  60, 'French progress bonus',              1),
  (11,  30, 'Participated before suspension',     1),
  (12, 130, 'Top German student',                 1),
  (13,  90, 'Completed all Italian lessons',      1),
  (14, 100, 'Excellent Japanese progress',        1),
  (15, 130, 'Spanish + French champion',          1),
  (16, 200, 'Highest score in class',             1),
  (17,  80, 'Good Spanish progress',              1);


-- ─────────────────────────────────────────────────────────────────────────────
-- WARNINGS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO warnings (user_id, message, given_by) VALUES
  (11, 'You have been inactive for 2 weeks. Please log in and continue learning.', 1),
  (5,  'Your scores are below 50%. Please review the material and try again.',     1),
  (5,  'Reminder: practice daily to improve your results.',                        1);


-- ─────────────────────────────────────────────────────────────────────────────
-- SYSTEM BROADCASTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO system_broadcasts (message, created_by, is_active, expires_at) VALUES
  ('🚀 Welcome to Fluento! Start learning a new language today.',  1, FALSE, NULL),
  ('🔧 Scheduled maintenance Sunday 02:00–04:00 AM. Save your work.', 1, FALSE, '2026-05-25 04:00:00'),
  ('🎉 New languages added: Italian and Japanese are now available!', 1, TRUE,  NULL);


-- ─────────────────────────────────────────────────────────────────────────────
-- AUTOMATION RULES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO automation_rules (name, trigger_type, condition_value, action_type, email_subject, email_template, is_active, created_by) VALUES
  ('Inactivity 3-day reminder',  'inactivity', 3,  'send_email', 'We miss you on Fluento!',      'Hi {{name}}, you haven''t practiced in 3 days. Log in and keep your streak alive!', TRUE,  1),
  ('Inactivity 7-day follow-up', 'inactivity', 7,  'send_email', 'Come back to Fluento!',        'Hi {{name}}, it''s been a week! Your progress is waiting for you.',               TRUE,  1),
  ('Inactivity 14-day warning',  'inactivity', 14, 'send_email', 'Don''t lose your progress!',   'Hi {{name}}, 2 weeks without practice. Let''s get back on track together.',        FALSE, 1);


-- ─────────────────────────────────────────────────────────────────────────────
-- AUDIT LOGS  (admin_id = 1 = Noemie Weiss)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO audit_logs (admin_id, action_type, target_type, target_id, details, created_at) VALUES
  (1,'create','user',5,    '{"method":"POST","path":"/api/admin/users","body":{"name":"Tom Levi","email":"tom@fluento.com"}}',                NOW()-INTERVAL 6 DAY),
  (1,'update','user',11,   '{"method":"PUT","path":"/api/admin/users/11","body":{"status":"suspended"}}',                                     NOW()-INTERVAL 5 DAY+INTERVAL 2 HOUR),
  (1,'update','user',11,   '{"method":"PUT","path":"/api/admin/users/11","body":{"status":"active"}}',                                        NOW()-INTERVAL 3 DAY+INTERVAL 1 HOUR),
  (1,'delete','user',5,    '{"method":"DELETE","path":"/api/admin/users/5"}',                                                                 NOW()-INTERVAL 2 DAY+INTERVAL 3 HOUR),
  (1,'update','user',3,    '{"method":"PUT","path":"/api/admin/users/3","body":{"name":"Bob Levi-Cohen"}}',                                    NOW()-INTERVAL 1 DAY),
  (1,'create','language',5,'{"method":"POST","path":"/api/admin/languages","body":{"name":"Italian","code":"it","flag_emoji":"IT"}}',        NOW()-INTERVAL 10 DAY),
  (1,'create','language',6,'{"method":"POST","path":"/api/admin/languages","body":{"name":"Japanese","code":"ja","flag_emoji":"JP"}}',       NOW()-INTERVAL 9 DAY),
  (1,'update','language',2,'{"method":"PUT","path":"/api/admin/languages/2","body":{"flag_emoji":"ES"}}',                                    NOW()-INTERVAL 8 DAY),
  (1,'create','level',11,  '{"method":"POST","path":"/api/admin/levels","body":{"title":"Principiante","level_number":1}}',                   NOW()-INTERVAL 10 DAY+INTERVAL 1 HOUR),
  (1,'create','level',13,  '{"method":"POST","path":"/api/admin/levels","body":{"title":"Beginner","level_number":1}}',                       NOW()-INTERVAL 9 DAY+INTERVAL 1 HOUR),
  (1,'delete','level',6,   '{"method":"DELETE","path":"/api/admin/levels/6"}',                                                               NOW()-INTERVAL 7 DAY),
  (1,'create','lesson',28, '{"method":"POST","path":"/api/admin/lessons","body":{"title":"Colori","lesson_number":1}}',                       NOW()-INTERVAL 10 DAY+INTERVAL 2 HOUR),
  (1,'create','lesson',31, '{"method":"POST","path":"/api/admin/lessons","body":{"title":"Hiragana","lesson_number":1}}',                     NOW()-INTERVAL 9 DAY+INTERVAL 2 HOUR),
  (1,'update','lesson',10, '{"method":"PUT","path":"/api/admin/lessons/10","body":{"title":"Business English"}}',                             NOW()-INTERVAL 4 DAY),
  (1,'update','lesson',11, '{"method":"PUT","path":"/api/admin/lessons/11","body":{"lesson_number":2}}',                                      NOW()-INTERVAL 4 DAY+INTERVAL 30 MINUTE),
  (1,'delete','lesson',9,  '{"method":"DELETE","path":"/api/admin/lessons/9"}',                                                               NOW()-INTERVAL 3 DAY+INTERVAL 2 HOUR),
  (1,'create','word',NULL, '{"method":"POST","path":"/api/admin/lessons/10/words","body":{"word":"Strategy","translation":"strategy"}}',      NOW()-INTERVAL 4 DAY+INTERVAL 3 HOUR),
  (1,'update','word',NULL, '{"method":"PUT","path":"/api/admin/lessons/1/words","body":{"translation":"Hello (formal)"}}',                    NOW()-INTERVAL 2 DAY+INTERVAL 4 HOUR),
  (1,'delete','word',NULL, '{"method":"DELETE","path":"/api/admin/lessons/9/words/88"}',                                                      NOW()-INTERVAL 1 DAY+INTERVAL 2 HOUR),
  (1,'create','xp',NULL,   '{"method":"POST","path":"/api/rewards/xp","body":{"user_id":16,"amount":200,"reason":"Highest score in class"}}', NOW()-INTERVAL 5 DAY+INTERVAL 1 HOUR),
  (1,'create','xp',NULL,   '{"method":"POST","path":"/api/rewards/xp","body":{"user_id":6,"amount":150,"reason":"Completed Spanish+Italian"}}',NOW()-INTERVAL 5 DAY+INTERVAL 2 HOUR),
  (1,'create','xp',NULL,   '{"method":"POST","path":"/api/rewards/xp","body":{"user_id":5,"amount":20,"reason":"First lesson attempt"}}',     NOW()-INTERVAL 4 DAY+INTERVAL 5 HOUR),
  (1,'create','badge',3,   '{"method":"POST","path":"/api/rewards/badges","body":{"name":"Streak Master","emoji":"fire"}}',                    NOW()-INTERVAL 12 DAY),
  (1,'create','badge',4,   '{"method":"POST","path":"/api/rewards/badges","body":{"name":"Polyglot","emoji":"globe"}}',                        NOW()-INTERVAL 12 DAY+INTERVAL 10 MINUTE),
  (1,'create','badge',NULL,'{"method":"POST","path":"/api/rewards/badges/give","body":{"user_id":16,"badge_id":5}}',                          NOW()-INTERVAL 5 DAY+INTERVAL 3 HOUR),
  (1,'create','badge',NULL,'{"method":"POST","path":"/api/rewards/badges/give","body":{"user_id":6,"badge_id":3}}',                           NOW()-INTERVAL 5 DAY+INTERVAL 4 HOUR),
  (1,'delete','badge',NULL,'{"method":"DELETE","path":"/api/rewards/badges/6/11"}',                                                           NOW()-INTERVAL 2 DAY+INTERVAL 1 HOUR),
  (1,'create','warning',NULL,'{"method":"POST","path":"/api/rewards/warnings","body":{"user_id":11,"message":"Inactive for 2 weeks"}}',       NOW()-INTERVAL 6 DAY+INTERVAL 4 HOUR),
  (1,'create','warning',NULL,'{"method":"POST","path":"/api/rewards/warnings","body":{"user_id":5,"message":"Scores below 50%"}}',            NOW()-INTERVAL 3 DAY+INTERVAL 3 HOUR),
  (1,'create','quiz',1,    '{"method":"POST","path":"/api/rewards/quizzes","body":{"title":"Colors Quiz"}}',                                   NOW()-INTERVAL 14 DAY),
  (1,'update','quiz',7,    '{"method":"PUT","path":"/api/rewards/quizzes/7/toggle","body":{"active":false}}',                                  NOW()-INTERVAL 1 DAY+INTERVAL 5 HOUR),
  (1,'create','broadcast',1,'{"method":"POST","path":"/api/broadcasts","body":{"message":"Welcome to Fluento!"}}',                           NOW()-INTERVAL 14 DAY+INTERVAL 1 HOUR),
  (1,'update','broadcast',1,'{"method":"PATCH","path":"/api/broadcasts/1/deactivate"}',                                                      NOW()-INTERVAL 13 DAY),
  (1,'create','broadcast',3,'{"method":"POST","path":"/api/broadcasts","body":{"message":"New languages added!"}}',                          NOW()-INTERVAL 9 DAY+INTERVAL 3 HOUR),
  (1,'create','automation',1,'{"method":"POST","path":"/api/automations","body":{"name":"Inactivity 3-day reminder","condition_value":3}}',  NOW()-INTERVAL 13 DAY),
  (1,'create','automation',2,'{"method":"POST","path":"/api/automations","body":{"name":"Inactivity 7-day follow-up","condition_value":7}}', NOW()-INTERVAL 13 DAY+INTERVAL 5 MINUTE),
  (1,'update','automation',3,'{"method":"PATCH","path":"/api/automations/3/toggle","body":{"is_active":false}}',                             NOW()-INTERVAL 1 DAY+INTERVAL 6 HOUR);
