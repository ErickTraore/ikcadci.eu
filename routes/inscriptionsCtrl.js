// Imports
const fs = require('fs')
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
const usersCtrl = require('./usersCtrl');
const fileUpload = require("express-fileupload");
const path = require("path");
const util = require('util');
const { Console } = require('console');
// httpServer.listen(8080);
// Constants
const IDADMIN_LIMIT = 1;
const IDETUDIANT_LIMIT = 1;
const ITEMS_LIMIT = 2;
// const ITEMS_LIMIT = 50;
// Routes
module.exports = {
    createInscription: function(req, res) {
        // Getting auth header
        console.log(req.body);
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        // Params
        var email = req.body.email;
        var refFormation = req.body.refFormation;
        var idAdmin = req.body.idAdmin;
        var idEtudiant = req.body.idEtudiant;
        var content = req.body.content;
        var activeInscription = req.body.activeInscription;
        if (idEtudiant == null || idAdmin == null || email == null) {
            return res.status(400).json({ 'error': 'missing (null) parameters' });
        }
        if (refFormation == null || activeInscription == null) {
            return res.status(400).json({ 'error': 'missing (null) parameter idAdmin' });
        }
        if (idAdmin.length < IDADMIN_LIMIT || idEtudiant.length < IDETUDIANT_LIMIT || email.length < 5) {
            return res.status(400).json({ 'error': 'invalid (length) parameters' });
        }
        asyncLib.waterfall([
                function(done) {
                    models.User.findOne({
                            attributes: ['email'],
                            where: { email: email }
                        })
                        .then(function(userFound) {
                            done(null, userFound);
                        })
                        .catch(function(err) {
                            return res.status(500).json({ 'error': 'unable to verify user' });
                        });
                },
                function(userFound, done) {
                    if (userFound) {
                        models.Inscription.create({
                                email: email,
                                refFormation: refFormation,
                                idAdmin: userFound.id,
                                idEtudiant: idEtudiant,
                                content: content || null,
                                dateExpire: null,
                                activeInscription: true
                            })
                            .then(function(newInscription) {
                                done(newInscription);
                            })
                            .catch(function(err) {
                                return res.status(500).json({ 'error': 'unable to create user' });
                            });

                    } else {

                        return res.status(500).json({ 'error': 'unable to create table inscription' });
                    }
                },
            ],
            function(newInscription) {
                if (newInscription) {
                    return res.status(201).json(newInscription);
                } else {
                    return res.status(500).json({ 'error': 'cannot post Inscription' });
                }
            });
    },
    listInscriptions: function(req, res) {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }
        models.Inscription.findAll({
            order: [(order != null) ? order.split(':') : ['refFormation', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            order: [
                ['id', 'DESC']
            ],
        }).then(function(inscriptions) {
            if (inscriptions) {
                res.status(200).json(inscriptions);
            } else {
                res.status(404).json({ "error": "no inscriptions found" });
            }
        }).catch(function(err) {
            res.status(500).json({ "error": "invalid fields" });
        });
    },
    // listMessagesAdmin: function(req, res) {
    //     var fields = req.query.fields;
    //     var limit = parseInt(req.query.limit);
    //     var offset = parseInt(req.query.offset);
    //     var order = req.query.order;

    //     if (limit > ITEMS_LIMIT) {
    //         limit = ITEMS_LIMIT;
    //     }

    //     models.Message.findAll({
    //         order: [(order != null) ? order.split(':') : ['refFormation', 'ASC']],
    //         attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
    //         limit: (!isNaN(limit)) ? limit : null,
    //         offset: (!isNaN(offset)) ? offset : null,
    //         include: [{
    //             model: models.User,
    //             attributes: ['username', 'email']
    //         }],
    //         order: [
    //             ['id', 'DESC']
    //         ],
    //     }).then(function(messages) {
    //         if (messages) {
    //             res.status(200).json(messages);
    //         } else {
    //             res.status(404).json({ "error": "no messages found" });
    //         }
    //     }).catch(function(err) {
    //         res.status(500).json({ "error": "invalid fields" });
    //     });
    // },
    // delMessPost: function(req, res) {
    //     // Getting auth header
    //     var headerAuth = req.headers['authorization'];
    //     var userId = jwtUtils.getUserId(headerAuth);
    //     var recepteur = userId
    //     console.log('Utilisateur', userId);
    //     console.log(headerAuth);

    //     // Params
    //     var messageId = parseInt(req.params.messageId);
    //     console.log('message.id', messageId);

    //     if (messageId <= 0) {
    //         return res.status(400).json({ 'error': 'invalid parameters' });
    //     }

    //     asyncLib.waterfall([
    //             // on charge le message concerné dans la variable messageFound..
    //             function(done) {
    //                 models.User.findOne({
    //                         where: {
    //                             id: userId
    //                         }
    //                     })
    //                     .then(function(userLive) {
    //                         done(null, userLive);
    //                     })
    //                     .catch(function(error) {
    //                         return res.status(500).json({ 'error': 'unable to load user' });
    //                     });
    //             },
    //             function(userLive, done) {
    //                 if (userLive) {

    //                     models.Message.findOne({
    //                             where: {
    //                                 id: messageId,
    //                             }
    //                         })
    //                         .then(function(messageLive) {
    //                             done(null, messageLive, userLive);
    //                         })
    //                         .catch(function(error) {
    //                             return res.status(502).json({ 'error': 'is not the owner message' });
    //                         });
    //                 } else {
    //                     return res.status(201).json({ 'error': 'You are not the owner message' });
    //                 }
    //             },
    //             function(messageLive, userLive, done) {
    //                 console.log('messageLive.UserId :', messageLive)
    //                 console.log('userId', userId)
    //                 console.log('messageLive.UserId :', messageLive.UserId)
    //                 console.log('messageLive.Likes :', messageLive.likes)
    //                 console.log('messageLive.Dislikes :', messageLive.dislikes)
    //                 console.log('messageLive.id :', messageId)
    //                 if (messageLive.UserId = userId) {
    //                     messageLive.update({
    //                         likes: messageLive.likes * 0,
    //                         dislikes: messageLive.dislike * 0,
    //                     }).then(function() {
    //                         done(messageLive);
    //                     }).catch(function(err) {
    //                         res.status(500).json({ 'error': 'cannot update likes=0 and dislike=0' });
    //                     });
    //                     models.Like.destroy({
    //                             where: {
    //                                 messageId: messageId,
    //                             }
    //                         })
    //                         .then(function(newLike) {
    //                             // return res.status(200).json({ deleteLikeLive });
    //                             done(newLike)
    //                         })
    //                         .catch(function(error) {
    //                             return res.status(502).json({ 'error': 'unable to delete like' });
    //                         });
    //                     models.Message.destroy({
    //                             where: {
    //                                 id: messageId,
    //                             }
    //                         })
    //                         .then(function(destroyMessage) {
    //                             // return res.status(200).json({ deleteLikeLive });
    //                             done(destroyMessage)
    //                         })
    //                         .catch(function(error) {
    //                             return res.status(502).json({ 'error': 'unable to delete like' });
    //                         });
    //                 } else {
    //                     res.status(404).json({ 'error': 'unable to load message found' });
    //                 }
    //             },
    //         ],
    //         function(destroyMessage) {
    //             if (!destroyMessage) {
    //                 return res.status(201).json('message delete');
    //             } else {
    //                 return res.status(500).json({ 'error': 'cannot delete message' });
    //             }
    //         }

    //     );
    // },
    // delMessPostAdmin: function(req, res) {
    //     // Getting auth header
    //     var headerAuth = req.headers['authorization'];
    //     var userId = jwtUtils.getUserId(headerAuth);
    //     console.log('Utilisateur', userId);
    //     console.log(headerAuth);

    //     // Params
    //     var messageId = parseInt(req.params.messageId);
    //     console.log('message.id', messageId);

    //     if (messageId <= 0) {
    //         return res.status(400).json({ 'error': 'invalid parameters' });
    //     }

    //     asyncLib.waterfall([
    //             // on charge le message concerné dans la variable messageFound..
    //             function(done) {
    //                 models.User.findOne({
    //                         where: {
    //                             id: userId
    //                         }
    //                     })
    //                     .then(function(userLive) {
    //                         done(null, userLive);
    //                     })
    //                     .catch(function(error) {
    //                         return res.status(500).json({ 'error': 'unable to load user' });
    //                     });
    //             },
    //             function(userLive, done) {
    //                 if (userLive) {

    //                     models.Message.findOne({
    //                             where: {
    //                                 id: messageId,
    //                             }
    //                         })
    //                         .then(function(messageLive) {
    //                             done(null, messageLive, userLive);
    //                         })
    //                         .catch(function(error) {
    //                             return res.status(502).json({ 'error': 'is not the owner message' });
    //                         });
    //                 } else {
    //                     return res.status(201).json({ 'error': 'You are not the owner message' });
    //                 }

    //             },
    //             function(messageLive, userLive, done) {
    //                 if (messageLive) {
    //                     models.Message.destroy({
    //                             where: {
    //                                 id: messageId,
    //                             }
    //                         })
    //                         .then(function(destroyMessage) {
    //                             // return res.status(200).json({ deleteLikeLive });
    //                             done(destroyMessage)
    //                         })
    //                         .catch(function(error) {
    //                             return res.status(404).json({ 'error': 'unable to destroy message' });
    //                         });
    //                 } else {
    //                     res.status(404).json({ 'error': 'unable to load message found' });
    //                 }
    //             },
    //         ],
    //         function(destroyMessage) {
    //             if (destroyMessage) {
    //                 return res.status(201).json('message delete');
    //             } else {
    //                 return res.status(500).json({ 'error': 'cannot delete message' });
    //             }
    //         }

    //     );
    // },
    // uploadImage: async function(req, res) {
    //     // return Promise.resolve('traore erick');
    //     // console.log(req);
    //     // console.log(JSON.stringify(req).files)
    //     var file = req.files.file;
    //     var fileName = file.name;
    //     console.log('UN YANKEE');
    //     console.log('fileName ligne 187:', fileName);
    //     var size = file.data.length;
    //     var extension = path.extname(fileName);

    //     var allowedExtensions = /png|jpeg|jpg|gif/;
    //     const md5 = file.md5;
    //     const URL = "/images/" + md5 + extension;
    //     const idImage = md5 + extension;
    //     console.log('numero image enregistrée ligne 195:', idImage);

    //     try {
    //         if (!allowedExtensions.test(extension)) throw "unsupported extension!";
    //         if (size > 5000000) throw "File must be less than 5 MB";
    //         await util.promisify(file.mv)("./public" + URL);
    //         res.status(200).json({
    //             idImage,
    //         })
    //     } catch (err) {
    //         console.log(err);
    //         res.status(500).json({
    //             message: err,
    //         });
    //     };

    // },
    // delLienImage: function(req, res) {
    //     var file = req.files.file;
    //     var fileName = file.name;
    //     console.log('UN YANKEE');
    //     console.log('fileName ligne 187:', fileName);
    //     var size = file.data.length;
    //     var extension = path.extname(fileName);
    //     var allowedExtensions = /png|jpeg|jpg|gif/;
    //     const md5 = file.md5;
    //     const URL = "/images/" + md5 + extension;
    //     const idImage = md5 + extension;
    //     console.log(URL);
    //     console.log(idImage);
    //     const chemin = idImage;
    //     console.log('chemin', chemin);
    //     fs.unlink("./public/images/" + idImage, (err) => {
    //         if (err) {
    //             console.error(err)
    //             return
    //         }
    //     });
    // }
}