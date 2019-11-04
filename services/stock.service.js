var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('stock');

var service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();
    db.stock.find({}, function (err, cursor) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            var stock = cursor.toArray();
            deferred.resolve(stock);
        });

    return deferred.promise;
}

function create(stockParam) {
    var deferred = Q.defer();

    // validation
    db.stock.findOne(
        { _id: stockParam._id },
        function (err, stock) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (stock) {
                deferred.reject('Id "' + stockParam._id + '" already exists');
            } else {
                addStock();
            }
        });

    function addStock() {
        
        db.stock.insert(
            stockParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, stockParam) {
    var deferred = Q.defer();

    // validation
    if ('code' in stockParam) {
        db.stock.findOne(
            { code: stockParam.code },
            function (err, stock) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if (stock) {
                    deferred.reject('Code "' + req.body._id + '" already exists')
                } else {
                    updateStock();
                }
            });
    } else {
        updateStock();
    }

    function updateStock() {

        db.stock.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: stockParam },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.stock.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
