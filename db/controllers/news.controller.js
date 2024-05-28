const { request } = require("../../app.js")
const { selectTopics } = require("../models/news.model.js")

exports.getAllTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics : topics })
    })
    .catch((error) => {
        console.error("Error fetching topics:", error);
        response.status(500).send("Internal server error");
    });
}