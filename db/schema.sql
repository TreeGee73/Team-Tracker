-- Drops an existing database
DROP DATABASE IF EXISTS trackingDB;

-- Creates the database
CREATE DATABASE trackingDB;

USE trackingDB;

-- Creates the Department Table
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dept_name VARCHAR(50) NULL
);

-- Creates the Role table
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(50) NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE 
);

-- Creates the Employee table
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(20) NULL,
  last_name VARCHAR(20) NULL,
  roles_id INT NOT NULL REFERENCES roles.id,
  manager_id INT NULL REFERENCES employee.id,
  FOREIGN KEY (roles_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);


-- Department Seeds to Start
INSERT INTO
  department (dept_name)
values
  ("Marketing"),
  ("Sales"),
  ("Information Technology"),
  ("Human Resources");

-- Role Seeds to Start
INSERT INTO
  roles (title, salary, department_id)
values
  ("Marketing Manager", 75000, 1),
  ("Sales Manager", 80000, 2),
  ("Software Engineer", 110000, 3),
  ("HR Generalist", 90000, 4);

-- Employees Seeds to Start
INSERT INTO
  employees (first_name, last_name, roles_id, manager_id)
values
  ("Megan", "Petrik", 1, null),
  ("Brian", "Covey", 2, 1),
  ("Theresa", "Grier", 3, 1),
  ("Dave", "Gazzilo", 4, 1);

SELECT
employees.first_name,
employees.last_name,
roles.title,
roles.salary,
department.dept_name,
CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM
employees
LEFT JOIN
roles
ON
employees.roles_id = roles.id
LEFT JOIN
department
ON 
roles.department_id = department.id
LEFT JOIN
employees manager
ON
manager.id = employees.manager_id
ORDER BY
department.dept_name,
roles.title,
employees.last_name