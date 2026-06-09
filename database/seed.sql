-- Fluento Seed Data
-- Includes roles, admin user, languages, levels, lessons, and words organized into classes

USE fluento;

-- =====================================================
-- ROLES
-- =====================================================
INSERT INTO roles (name) VALUES ('admin'), ('student');

-- =====================================================
-- ROUTE PERMISSIONS
-- =====================================================
INSERT INTO route_permissions (prefix, role) VALUES
('/api/student', 'student'),
('/api/languages', 'student'),
('/api/lessons', 'student'),
('/api/progress', 'student'),
('/api/admin', 'admin'),
('/api/student', 'admin'),
('/api/languages', 'admin'),
('/api/lessons', 'admin'),
('/api/progress', 'admin'),
('/api/users', 'admin'),
('/api/rewards', 'admin');

-- =====================================================
-- LANGUAGES
-- =====================================================
INSERT INTO languages (name, code, flag_emoji) VALUES
('Spanish', 'es', '🇪🇸'),
('French', 'fr', '🇫🇷'),
('German', 'de', '🇩🇪'),
('Italian', 'it', '🇮🇹'),
('Portuguese', 'pt', '🇵🇹');

-- =====================================================
-- SPANISH - Levels and Lessons
-- =====================================================

-- Spanish Level 1: Beginner
INSERT INTO levels (language_id, level_number, title) 
VALUES ((SELECT id FROM languages WHERE code = 'es'), 1, 'Beginner');

SET @spanish_level1 = LAST_INSERT_ID();

-- Spanish Lesson 1: Greetings
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@spanish_level1, 1, 'Greetings');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Hola', 'Hello', 'Hola, ¿cómo estás? (Hello, how are you?)'),
(@lesson_id, 1, 'Adiós', 'Goodbye', 'Adiós, hasta luego. (Goodbye, see you later.)'),
(@lesson_id, 2, 'Buenos días', 'Good morning', 'Buenos días, señor. (Good morning, sir.)'),
(@lesson_id, 2, 'Buenas noches', 'Good night', 'Buenas noches, mamá. (Good night, mom.)'),
(@lesson_id, 3, 'Gracias', 'Thank you', 'Gracias por tu ayuda. (Thank you for your help.)'),
(@lesson_id, 3, 'Por favor', 'Please', 'Por favor, siéntate. (Please, sit down.)');

-- Spanish Lesson 2: Basic Phrases
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@spanish_level1, 2, 'Basic Phrases');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Sí', 'Yes', 'Sí, estoy de acuerdo. (Yes, I agree.)'),
(@lesson_id, 1, 'No', 'No', 'No, no quiero. (No, I don''t want to.)'),
(@lesson_id, 2, 'Lo siento', 'I''m sorry', 'Lo siento mucho. (I''m very sorry.)'),
(@lesson_id, 2, 'Perdón', 'Excuse me', 'Perdón, ¿dónde está el baño? (Excuse me, where is the bathroom?)'),
(@lesson_id, 3, '¿Cómo estás?', 'How are you?', '¿Cómo estás hoy? (How are you today?)'),
(@lesson_id, 3, 'Bien', 'Good/Well', 'Estoy bien, gracias. (I''m well, thank you.)');

-- Spanish Lesson 3: Numbers 1-10
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@spanish_level1, 3, 'Numbers 1-10');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Uno', 'One', 'Tengo un libro. (I have one book.)'),
(@lesson_id, 1, 'Dos', 'Two', 'Dos cafés, por favor. (Two coffees, please.)'),
(@lesson_id, 2, 'Tres', 'Three', 'Tres días. (Three days.)'),
(@lesson_id, 2, 'Cuatro', 'Four', 'Cuatro personas. (Four people.)'),
(@lesson_id, 3, 'Cinco', 'Five', 'Cinco minutos. (Five minutes.)'),
(@lesson_id, 3, 'Seis', 'Six', 'Son las seis. (It''s six o''clock.)');

-- =====================================================
-- FRENCH - Levels and Lessons
-- =====================================================

-- French Level 1: Beginner
INSERT INTO levels (language_id, level_number, title) 
VALUES ((SELECT id FROM languages WHERE code = 'fr'), 1, 'Débutant');

SET @french_level1 = LAST_INSERT_ID();

-- French Lesson 1: Greetings
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@french_level1, 1, 'Salutations');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Bonjour', 'Hello/Good day', 'Bonjour, comment allez-vous? (Hello, how are you?)'),
(@lesson_id, 1, 'Au revoir', 'Goodbye', 'Au revoir, à bientôt! (Goodbye, see you soon!)'),
(@lesson_id, 2, 'Merci', 'Thank you', 'Merci beaucoup. (Thank you very much.)'),
(@lesson_id, 2, 'S''il vous plaît', 'Please', 'Un café, s''il vous plaît. (A coffee, please.)'),
(@lesson_id, 3, 'Oui', 'Yes', 'Oui, c''est correct. (Yes, that''s correct.)'),
(@lesson_id, 3, 'Non', 'No', 'Non, merci. (No, thank you.)');

-- French Lesson 2: Basic Phrases
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@french_level1, 2, 'Phrases de Base');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Bonsoir', 'Good evening', 'Bonsoir, tout le monde! (Good evening, everyone!)'),
(@lesson_id, 1, 'Bonne nuit', 'Good night', 'Bonne nuit, dormez bien. (Good night, sleep well.)'),
(@lesson_id, 2, 'Comment allez-vous?', 'How are you?', 'Comment allez-vous aujourd''hui? (How are you today?)'),
(@lesson_id, 2, 'Ça va', 'I''m fine', 'Ça va bien, merci. (I''m fine, thank you.)'),
(@lesson_id, 3, 'Excusez-moi', 'Excuse me', 'Excusez-moi, monsieur. (Excuse me, sir.)'),
(@lesson_id, 3, 'Pardon', 'Sorry/Pardon', 'Pardon, je ne comprends pas. (Sorry, I don''t understand.)');

-- =====================================================
-- GERMAN - Levels and Lessons
-- =====================================================

-- German Level 1: Beginner
INSERT INTO levels (language_id, level_number, title) 
VALUES ((SELECT id FROM languages WHERE code = 'de'), 1, 'Anfänger');

SET @german_level1 = LAST_INSERT_ID();

-- German Lesson 1: Greetings
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@german_level1, 1, 'Begrüßungen');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Hallo', 'Hello', 'Hallo, wie geht es dir? (Hello, how are you?)'),
(@lesson_id, 1, 'Tschüss', 'Bye', 'Tschüss, bis später! (Bye, see you later!)'),
(@lesson_id, 2, 'Guten Morgen', 'Good morning', 'Guten Morgen, Frau Schmidt. (Good morning, Mrs. Schmidt.)'),
(@lesson_id, 2, 'Gute Nacht', 'Good night', 'Gute Nacht, schlaf gut. (Good night, sleep well.)'),
(@lesson_id, 3, 'Danke', 'Thank you', 'Danke schön. (Thank you very much.)'),
(@lesson_id, 3, 'Bitte', 'Please/You''re welcome', 'Bitte schön. (You''re welcome.)');

-- German Lesson 2: Basic Phrases
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@german_level1, 2, 'Grundphrasen');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Ja', 'Yes', 'Ja, das stimmt. (Yes, that''s right.)'),
(@lesson_id, 1, 'Nein', 'No', 'Nein, danke. (No, thank you.)'),
(@lesson_id, 2, 'Entschuldigung', 'Excuse me/Sorry', 'Entschuldigung, wo ist der Bahnhof? (Excuse me, where is the train station?)'),
(@lesson_id, 2, 'Es tut mir leid', 'I''m sorry', 'Es tut mir leid. (I''m sorry.)'),
(@lesson_id, 3, 'Wie geht es dir?', 'How are you?', 'Wie geht es dir heute? (How are you today?)'),
(@lesson_id, 3, 'Gut', 'Good', 'Mir geht es gut. (I''m doing well.)');

-- =====================================================
-- ITALIAN - Levels and Lessons
-- =====================================================

-- Italian Level 1: Beginner
INSERT INTO levels (language_id, level_number, title) 
VALUES ((SELECT id FROM languages WHERE code = 'it'), 1, 'Principiante');

SET @italian_level1 = LAST_INSERT_ID();

-- Italian Lesson 1: Greetings
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@italian_level1, 1, 'Saluti');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Ciao', 'Hello/Hi/Bye', 'Ciao, come stai? (Hi, how are you?)'),
(@lesson_id, 1, 'Arrivederci', 'Goodbye', 'Arrivederci, a presto! (Goodbye, see you soon!)'),
(@lesson_id, 2, 'Buongiorno', 'Good morning', 'Buongiorno, signora. (Good morning, madam.)'),
(@lesson_id, 2, 'Buonasera', 'Good evening', 'Buonasera, come sta? (Good evening, how are you?)'),
(@lesson_id, 3, 'Grazie', 'Thank you', 'Grazie mille. (Thank you very much.)'),
(@lesson_id, 3, 'Prego', 'You''re welcome/Please', 'Prego, si accomodi. (Please, have a seat.)');

-- Italian Lesson 2: Basic Phrases
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@italian_level1, 2, 'Frasi di Base');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Sì', 'Yes', 'Sì, va bene. (Yes, that''s fine.)'),
(@lesson_id, 1, 'No', 'No', 'No, grazie. (No, thank you.)'),
(@lesson_id, 2, 'Scusa', 'Excuse me/Sorry (informal)', 'Scusa, dov''è il bagno? (Excuse me, where is the bathroom?)'),
(@lesson_id, 2, 'Mi dispiace', 'I''m sorry', 'Mi dispiace molto. (I''m very sorry.)'),
(@lesson_id, 3, 'Come stai?', 'How are you?', 'Come stai oggi? (How are you today?)'),
(@lesson_id, 3, 'Bene', 'Good/Well', 'Sto bene, grazie. (I''m well, thank you.)');

-- =====================================================
-- PORTUGUESE - Levels and Lessons
-- =====================================================

-- Portuguese Level 1: Beginner
INSERT INTO levels (language_id, level_number, title) 
VALUES ((SELECT id FROM languages WHERE code = 'pt'), 1, 'Iniciante');

SET @portuguese_level1 = LAST_INSERT_ID();

-- Portuguese Lesson 1: Greetings
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@portuguese_level1, 1, 'Cumprimentos');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Olá', 'Hello', 'Olá, como está? (Hello, how are you?)'),
(@lesson_id, 1, 'Tchau', 'Bye', 'Tchau, até logo! (Bye, see you later!)'),
(@lesson_id, 2, 'Bom dia', 'Good morning', 'Bom dia, senhor. (Good morning, sir.)'),
(@lesson_id, 2, 'Boa noite', 'Good night', 'Boa noite, durma bem. (Good night, sleep well.)'),
(@lesson_id, 3, 'Obrigado', 'Thank you (m)', 'Obrigado pela ajuda. (Thank you for the help.)'),
(@lesson_id, 3, 'Por favor', 'Please', 'Por favor, sente-se. (Please, sit down.)');

-- Portuguese Lesson 2: Basic Phrases
INSERT INTO lessons (level_id, lesson_number, title) VALUES (@portuguese_level1, 2, 'Frases Básicas');
SET @lesson_id = LAST_INSERT_ID();

INSERT INTO words (lesson_id, class_order, word, translation, example_sentence) VALUES
(@lesson_id, 1, 'Sim', 'Yes', 'Sim, está certo. (Yes, that''s right.)'),
(@lesson_id, 1, 'Não', 'No', 'Não, obrigado. (No, thank you.)'),
(@lesson_id, 2, 'Com licença', 'Excuse me', 'Com licença, onde fica o banheiro? (Excuse me, where is the bathroom?)'),
(@lesson_id, 2, 'Desculpe', 'Sorry', 'Desculpe o atraso. (Sorry for the delay.)'),
(@lesson_id, 3, 'Como está?', 'How are you?', 'Como está hoje? (How are you today?)'),
(@lesson_id, 3, 'Bem', 'Good/Well', 'Estou bem, obrigado. (I''m well, thank you.)');

-- =====================================================
-- SUMMARY
-- =====================================================
SELECT 'Seed data inserted successfully!' as message;
SELECT 
  l.name as Language, 
  COUNT(DISTINCT lv.id) as Levels,
  COUNT(DISTINCT ls.id) as Lessons,
  COUNT(w.id) as Words,
  COUNT(DISTINCT w.class_order) as Classes
FROM languages l
LEFT JOIN levels lv ON lv.language_id = l.id
LEFT JOIN lessons ls ON ls.level_id = lv.id
LEFT JOIN words w ON w.lesson_id = ls.id
GROUP BY l.id, l.name
ORDER BY l.name;
