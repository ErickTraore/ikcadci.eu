// Imports
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');
const messagesCtrl = require('./routes/messagesCtrl');
const formationsCtrl = require('./routes/formationsCtrl');
const inscriptionsCtrl = require('./routes/inscriptionsCtrl');
const likesCtrl = require('./routes/likesCtrl');
const auth = require('./middleware/auth');
const router = express.Router();


// Router
exports.router = (function() {
    var router = express.Router();
    // Users routes
    // router.post('/users/verifEmail/', usersCtrl.verificationEmail);
    router.get('/users/', usersCtrl.listUsers);
    router.get('/users/me/', auth, usersCtrl.getUserProfile);
    router.post('/users/register/', usersCtrl.register);
    router.post('/users/login/', usersCtrl.login);
    router.get('/users/classroom/', usersCtrl.classroom);
    router.post('/users/delProfil/', usersCtrl.destroyProfil);
    router.post('/users/:userId/del', usersCtrl.destroyUser);
    router.get('/users/:userId/read', usersCtrl.readUser);
    // router.post('/users/:userId/delMe', usersCtrl.delMeUser);
    router.put('/users/me/', usersCtrl.updateUserProfile);

    router.get('/messages/', messagesCtrl.listMessages);
    router.get('/messagesAdmin/', messagesCtrl.listMessagesAdmin);
    router.post('/messages/new/', messagesCtrl.createMessage);
    router.post('/messages/:messageId/del', messagesCtrl.delMessPost);
    router.post('/messages/:messageId/delete', messagesCtrl.delMessPostAdmin);
    router.post('/messages/:messageId/vote/like', likesCtrl.likePost);
    router.post('/messages/:messageId/vote/dislike', likesCtrl.dislikePost);

    router.post("/messages/upload", messagesCtrl.uploadImage);
    router.post("/messages/delLienImage", messagesCtrl.delLienImage);

    router.get('/formations/', formationsCtrl.listFormations);
    router.post("/formations/upload", formationsCtrl.uploadImage);
    router.post('/formations/new/', formationsCtrl.createFormation);

    router.post('/inscriptions/new/', inscriptionsCtrl.createInscription);
    router.get('/listInscriptions/list/', inscriptionsCtrl.listInscriptions);

    return router;

})();