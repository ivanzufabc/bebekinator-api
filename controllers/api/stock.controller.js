var config = require('config.json');
var express = require('express');
var router = express.Router();
var stockService = require('services/stock.service');

// routes
router.post('/add', addStock);
router.get('/', getStock);
router.put('/:_id', updateStock);
router.delete('/:_id', deleteStock);

module.exports = router;

function addStock(req, res) {
    stockService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getStock(req, res) {
    stockService.getAll()
        .then(function (stock) {
            if (stock) {
                res.send(stock);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateStock(req, res) {
    stockService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteStock(req, res) {
    stockService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
