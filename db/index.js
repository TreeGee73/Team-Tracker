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
    }
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
    }
    viewAllGyms() {
        return this.connection.query(`
        SELECT
            gym.gym_name AS 'Gym Name'
        FROM
            gym
        ORDER BY
            gym.gym_name
        `);
    }
    addMember(member) {
        return this.connection.query(`
        INSERT INTO
            members
        SET
            ?
        `, member);
    }
    addType(type) {
        return this.connection.query(`
        INSERT INTO
            types
        SET
            ?
        `, type);
    }
    addGym(gym) {
        return this.connection.query(`
        INSERT INTO
            gym
        SET
            ?
        `, gym);
    }
    // updateMembers(memberName) {
    //     return this.connection.query(`UPDATE members SET types_id = ? WHERE id = ?`, memberName);
    // }
    // updateTypes(typeUpdate) {
    //     return this.connection.query(`UPDATE types SET strength = ? WHERE id = ?`, typeUpdate);
    // }
    // removeMembers(memberName) {
    //     return this.connection.query(`DELETE FROM members WHERE id = ?`, memberName);
    // }
    // removeTypes(typeName) {
    //     return this.connection.query(`DELETE FROM types WHERE id = ?`, typeName);
    // }
    // removeGyms(gymName) {
    //     return this.connection.query(`DELETE FROM gym WHERE id = ?`, gymName);
    // }
}

module.exports = new DB(connection);