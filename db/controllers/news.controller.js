const { request } = require("../../app.js")
const { selectTopics, selectArticleByID, selectArticles, selectCommentsByArticleID, 
    selectUserByUsername, insertComment, updateArticleVotesByID, removeComment, selectUsers } = require("../models/news.model.js")

exports.getAllTopics = (request, response, next) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics : topics })
    })
    .catch(next);
}

exports.getArticleByID = (request, response, next) => {
    const article_id = request.params.article_id
    selectArticleByID(article_id)
    .then((article) => {
        response.status(200).send({ article })
        })
    .catch(next);
}

exports.getAllArticles = (request, response, next) => {
    const { topic } = request.query;
    const { sort_by, order } = req.query;
    selectArticles(topic, sort_by, order)
    .then((articles) => {
        response.status(200).send({ articles })
    })
    .catch(next);
}

exports.getArticleCommentsByID = (request, response, next) => {
    const article_id = request.params.article_id
    selectCommentsByArticleID(article_id)
    .then((comments) => {
        response.status(200).send({ comments : [comments]})
    })
    .catch(next);
}

exports.postComment = (request, response, next) => {
    const article_id  = request.params.article_id;
    const { username, body } = request.body;
    selectUserByUsername(username)
    .then((user) => {
        if (!user) {
            return Promise.reject({
                status: 404,
                msg: `User ${username} not found`
            });
        }
        return insertComment(article_id, username, body);
    })
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch(next);
}

exports.patchArticleVotes = (request, response, next) => {
    const article_id = request.params.article_id;
    const { inc_votes } = request.body;
    updateArticleVotesByID(article_id, inc_votes)
    .then((article) => {
        response.status(200).send({ article });
      })
      .catch(next);
  };

  exports.deleteCommentByID = (request, response, next) => {
    const comment_id = request.params.comment_id;
        removeComment(comment_id)
        .then(() => {
            response.status(204).send();
        })
        .catch(next);
}

exports.getAllUsers = (request, response, next) => {
    selectUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
    .catch(next);
}
