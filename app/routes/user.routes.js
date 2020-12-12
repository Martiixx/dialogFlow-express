module.exports = app => {
    const user = require('../controllers/user.controller.js');

    let router = require('express').Router();

    // router.post('/transaction', user.createTransaction);

    // router.get('/user-account', user.getUserData);

    // router.get('/get-indicators', user.getIndicators);

    router.get('/init-user', user.initUser);

    app.use('/',router);
}
