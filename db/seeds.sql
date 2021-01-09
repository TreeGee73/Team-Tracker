USE tracking_DB;

-- Gym Seeds to Start
INSERT INTO
  gym (gym_name)
values
  ("Pewter City"),
  ("Cerulean City"),
  ("Vermilion City"),
  ("Celadon City");

-- Specs Seeds to Start
INSERT INTO
  specs (type_1, type_2, power_lvl)
values
  ("Trainer", null, null),
  ("Rock", "Ground", 385),
  ("Rock", "Water", 495),
  ("Water", "Psychic", 520),
  ("Normal", "Flying", 405),
  ("Electric", null, 475),
  ("Water", "Electric", 460),
  ("Grass", "Poison", 525),
  ("Normal", null, 525);

-- Members Seeds to Start
INSERT INTO
  members (mbr_name, gym_id, specs_id, trainer_id)
values
  ("Brock", 1, 1, null),
  ("Onix", 1, 2, 1),
  ("Kabutops", 1, 3, 1),
  ("Misty", 2, 1, null),
  ("Starmie", 2, 4, 4),
  ("Togetic", 2, 5, 4),
  ("Lt. Surge", 3, 1, null),
  ("Raichu", 3, 6, 7),
  ("Lanturn", 3, 7, 7),
  ("Erika", 4, 1, null),
  ("Venusaur", 4, 8, 10),
  ("Chansey", 4, 9, 10);