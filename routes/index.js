var express = require('express');
var router = express.Router();


//GET home page.
router.get('/', function (req, res, next) {
    
    res.render('layout', {gameOn: false, title: 'Main Page'});
});

router.get('/game', function (req, res, next){
    res.render('layout', {gameOn: true, title: 'Game'})
});

module.exports = router;
