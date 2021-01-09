-- Drops an existing database
DROP DATABASE IF EXISTS tracking_DB;

-- Creates the database
CREATE DATABASE tracking_DB;

USE tracking_DB;

-- Creates the Gym Table
CREATE TABLE gym (
  id INT PRIMARY KEY AUTO_INCREMENT,
  gym_name VARCHAR(50) NULL
);

-- Creates the Types table
CREATE TABLE types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NULL,
  strength INT NULL
);

-- Creates the Members table
CREATE TABLE members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(20) NULL,
  badge_name VARCHAR(20) NULL,
  types_id INT NOT NULL REFERENCES types.id,
  gym_id INT NULL REFERENCES gym.id,
  trainer_id INT NULL REFERENCES members.id,
  FOREIGN KEY (types_id) REFERENCES types(id) ON DELETE CASCADE,
  FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES members(id) ON DELETE SET NULL
);