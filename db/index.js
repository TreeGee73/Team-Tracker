const connection = require("./connections");

class DB {
    constructor(connection) {
        this.connection = connection
    }
    viewAllMembers() {
        return this.connection.query(`
        SELECT
            members.first_name AS 'Name',
            members.badge_name AS 'Badge Name',
            types.title AS 'Type',
            types.strength AS 'Power Level',
            gym.gym_name AS 'Gym Name',
            trainer.first_name AS 'Trainer'
        FROM
            members
        LEFT JOIN
            types
        ON
            members.types_id = types.id
        LEFT JOIN
            gym
        ON
            members.gym_id = gym.id
        LEFT JOIN
            members trainer
        ON
            trainer.id = members.trainer_id
        ORDER BY
            members.trainer_id,
            members.first_name,
            types.title
        `);
    };
    viewAllTypes() {
        return this.connection.query(`
        SELECT
            types.title AS 'Type',
            types.strength AS 'Power Level'
        FROM
            types
        ORDER BY
            types.strength
        `);
    };
    viewAllGyms() {
        return this.connection.query(`
        SELECT
            gym.gym_name AS 'Gym Name'
        FROM
            gym
        ORDER BY
            gym.gym_name
        `);
    };
}

module.exports = new DB(connection);