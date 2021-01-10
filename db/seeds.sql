USE tracking_DB;

-- Gym Seeds to Start
INSERT INTO
  gym (gym_name)
values
  ('N/A'),
  ('Pewter City Gym'),
  ('Cerulean City Gym'),
  ('Vermilion City Gym'),
  ('Celadon City Gym');

-- Types Seeds to Start
INSERT INTO
  types (title, strength)
values
  ('Trainer', ''),
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
  ('Brock', 'Boulder Badge', 1, null, 2),
  ('Onix', 'N/A', 2, 1, 1),
  ('Kabutops', 'N/A', 3, 1, 1),
  ('Misty', 'Cascade Badge', 1, null, 3),
  ('Starmie', 'N/A', 4, 4, 1),
  ('Togetic', 'N/A', 5, 4, 1),
  ('Lt. Surge', 'Thunder Badge', 1, null, 4),
  ('Raichu', 'N/A', 6, 7, 1),
  ('Lanturn', 'N/A', 7, 7, 1),
  ('Erika', 'Rainbow Badge', 1, null, 5),
  ('Venusaur', 'N/A', 8, 10, 1),
  ('Chansey', 'N/A', 9, 10, 1);