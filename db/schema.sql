-- Drops an existing database
DROP DATABASE IF EXISTS trackingDB;

-- Creates the database
CREATE DATABASE trackingDB;

USE trackingDB;

-- Creates the Department Table
CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(50) NULL,
  PRIMARY KEY (id)
);

-- Creates the Role table
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NULL,
  salary DECIMAL NOT NULL,
  departments_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Creates the Employee table
CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(20) NULL,
  last_name VARCHAR(20) NULL,
  roles_id INT NOT NULL REFERENCES roles.id,
  manager_id INT NULL REFERENCES employee.id,
  PRIMARY KEY (id)
);
