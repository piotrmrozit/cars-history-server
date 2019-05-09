const usersController = require('../controllers').users;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the API!',
    }));

    app.post('/api/users', usersController.create);
    app.get('/api/users', usersController.list);
    app.post('/api/users/profile', usersController.profile);
    app.post('/api/users/register', usersController.register);
    app.post('/api/users/login', usersController.login);
    app.post('/api/users/logout', usersController.logout);
    app.post('/api/users/edit', usersController.edit);
    app.post('/api/users/upload', usersController.upload);
};