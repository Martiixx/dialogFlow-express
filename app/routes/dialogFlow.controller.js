module.exports = app => {
    const dialogFlow = require('../controllers/dialogFlow.controller.js');

    let router = require('express').Router();

    router.get('/start-dialog', dialogFlow.startDialog);

    app.use('/',router);
}
