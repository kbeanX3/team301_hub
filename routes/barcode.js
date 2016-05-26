var express = require('express');
var router = express.Router();
var bwipjs = require('bwip-js');
//var fs = require('fs');

//bwipjs.loadFont('Inconsolata', 108,
//	            require('fs').readFileSync('Inconsolata.otf', 'binary'));

/* GET home page. */
router.get('/:id', function(req, res, next) {
//scale 1 height 15 width 6.5 text true textsize 14

//rationalizedCodabar -- default
//code128
//QR

    bwipjs.toBuffer({
        bcid:			(req.query.t || 'rationalizedCodabar'),		// Barcode type
        text: 'D'+req.params.id+'D',
        //text:			'D01-15002024000053170030939D',	// Text to encode
        scale:			1,
        scaleX:			1,
        scaleY:			1,// 3x scaling factor
        height:			(req.query.height || 15),	// Bar height, in millimeters
        width:			(req.query.width || 6.5),	// Bar height, in millimeters
        textsize:		(req.query.textsize || 14),	// Font size, in points
        includetext:	(req.query.text || false),	// Show human-readable text
        textxalign:		'center'//,		// Always good to set this
        //textfont:		'Inconsolata'	// Use your custom font

        //includecheck: false,
        //includecheckintext: false
    },function (err, png) {
        if (err) {
            console.log(req.params.id);
            console.log('Fuck!');
            // Decide how to handle the error
            // `err` may be a string or Error object
        } else {
            var rs = new Buffer(png,'base64');
            res.writeHead(200,{
                'Content-Type': 'image/png',
                'Content-Length': rs.length
            });
            res.end(rs);
        }
    });


});


module.exports = router;
