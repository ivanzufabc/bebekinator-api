var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('arvores');

var service = {};

service.create = create;
service.list = list;
service.delete = _delete;
service.update = update;

module.exports = service;

function create(arvoreParam) {
    var deferred = Q.defer();
    // set arvore object to arvoreParam without the cleartext password
    var arvore = arvoreParam;
    db.arvore.insert(
        arvore,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
        });
    return deferred.promise;
}

function list() {
    var deferred = Q.defer();
    // set arvore object to arvoreParam without the cleartext password
    db.arvores.find().toArray(function(err, result){
        deferred.resolve(result);
        
    });
    return deferred.promise;    
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, arvore) {
    
        if (arvore) {
            // return user (without hashed password)
            deferred.resolve(_.omit(arvore, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.arvores.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, arvoreParam) {
    var deferred = Q.defer();
    var set = {
        Arvore: arvoreParam.Arvore,
        Answer: arvoreParam.Answer,
    };

    db.arvores.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    return deferred.promise;
}