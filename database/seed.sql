USE fluento;

INSERT INTO users (name, email, role) VALUES
  ('Noemie Weiss',        'admin@fluento.com',   'admin'),
  ('Alice Cohen',  'alice@example.com',   'student'),
  ('Bob Levi',     'bob@example.com',     'student');

INSERT INTO user_credentials (user_id, password_hash) VALUES
  (1, '$2b$10$Xv1YkXpBpNbZw0QzRlT3aOeW5UvG9CfHmKdN2sJrP8oL4iA6yVx7u'),
  (2, '$2b$10$Xv1YkXpBpNbZw0QzRlT3aOeW5UvG9CfHmKdN2sJrP8oL4iA6yVx7u'),
  (3, '$2b$10$Xv1YkXpBpNbZw0QzRlT3aOeW5UvG9CfHmKdN2sJrP8oL4iA6yVx7u');

INSERT INTO languages (name, code, flag_emoji) VALUES
  ('English', 'en', '🇬🇧'),
  ('Spanish', 'es', '🇪🇸'),
  ('French',  'fr', '🇫🇷');

INSERT INTO levels (language_id, level_number, title) VALUES
  (1, 1, 'Beginner'),
  (1, 2, 'Elementary'),
  (1, 3, 'Intermediate');

INSERT INTO levels (language_id, level_number, title) VALUES
  (2, 1, 'Principiante'),
  (2, 2, 'Elemental');

INSERT INTO levels (language_id, level_number, title) VALUES
  (3, 1, 'Débutant'),
  (3, 2, 'Élémentaire');

INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (1, 1, 'Colors'),
  (1, 2, 'Animals'),
  (1, 3, 'Numbers');

INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (2, 1, 'Food'),
  (2, 2, 'Family');
INSERT INTO lessons (level_id, lesson_number, title) VALUES
  (4, 1, 'Colores'),
  (4, 2, 'Animales');

INSERT INTO words (lesson_id, word, translation, image_url, audio_url, example_sentence) VALUES
  (1, 'Red',    'אדום',  '/public/images/red.jpg',    '/public/audio/red.mp3',    'The apple is red.'),
  (1, 'Blue',   'כחול',  '/public/images/blue.jpg',   '/public/audio/blue.mp3',   'The sky is blue.'),
  (1, 'Green',  'ירוק',  '/public/images/green.jpg',  '/public/audio/green.mp3',  'The tree is green.'),
  (1, 'Yellow', 'צהוב',  '/public/images/yellow.jpg', '/public/audio/yellow.mp3', 'The sun is yellow.'),
  (1, 'Black',  'שחור',  '/public/images/black.jpg',  '/public/audio/black.mp3',  'The night is black.');

INSERT INTO words (lesson_id, word, translation, image_url, audio_url, example_sentence) VALUES
  (2, 'Cat',   'חתול', '/public/images/cat.jpg',   '/public/audio/cat.mp3',   'The cat is sleeping.'),
  (2, 'Dog',   'כלב',  '/public/images/dog.jpg',   '/public/audio/dog.mp3',   'The dog is running.'),
  (2, 'Bird',  'ציפור','/public/images/bird.jpg',  '/public/audio/bird.mp3',  'The bird is singing.'),
  (2, 'Fish',  'דג',   '/public/images/fish.jpg',  '/public/audio/fish.mp3',  'The fish is in the sea.'),
  (2, 'Horse', 'סוס',  '/public/images/horse.jpg', '/public/audio/horse.mp3', 'The horse is running.');

INSERT INTO words (lesson_id, word, translation, image_url, audio_url, example_sentence) VALUES
  (3, 'One',   'אחד',  '/public/images/one.jpg',   '/public/audio/one.mp3',   'I have one cat.'),
  (3, 'Two',   'שתיים','/public/images/two.jpg',   '/public/audio/two.mp3',   'I have two dogs.'),
  (3, 'Three', 'שלוש', '/public/images/three.jpg', '/public/audio/three.mp3', 'I have three birds.'),
  (3, 'Four',  'ארבע', '/public/images/four.jpg',  '/public/audio/four.mp3',  'There are four chairs.'),
  (3, 'Five',  'חמש',  '/public/images/five.jpg',  '/public/audio/five.mp3',  'She has five books.');

INSERT INTO user_languages (user_id, language_id) VALUES
  (2, 1),  -- Alice לומדת אנגלית
  (3, 2);  -- Bob לומד ספרדית

INSERT INTO user_progress (user_id, lesson_id, score, completed, completed_at) VALUES
  (2, 1, 90, TRUE,  NOW()),
  (2, 2, 75, TRUE,  NOW()),
  (2, 3, 0,  FALSE, NULL);
