const express = require("express")

const { getAllTopics } = require("../be-nc-news/db/controllers/news.controller")

const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics);
app.get("/api", (request, response) => {
    response.sendFile(__dirname + '/endpoints.json')
})

module.exports = app;