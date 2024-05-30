const express = require("express")

const { getAllTopics, getArticleByID, getAllArticles, getArticleCommentsByID, postComment, patchArticleVotes } = require("../be-nc-news/db/controllers/news.controller")

const app = express();
app.use(express.json())

app.get("/api", (request, response) => {
    response.sendFile(__dirname + '/endpoints.json')
})
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles/:article_id/comments", getArticleCommentsByID)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
      response.status(error.status).send({ msg: error.msg });
    }
    else if (error.code === '22P02') {
      response.status(400).send({ msg : 'Bad Request' });
    } 
    else if (error.code === '23503') {
        response.status(404).send({ msg: 'User not found' });
    }
    else {
        console.log(error)
      response.status(500).send({ msg: 'Internal Server Error' });
    }
  });

module.exports = app;