/**
 * Created by Administrator on 5/19/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var url_dec = new Buffer(req.query.u, 'base64').toString('utf8');
    var data_dec = new Buffer(req.query.d, 'base64').toString('utf8');

    console.log(data_dec);

    var fields = JSON.parse(data_dec);

    var createInput = function(name, value){
        return '<input type="hidden" name="' + name + '" value="' + decodeURIComponent(value) + '">';
    };

    var inputs = '';
    var values = '';

    Object.keys(fields).forEach(function(name){
        var value = fields[name];
        if (Array.isArray(value)) {
            values += value.join('');
            inputs += value.map(function(val){ return createInput(name, val); }).join('');
        }
        else {
            values += value;
            inputs += createInput(name, value);
        }
    });

    var exp_pg = '<form name="pmt" method="POST" action="'+url_dec+'" accept-charset="UTF-8">' + inputs + '</form>';

    //res.render('index', { sub_form : exp_pg });
    res.send('<head> <title>Redirecting to payment system...</title> </head>'+exp_pg+'<script> document.pmt.submit(); </script>');
});


module.exports = router;
