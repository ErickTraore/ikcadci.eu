"use strict";
// Imports
const fs = require('fs')
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');
const usersCtrl = require('./usersCtrl');

const fileUpload = require("express-fileupload");
const path = require("path");
const util = require('util');
const { response } = require('express');

// httpServer.listen(8080);
// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 3;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
    createStudent: function(req, res) {
        // Getting auth header
        console.log(req.body);
        console.log('Je suis un YANKEE');
        var headerAuth = req.headers['authorization'];
        var userAdmin = jwtUtils.getUserId(headerAuth);

        // Params
        var studentFound = req.body.id;
        var username = req.body.username;
        var email = req.body.email;
        var lastname = req.body.lastname;
        var usernameTradition = req.body.usernameTradition;
        var lastnameTradition = req.body.lastnameTradition;
        var dateBirthday = req.body.dateBirthday;
        var townBirthday = req.body.townBirthday;
        var nationalite = req.body.nationalite;
        var sexe = req.body.sexe;
        var adresseResid = req.body.adresseResid;
        var villeResid = req.body.villeResid;
        var paysResid = req.body.paysResid;
        var tel1 = req.body.tel1;
        var tel2 = req.body.tel2;
        var tel3 = req.body.tel3;
        var picked = req.body.picked;
        var seshsw = req.body.seshsw;
        var seshswNsw = req.body.seshswNsw;
        var seba = req.body.seba;
        var profession = req.body.profession;
        var activite = req.body.activite;
        var acceptOne = req.body.acceptOne;
        var acceptTwo = req.body.acceptTwo;
        console.log('email.length', email.length);

        if (username == null || email == null) {
            return res.status(400).json({ 'error': 'missing (null) parameters' });
        }
        if (email.length <= TITLE_LIMIT || username.length <= CONTENT_LIMIT) {
            console.log('username', username)
            console.log('email', email)
            return res.status(400).json({ 'error': 'invalid (length) parameters' });
        }
        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                        where: { id: studentFound }
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
                    models.Student.create({
                            username: username,
                            lastname: lastname,
                            email: email,
                            usernameTradition: usernameTradition || null,
                            lastnameTradition: lastnameTradition,
                            UserId: studentFound,
                            dateBirthday: dateBirthday,
                            townBirthday: townBirthday,
                            nationalite: nationalite,
                            sexe: sexe,
                            adresseResid: adresseResid,
                            villeResid: villeResid,
                            paysResid: paysResid,
                            tel1: tel1,
                            tel2: tel2,
                            tel3: tel3,
                            picked: picked,
                            seshsw: seshsw,
                            seshswNsw: seshswNsw,
                            seba: seba,
                            profession: profession,
                            activite: activite,
                            acceptOne: acceptOne,
                            acceptTwo: acceptTwo,
                        })
                        .then(function(newStudent) {
                            done(newStudent);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function(newStudent) {
            if (newStudent) {
                return res.status(201).json(newStudent);
            } else {
                return res.status(500).json({ 'error': 'cannot post Student' });
            }
        });
    },
    listStudents: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        console.log('Je suis un ANKEE')
        console.log('userId-un', userId)
        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        asyncLib.waterfall([
                function(done) {
                    models.Student.findAll({

                        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
                        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                        limit: (!isNaN(limit)) ? limit : null,
                        offset: (!isNaN(offset)) ? offset : null,
                        include: [{
                            model: models.User,
                            attributes: ['id', 'email']
                        }],
                        order: [
                            ['id', 'DESC']
                        ],
                    }).then(function(studentsFound) {
                        done(studentsFound)
                    }).catch(function(err) {
                        res.status(500).json({ "error": "invalid fields" });
                    });
                }
            ],
            function(studentsFound) {
                if (studentsFound) {
                    return res.status(201).json(studentsFound);
                } else {
                    return res.status(500).json({ 'error': 'cannot post message' });
                }
            });
    },
    listOneStudents: function(req, res) {
        console.log(req.params);
        console.log(req.params.studentId);
        var userId = parseInt(req.params.studentId)
        asyncLib.waterfall([
                function(done) {
                    models.Student.findOne({
                        where: {
                            userId: userId
                        },
                    }).then(function(studentFound) {
                        done(studentFound)
                    }).catch(function(err) {
                        res.status(500).json({ "error": "invalid fields" });
                    });
                }
            ],
            function(studentFound) {
                if (studentFound) {
                    console.log('ok')
                    console.log(process.env.LANG)
                    return res.status(201).json(studentFound);
                } else {
                    return res.status(500).json({ 'error': 'cannot post message' });
                }
            });
    },
    listStudentsAdmin: function(req, res) {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Student.findAll({
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
        }).then(function(students) {
            if (students) {
                res.status(200).json(students);
            } else {
                res.status(404).json({ "error": "no students found" });
            }
        }).catch(function(err) {
            res.status(500).json({ "error": "invalid fields" });
        });
    },
    delStudentPost: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var recepteur = userId
        console.log('Utilisateur', userId);
        console.log(headerAuth);
        // Params
        var StudentId = parseInt(req.params.studentId);
        console.log('student.id', StudentId);

        if (StudentId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }
        asyncLib.waterfall([
                // on charge le Student concerné dans la variable studentFound..
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
                        models.Student.findOne({
                                where: {
                                    id: studentId,
                                }
                            })
                            .then(function(studentLive) {
                                done(null, studentLive, userLive);
                            })
                            .catch(function(error) {
                                return res.status(500).json({ 'error': 'is not the owner Student' });
                            });
                    } else {
                        return res.status(201).json({ 'error': 'You are not the owner Student' });
                    }
                },
                function(studentLive, userLive, done) {
                    console.log('studentLive.UserId :', studentLive)
                    console.log('userId', userId)
                    console.log('studentLive.UserId :', studentLive.UserId)
                    console.log('studentLive.Likes :', studentLive.likes)
                    console.log('studentLive.Dislikes :', studentLive.dislikes)
                    console.log('studentLive.id :', studentId)
                    if (studentLive.UserId = userId) {
                        studentLive.update({
                            likes: studentLive.likes * 0,
                            dislikes: studentLive.dislike * 0,
                        }).then(function() {
                            done(studentLive);
                        }).catch(function(err) {
                            res.status(500).json({ 'error': 'cannot update likes=0 and dislike=0' });
                        });
                        models.Like.destroy({
                                where: {
                                    studentId: studentId,
                                }
                            })
                            .then(function(newLike) {
                                // return res.status(200).json({ deleteLikeLive });
                                done(newLike)
                            })
                            .catch(function(error) {
                                return res.status(502).json({ 'error': 'unable to delete like' });
                            });
                        models.Student.destroy({
                                where: {
                                    id: studentId,
                                }
                            })
                            .then(function(destroyStudent) {
                                // return res.status(200).json({ deleteLikeLive });
                                done(destroyStudent)
                            })
                            .catch(function(error) {
                                return res.status(502).json({ 'error': 'unable to delete like' });
                            });
                    } else {
                        res.status(404).json({ 'error': 'unable to load Student found' });
                    }
                },
            ],
            function(destroyStudent) {
                if (!destroyStudent) {
                    return res.status(200).json({ 'error': 'Student delete' });

                } else {
                    return res.status(501).json('cannot destroy Student');
                }
            }

        );
    },
    delMessPostAdmin: function(req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        console.log('Utilisateur', userId);
        console.log(headerAuth);

        // Params
        var StudentId = parseInt(req.params.StudentId);
        console.log('Student.id', StudentId);

        if (StudentId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        asyncLib.waterfall([
                // on charge le Student concerné dans la variable StudentFound..
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

                        models.Student.findOne({
                                where: {
                                    id: StudentId,
                                }
                            })
                            .then(function(StudentLive) {
                                done(null, StudentLive, userLive);
                            })
                            .catch(function(error) {
                                return res.status(502).json({ 'error': 'is not the owner Student' });
                            });
                    } else {
                        return res.status(201).json({ 'error': 'You are not the owner Student' });
                    }
                },
                function(StudentLive, userLive, done) {
                    if (StudentLive) {
                        models.Student.destroy({
                                where: {
                                    id: StudentId,
                                }
                            })
                            .then(function(destroyStudent) {
                                // return res.status(200).json({ deleteLikeLive });
                                done(destroyStudent)
                            })
                            .catch(function(error) {
                                return res.status(404).json({ 'error': 'unable to destroy Student' });
                            });
                    } else {
                        res.status(404).json({ 'error': 'unable to load Student found' });
                    }
                },
            ],
            function(destroyStudent) {
                if (destroyStudent) {
                    return res.status(201).json('Student delete');
                } else {
                    return res.status(500).json({ 'error': 'cannot delete Student' });
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

        var allowedExtensions = /png|jpeg|jpg|pdf|gif/;
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
                Student: err,
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
    },
    theMailer: function(req, res) {

        const nodemailer = require('nodemailer');
        //data statique
        const yourEmail = "webadmin@ikcadci.com";
        const yourPass = "Erick2691.Erick2691";
        const mailHost = "smtp.ionos.fr";
        const mailPort = 465;
        //data tatique

        const senderEmail = "traoreerick@gmail.com"
        const subjectEmail = "traoreerick@gmail.com"
        const textEmail = "traoreerick@gmail.com"

        var transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            // secure: false,
            //service: 'gmail',
            auth: {
                user: yourEmail,
                pass: yourPass,
            },
            tls: {
                rejectUnauthorized: false
            },
        });
        var mailOptions = {
            from: yourEmail,
            to: senderEmail,
            subject: subjectEmail,
            text: textEmail,
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return res.status(500).json('Bad mail');

            } else {
                return res.status(200).json('Good mail');
            }
        })
    },
    contactMailer: function(req, res) {
        console.log('anyone there?')
        res.json(req.body);
        console.log(req.body);
        const nodemailer = require('nodemailer');
        //data statique
        const yourEmail = "webadmin@ikcadci.com";
        const yourPass = "Erick2691.Erick2691";
        const mailHost = "smtp.ionos.fr";
        const mailPort = 465;
        //data tatique
        const senderEmail = "traoreerick@gmail.com"
        const subjectEmail = "traoreerick@gmail.com"
        const textEmail = "traoreerick@gmail.com"

        var transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            // secure: false,
            //service: 'gmail',
            auth: {
                user: yourEmail,
                pass: yourPass,
            },
            tls: {
                rejectUnauthorized: false
            },
        });
        var mailOptions = {
            from: yourEmail,
            to: senderEmail,
            subject: subjectEmail,
            text: textEmail,
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return res.status(500).json('Bad mail');

            } else {
                return res.status(200).json('Good mail');
            }
        })
    },
    goMailer: function(req, res) {
        res.json(req.body);
        console.log(req.body);



        console.log(req.params);
        console.log(req.params.studentUserId);
        var userId = parseInt(req.params.studentId)

        asyncLib.waterfall([
                function(done) {
                    models.Student.findOne({
                        where: {
                            userId: userId
                        },
                    }).then(function(studentFound) {
                        done(studentFound)
                    }).catch(function(err) {
                        res.status(500).json({ "error": "invalid fields" });
                    });
                }
            ],
            function(studentFound) {
                if (studentFound.email) {
                    console.log('Voici mon email', studentFound.email)
                    console.log('Voici mon body', req.body)
                    console.log('Voici mon body message', req.body.message)
                    const nodemailer = require('nodemailer');
                    //data static
                    const yourEmail = "webadmin@ikcadci.com";
                    const yourPass = "Erick2691.Erick2691";
                    const mailHost = "smtp.ionos.fr";
                    const mailPort = 465;
                    //data dynamique
                    const senderEmail = studentFound.email
                        //Data content
                    const subjectEmail = "traoreerick@gmail.com"
                        // const htmlEmail = req.body.message
                    const htmlEmail = {
                        path: './public/emails/emailStudent.handlebars'
                    }

                    ///////////////////////
                    const path = require('path')
                    var hbs = require('nodemailer-express-handlebars');

                    var transporter = nodemailer.createTransport({
                        host: mailHost,
                        port: mailPort,
                        auth: {
                            user: yourEmail,
                            pass: yourPass,
                        },
                        tls: {
                            rejectUnauthorized: false
                        },
                    });

                    const handlebarOptions = {
                        viewEngine: {
                            extName: ".handlebars",
                            partialsDir: path.resolve('./public/emails/'),
                            defaultLayout: false,
                        },
                        viewPath: path.resolve('./public/emails/'),
                        extName: ".handlebars",
                    }
                    transporter.use('compile', hbs(handlebarOptions));
                    var mailOptions = {
                        from: yourEmail,
                        to: senderEmail,
                        subject: 'subjectEmail',
                        template: 'emailStudent',
                        context: {
                            title: 'Traore',
                            text: req.body.message
                        }
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });


                    // var mailOptions = {
                    //     from: yourEmail,
                    //     to: senderEmail,
                    //     subject: subjectEmail,
                    //     html: htmlEmail
                    // };
                    // transporter.sendMail(mailOptions, function(error, info) {
                    //     if (error) {
                    //         console.log('Bad mail');

                    //     } else {
                    //         console.log('Good mail');
                    //     }
                    // })
                } else {
                    console.log({ 'error': 'cannot found student.email' });
                }
            });
    },
}