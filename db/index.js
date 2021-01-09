const connection = require("./connections");

class DB {
    constructor(connection) {
        this.connection = connection
    }
    viewAllEmployees() {
        return this.connection.query(`
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
            roles.title,
            department.dept_name,
            employees.last_name
        `);
    };
    addEmployee(employee) {
        return this.connection.query(`
        INSERT INTO
            employees
        SET
            ?
        `, employee);
    };
}

module.exports = new DB(connection);