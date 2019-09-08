const express = require('express');
const webscrapRouter = express.Router();
const {post} = require("./webscrap-router-def");


webscrapRouter.post("/", post["/"]);

module.exports = webscrapRouter;