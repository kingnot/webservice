/* All the CRUD functions for user route are defined here */
var mongoose = require('mongoose');
var User = require('../models/user');

/*
 * GET /user route to retrieve all the users.
 */
function getUsers(req, res) {
    //Query the DB and if no errors, send all the users
    var query = User.find({});
    query.exec(function(err, users) {
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(users);
    });
}

/*
 * POST /user to save a new user.
 */
function postUser(req, res) {
    //Creates a new user
    var newUser = new User(req.body);
    //Save it into the DB.
    newUser.save(function(err,user) {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "User successfully added!", user });
        }
    });
}

/*
 * GET /user/:id route to retrieve a user given its id.
 */
function getUser(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(user);
    });     
}

/*
 * DELETE /user/:id to delete a user given its id.
 */
function deleteUser(req, res) {
    User.remove({_id : req.params.id}, function(err, result) {
        res.json({ message: "User successfully deleted!", result });
    });
}

/*
 * PUT /user/:id to updatea a user given its id
 */
function updateUser(req, res) {
    User.findById({_id: req.params.id}, function(err, user) {
        if(err) res.send(err);
        Object.assign(user, req.body).save(function(err, user) {
            if(err) res.send(err);
            res.json({ message: 'User updated!', user });
        }); 
    });
}

//export all the functions
module.exports = { getUsers, postUser, getUser, deleteUser, updateUser };