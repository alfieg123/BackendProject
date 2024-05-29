const { request } = require("../../app.js")
const { selectTopics, selectArticleByID, selectArticles } = require("../models/news.model.js")

exports.getAllTopics = (request, response, next) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics : topics })
    })
    .catch(next);
}

exports.getArticleByID = (request, response, next) => {
    const id = request.params.article_id
    selectArticleByID(id)
    .then((article) => {
        response.status(200).send({ article })
        })
    .catch(next);
}

exports.getAllArticles = (request, response, next) => {
    selectArticles()
    .then((articles) => {
        response.status(200).send({ articles : articles })
    })
    .catch(next);
}