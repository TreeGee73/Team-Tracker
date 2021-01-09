USE tracking_DB;

-- Gym Seeds to Start
INSERT INTO
  gym (gym_name)
values
  ('Pewter City Gym'),
  ('Cerulean City Gym'),
  ('Vermilion City Gym'),
  ('Celadon City Gym');

-- Types Seeds to Start
INSERT INTO
  types (title, strength)
values
  ('Trainer', null),
  ('Rock/Ground', 385),
  ('Rock/Water', 495),
  ('Water/Psychic', 520),
  ('Normal/Flying', 405),
  ('Electric', 475),
  ('Water/Electric', 460),
  ('Grass/Poison', 525),
  ('Normal', 450);

-- Members Seeds to Start
INSERT INTO
  members (first_name, badge_name, types_id, trainer_id, gym_id)
values
  ('Brock', 'Boulder Badge', 1, null, 1),
  ('Onix', null, 2, 1, null),
  ('Kabutops', null, 3, 1, null),
  ('Misty', 'Cascade Badge', 1, null, 2),
  ('Starmie', null, 4, 4, null),
  ('Togetic', null, 5, 4, null),
  ('Lt. Surge', 'Thunder Badge', 1, null, 3),
  ('Raichu', null, 6, 7, null),
  ('Lanturn', null, 7, 7, null),
  ('Erika', 'Rainbow Badge', 1, null, 4),
  ('Venusaur', null, 8, 10, null),
  ('Chansey', null, 9, 10, null);