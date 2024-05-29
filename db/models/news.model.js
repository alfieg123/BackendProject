const db = require("../connection.js")
const { response } = require("../../app.js")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((response) => {
        return response.rows
    })
    .catch((error) => {
        throw error;
    });
}

exports.selectArticleByID = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((response) => {
        const article = response.rows[0];
        if (!article) {
          return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
        })
        }
    return article
    })
    .catch((error) => {
        throw error;
    });
}


exports.selectArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, 
    articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles 
    JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id ORDER BY articles.created_at DESC;`)
    .then((response) => {
        return response.rows
    })
    .catch((error) => {
        throw error;
    });
}