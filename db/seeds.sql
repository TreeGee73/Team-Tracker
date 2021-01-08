USE employee_db;

-- Department Seeds to Start
INSERT INTO departments (dept) values ("Marketing");
INSERT INTO departments (dept) values ("Sales");
INSERT INTO departments (dept) values ("Information Technology");
INSERT INTO departments (dept) values ("Human Resources");

-- Role Seeds to Start
INSERT INTO roles (title, salary, dept_id) values ("Marketing Manager", 75000, 1);
INSERT INTO roles (title, salary, dept_id) values ("Sales Manager", 80000, 2);
INSERT INTO roles (title, salary, dept_id) values ("Software Engineer", 110000, 3);
INSERT INTO roles (title, salary, dept_id) values ("HR Generalist", 90000, 4);

-- Employees Seeds to Start
INSERT INTO employees (first_name, last_name, roles_id) values ("Megan", "Petrik", 1);
INSERT INTO employees (first_name, last_name, roles_id) values ("Brian", "Covey", 2);
INSERT INTO employees (first_name, last_name, roles_id) values ("Theresa", "Grier", 3);
INSERT INTO employees (first_name, last_name, roles_id) values ("Dave", "Gazzilo", 4);