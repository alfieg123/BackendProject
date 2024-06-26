const db = require("../connection.js")
const { response } = require("../../app.js")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then((response) => {
        return response.rows
    })
}

exports.selectArticleByID = (article_id) => {
    const dbQuery = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles 
    JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1 GROUP BY articles.article_id;`;
  return db.query(dbQuery, [article_id])
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
}

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const validSortColumns = ['created_at', 'comment_count', 'votes'];
    const validOrderValues = ['asc', 'desc'];
    if (!validSortColumns.includes(sort_by)) sort_by = 'created_at';
    if (!validOrderValues.includes(order)) order = 'desc';
    
    let dbQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, 
    articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles 
    JOIN comments ON comments.article_id = articles.article_id`
    let queryTopics = []
    if (topic) {
        dbQuery += ` WHERE articles.topic = $1`;
        queryTopics.push(topic);
      }
    
      dbQuery += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`;
    
      return db.query(dbQuery, queryTopics)
        .then((response) => {
          return response.rows;
        })
    }

exports.selectCommentsByArticleID = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC;`, [article_id])
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
}

exports.selectArticleWithCommentsByID = (article_id) => {
    return this.selectArticleByID(article_id)
        .then((article) => {
            if (!article) {
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${article_id}`,
            })
        }
    return this.selectCommentsByArticleID(article_id)
        .then((comments) => {
          return comments.map((comment) => ({
            comment_id: comment.comment_id,
            votes: comment.votes,
            created_at: comment.created_at,
            author: comment.author,
            body: comment.body,
            article_id: comment.article_id
          }));
        });
    })
};

exports.selectUserByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
  .then((response) => {
      return response.rows[0];
  })
};

exports.insertComment = (article_id, username, body) => {
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id, username, body])
    .then((response) => {
      return response.rows[0];
    })
  };

exports.updateArticleVotesByID = (inc_votes, article_id) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [article_id, inc_votes])
    .then((response) => {
        const article = response.rows[0];
        if (!article) {
            return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
            });
        }
        return article;
        })
    };

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
    .then((response) => {
        const comment = response.rows[0];
        if (!comment) {
            return Promise.reject({
            status: 404,
            msg: `No comment found for comment_id: ${comment_id}`,
            });
        }
        })
    };

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((response) => {
        return response.rows
    })
    }   