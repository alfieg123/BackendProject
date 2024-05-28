const db = require("../connection.js")
const { response } = require("../../app.js")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((response) => {
        return response.rows
    })
    .catch((error) => {
        console.error("Error selecting topics:", error);
        throw error;
    });
}