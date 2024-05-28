const { request } = require("../../app.js")
const { selectTopics, selectArticleByID } = require("../models/news.model.js")

exports.getAllTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics : topics })
    })
    .catch((error) => {
        console.log("Error fetching topics:", error);
    });
}

exports.getArticleByID = (request, response) => {
    const id = request.params.article_id
    selectArticleByID(id)
    .then((article) => {
        if(!article) {
            return response.status(404).send({ error: "Article ID Not Found" });
        }
        else {
        const responseObject = { article } 
        response.status(200).send(responseObject)
        }
    })
    .catch((error) => {
        if (error.status === 400) {
            response.status(400).send({ error: "Bad Request - This is not a valid Article ID" });
        }
        else {
        console.log("Error fetching article:", error);
        }
    });
}