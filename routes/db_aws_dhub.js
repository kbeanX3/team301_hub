/**
 * Created by Police on 23.05.2016.
 */
var sql = require('mssql');

var config = {
    user: 'Corezoid',
    password: 'ytcub,ftvsqgfhjkm',
    //domain: 'EC2AMAZ-141U3P9',
    server: 'dhub.coshhaw3iygb.us-west-2.rds.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'VoxDB',
    //port: 1433,

    //options: {
        //instanceName: 'EC2AMAZ-141U3P9',
        //port: 1433
        //	encrypt: true // Use this if you're on Windows Azure
    //}
};

    var connection = new sql.Connection(config, function(err) {
        // ... error checks
        if (err) {
            console.log('db:', err );
        }
    });

    // Query

    /*var rst = new sql.Request(connection);

    rst.query('select 1 as res;').then(function(recordset) {
        console.log(recordset.toString());
    }).catch(function(err){
        console.error('failed to retrieve data', err);
    });*/


    //var request = new sql.Request(connection); // or: var request = connection.request();
    //request.query('select * from stream.test', function(err, recordset) {
    // ... error checks
    //});

    // Stored Procedure

connection.on('error', function(err) {
    // ... error handler
    console.log('db error', err);
});

module.exports = connection;
