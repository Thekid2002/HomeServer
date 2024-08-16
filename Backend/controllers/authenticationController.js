const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const path = "authentication";

router.get('/' + asyncHandler(async (req, res, next) => {
    res.send("Not implemented: " + "Authentication page");
}));


module.exports = {router, path};

