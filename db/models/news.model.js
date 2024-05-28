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

exports.selectArticleByID = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, message: "Bad Request - This is not a valid Article ID" });
    }
    else {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((response) => {
        return response.rows[0]
    })
    .catch((error) => {
        console.error("Error selecting topics:", error);
        throw error;
    });
}
}