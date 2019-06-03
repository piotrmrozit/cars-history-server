const Users = require('../models').users;
const UsersPhoto = require('../models').users_photo;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer  = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

const upload = multer({ storage: storage }).single('profileImage');

module.exports = {
    create(req, res) {
        return Users
            .create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                token: req.body.token,
            })
            .then(todo => res.status(201).send(todo))
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Users
            .all()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    },
    register(req, res) {
        console.log('req.body ->', req.body);
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const gender = req.body.gender;
        const birthday = req.body.birthday;
        // console.log('username ->', username);
        // console.log('password ->', password);
        // console.log('email ->', email);
        return Users
            .findAll({
                where: {
                    username: username,
                    email: email
                }
            })
            .then(users => {
                console.log('users ->', users);
                if (users.length === 0) {
                    bcrypt.hash(password, saltRounds)
                        .then(function (hash) {
                            return Users
                                .create({
                                    username: username,
                                    password: hash,
                                    email: email,
                                    firstname: firstname,
                                    lastname: lastname,
                                    gender: gender,
                                    birthday: birthday
                                })
                                .then(users => res.status(200).json({
                                    ok: true,
                                    message: 'Registered'
                                }))
                                .catch(error => res.status(400).send(error));
                        });
                } else {
                    res.status(200).send('-> username or email is used')
                }
            })
            .catch(error => res.status(400).send(error));
    },
    profile(req, res) {
        console.log('req >', JSON.parse(req.query.token));
        const token = JSON.parse(req.query.token);
        if (token && token !== null) {
            const decodedToken = jwt.verify(token, '1a2b3c4d5e6f7g8h9i0j');
            console.log('decodedToken ->', decodedToken);

            const id = decodedToken.id;
            const username = decodedToken.username;
            const email = decodedToken.email;

            return Users
                .findOne({
                    where: {
                        id: id,
                        username: username,
                        email: email
                    }
                })
                .then(user => {
                    return user = {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        username: user.username,
                        email: user.email,
                        birthday: user.birthday,
                        gender: user.gender
                    }
                })
                .then(user => res.status(200).send(user))
                .catch(error => res.status(400).send(error));

        } else {
            res.status(200).send('-> profile token not found, you must login')
        }

    },
    profilephoto(req, res) {
        console.log('>PROFILE PHOTO<');
        console.log('req >', JSON.parse(req.query.token));
        const token = JSON.parse(req.query.token);
        if (token && token !== null) {
            const decodedToken = jwt.verify(token, '1a2b3c4d5e6f7g8h9i0j');
            console.log('decodedToken ->', decodedToken);
            const id = decodedToken.id;
            
            return UsersPhoto
            .findAll({
                where: {
                    userId: id
                }
            })
            .then(photos => {
                return photos = {
                    id: photos.id,
                    url: photos.photoUrl
                }
            })
            .then(photos => res.status(200).send(photos))
            .catch(error => res.status(400).send(error));

        } else {
            res.status(200).send('-> profile token not found, you must login')
        }
    },
    login(req, res) {
        console.log('req.body >', req.body);
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        return Users
            .findOne({
                where: {
                    username: username,
                    email: email
                }
            }).then(function (user) {
                if (!user) {
                    return res.status(400).json({message: '-> user is not found'})
                } else {
                    const passwordHash = user.password;
                    if (!bcrypt.compareSync(password, passwordHash)) {
                        console.log('==> PASSWORD ERROR');
                        return res.status(400).json({message: '-> password error'});
                    } else {
                        console.log('==> PASSWORD OK');
                        return Users
                            .findOne({
                                where: {
                                    username: username,
                                    email: email
                                }
                            })
                            .then(user => {
                                if (!user) {
                                    res.status(200).json({message: '-> user is not found'})
                                } else {
                                    console.log('==> MAKE TOKEN');
                                    let token = jwt.sign({
                                        id: user.id,
                                        username: user.username,
                                        email: user.email
                                    }, '1a2b3c4d5e6f7g8h9i0j');
                                    user.token = token;
                                    user.save();
                                    console.log('user >>>', user);
                                    res.status(200).json({
                                        message: '-> user is login',
                                        token: token,
                                        user: {
                                            id: user.id,
                                            username: user.username,
                                            email: user.email,
                                            firstname: user.firstname,
                                            lastname: user.lastname,
                                            gender: user.gender,
                                            birthday: user.birthday
                                        }
                                    })
                                }
                            })
                            .catch(error => res.status(400).send(error));
                    }
                }
            }).catch(error => res.status(400).send(error));
    },
    logout(req, res) {
        console.log('req.body ->', req.body);
        const token = req.body.token;
        if (token && token !== null) {
            const decodedToken = jwt.verify(token, '1a2b3c4d5e6f7g8h9i0j');
            const id = decodedToken.id;
            const username = decodedToken.username;
            const email = decodedToken.email;
            return Users
                .findOne({
                    where: {
                        id: id,
                        username: username,
                        email: email
                    }
                })
                .then(user => {
                    if (!user) {
                        res.status(200).json({message: '-> user is not found'})
                    } else {
                        console.log('user ->', user);
                        user.token = null;
                        user.save();
                        res.status(200).json({
                            message: '-> user is logout',
                            status: 200,
                        })
                    }
                })
                .catch(error => res.status(400).send(error));
        } else {
            res.status(200).json({message: '-> logout token not found'})
        }
    },
    edit(req, res){
        console.log('req.body ->', req.body);
        const id = req.body.id;
        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const gender = req.body.gender;
        const birthday = req.body.birthday;
        // const image = req.body.image;

        // console.log('image ->', image);
        // console.log('req.files ->', req.files);

        return Users
            .findOne({
                where:{
                    id: id
                }
            }).then(user =>{
                if(!user){
                    res.status(400).json({message: '-> user not found'})
                } else {
                    return user.update({
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        gender: gender,
                        birthday: birthday
                    }).then(user =>{
                        res.status(200).json({
                            message: '-> edit OK',
                            user: {
                                id: user.id,
                                username: user.username,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                gender: user.gender,
                                birthday: user.birthday
                            }
                        })
                    }).catch((error) => res.status(400).send(error));
                }
            }).catch(error => res.status(400).send(error));
    },
    upload(req, res){
        upload(req, res, function (err) {
           if(err){
               console.log('error ->', err);
           } 
           console.log('req.file >>>', req.file);

            res.status(200).json({
                message: '-> upload OK',
            })
        });
    }
};