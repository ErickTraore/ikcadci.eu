// Imports
const fs = require('fs')
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
const usersCtrl = require('./usersCtrl');

const fileUpload = require("express-fileupload");
const path = require("path");
const util = require('util');

// httpServer.listen(8080);
// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 3;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
    createPiece: function(req, res) {
        // Getting auth header
        console.log(req);
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var title = req.body.title;
        var content = req.body.content;
        var attachment = req.body.attachment;
        if (title == null || content == null) {
            return res.status(400).json({ 'error': 'missing (null) parameters' });
        }

        if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
            return res.status(400).json({ 'error': 'invalid (length) parameters' });
        }


        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                        where: { id: userId }
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
                    models.Piece.create({
                            title: title,
                            content: content,
                            attachment: attachment || null,
                            likes: 0,
                            dislikes: 0,
                            UserId: userFound.id
                        })
                        .then(function(newPiece) {
                            done(newPiece);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function(newPiece) {
            if (newPiece) {
                return res.status(201).json(newPiece);
            } else {
                return res.status(500).json({ 'error': 'cannot post piece' });
            }
        });
    },
    listPieces: function(req, res) {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Piece.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['username', 'email']
            }],
            order: [
                ['id', 'DESC']
            ],
        }).then(function(pieces) {
            if (pieces) {
                res.status(200).json(pieces);
            } else {
                res.status(404).json({ "error": "no pieces found" });
            }
        }).catch(function(err) {
            res.status(500).json({ "error": "invalid fields" });
        });
    },
    listPiecesAdmin: function(req, res) {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Piece.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['username', 'email']
            }],
            order: [
                ['id', 'DESC']
            ],
        }).then(function(pieces) {
            if (pieces) {
                res.status(200).json(pieces);
            } else {
                res.status(404).json({ "error": "no pieces found" });
            }
        }).catch(function(err) {
            res.status(500).json({ "error": "invalid fields" });
        });
    },
    delPiecePost: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var recepteur = userId
        console.log('Utilisateur', userId);
        console.log(headerAuth);

        // Params
        var pieceId = parseInt(req.params.pieceId);
        console.log('piece.id', pieceId);

        if (pieceId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        asyncLib.waterfall([
                // on charge le piece concerné dans la variable pieceFound..
                function(done) {
                    models.User.findOne({
                            where: {
                                id: userId
                            }
                        })
                        .then(function(userLive) {
                            done(null, userLive);
                        })
                        .catch(function(error) {
                            return res.status(500).json({ 'error': 'unable to load user' });
                        });
                },
                function(userLive, done) {
                    if (userLive) {

                        models.Piece.findOne({
                                where: {
                                    id: pieceId,
                                }
                            })
                            .then(function(pieceLive) {
                                done(null, pieceLive, userLive);
                            })
                            .catch(function(error) {
                                return res.status(500).json({ 'error': 'is not the owner piece' });
                            });
                    } else {
                        return res.status(201).json({ 'error': 'You are not the owner piece' });
                    }

                },
                function(pieceLive, userLive, done) {
                    console.log('pieceLive.UserId :', pieceLive)
                    console.log('userId', userId)
                    console.log('pieceLive.UserId :', pieceLive.UserId)
                    console.log('pieceLive.Likes :', pieceLive.likes)
                    console.log('pieceLive.Dislikes :', pieceLive.dislikes)
                    console.log('pieceLive.id :', pieceId)
                    if (pieceLive.UserId = userId) {
                        pieceLive.update({
                            likes: pieceLive.likes * 0,
                            dislikes: pieceLive.dislike * 0,
                        }).then(function() {
                            done(pieceLive);
                        }).catch(function(err) {
                            res.status(500).json({ 'error': 'cannot update likes=0 and dislike=0' });
                        });

                        models.Piece.destroy({
                                where: {
                                    id: pieceId,
                                }
                            })
                            .then(function(destroyPiece) {
                                // return res.status(200).json({ deleteLikeLive });
                                done(destroyPiece)
                            })
                            .catch(function(error) {
                                return res.status(502).json({ 'error': 'unable to delete piece' });
                            });


                    } else {
                        res.status(404).json({ 'error': 'unable to load piece found' });
                    }
                },
            ],
            function(destroyPiece) {
                if (destroyPiece) {
                    return res.status(201).json('piece delete');
                } else {
                    return res.status(500).json({ 'error': 'cannot delete piece' });
                }
            }

        );
    },
    delPiecePostAdmin: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        console.log('Utilisateur', userId);
        console.log(headerAuth);

        // Params
        var messageId = parseInt(req.params.pieceId);
        console.log('piece.id', pieceId);

        if (pieceId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        asyncLib.waterfall([
                // on charge le message concerné dans la variable messageFound..
                function(done) {
                    models.User.findOne({
                            where: {
                                id: userId
                            }
                        })
                        .then(function(userLive) {
                            done(null, userLive);
                        })
                        .catch(function(error) {
                            return res.status(500).json({ 'error': 'unable to load user' });
                        });
                },
                function(userLive, done) {
                    if (userLive) {

                        models.Piece.findOne({
                                where: {
                                    id: pieceId,
                                }
                            })
                            .then(function(pieceLive) {
                                done(null, pieceLive, userLive);
                            })
                            .catch(function(error) {
                                return res.status(502).json({ 'error': 'is not the owner piece' });
                            });
                    } else {
                        return res.status(201).json({ 'error': 'You are not the owner piece' });
                    }

                },
                function(pieceLive, userLive, done) {
                    if (pieceLive) {
                        models.Piece.destroy({
                                where: {
                                    id: pieceId,
                                }
                            })
                            .then(function(destroyPiece) {
                                // return res.status(200).json({ deleteLikeLive });
                                done(destroyPiece)
                            })
                            .catch(function(error) {
                                return res.status(404).json({ 'error': 'unable to destroy piece' });
                            });
                    } else {
                        res.status(404).json({ 'error': 'unable to load piece found' });
                    }
                },
            ],
            function(destroyPiece) {
                if (destroyPiece) {
                    return res.status(201).json('piece delete');
                } else {
                    return res.status(500).json({ 'error': 'cannot delete piece' });
                }
            }

        );
    },
    uploadImage: async function(req, res) {
        // return Promise.resolve('traore erick');
        // console.log(req);
        // console.log(JSON.stringify(req).files)
        var file = req.files.file;
        var fileName = file.name;
        console.log('UN YANKEE');
        console.log('fileName ligne 187:', fileName);
        var size = file.data.length;
        var extension = path.extname(fileName);

        var allowedExtensions = /png|jpeg|jpg|gif/;
        const md5 = file.md5;
        const URL = "/images/" + md5 + extension;
        const idImage = md5 + extension;
        console.log('numero image enregistrée ligne 195:', idImage);


        try {
            if (!allowedExtensions.test(extension)) throw "unsupported extension!";
            if (size > 5000000) throw "File must be less than 5 MB";

            await util.promisify(file.mv)("./public" + URL);
            res.status(200).json({
                idImage,
            })

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err,
            });
        };

    },
    delLienImage: function(req, res) {
        var file = req.files.file;
        var fileName = file.name;
        console.log('UN YANKEE');
        console.log('fileName ligne 187:', fileName);
        var size = file.data.length;
        var extension = path.extname(fileName);

        var allowedExtensions = /png|jpeg|jpg|gif/;
        const md5 = file.md5;
        const URL = "/images/" + md5 + extension;
        const idImage = md5 + extension;
        console.log(URL);
        console.log(idImage);
        const chemin = idImage;
        console.log('chemin', chemin);
        fs.unlink("./public/images/" + idImage, (err) => {
            if (err) {
                console.error(err)
                return
            }


        });
    }
}