var config = require('config.json');
var express = require('express');
var router = express.Router();
var arvoreService = require('services/arvoreGenealogica.service');

// routes
router.post('/create', createArvore);
router.get('/list', listArvores);
router.delete('/:_id', deleteArvore);
router.put('/:_id', updateArvore);
router.get('/:_id', getArvore);


function getArvore(req, res) {
    arvoreService.getById(req.params._id)
        .then(function (arvore) {
            if (arvore) {
                res.send(arvore);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

module.exports = router;
function createArvore(req, res) {
    arvoreService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function listArvores(req,res){
    arvoreService.list(req)
        .then(function (Arvores) {
            res.status(200).send(Arvores);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteArvore(req,res){

    arvoreService.delete(req.params._id)
    .then(function () {
        res.sendStatus(200);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

function updateArvore(req, res) {
    arvoreService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}