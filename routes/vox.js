/**
 * Created by Police on 23.05.2016.
 */
var express = require('express');
var router = express.Router();

var sql = require('mssql');
var connection = require('./db_aws_dhub');

// get available projects
router.route('/proj')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select Project_name, Project_tg_token, COUNT(distinct Question_id) Q_count from web.v_Available_Questions where 1=1';
        query_txt += ' and '+req.body.lang+' = language_cd';
        query_txt += ' and cast(\''+req.body.dttm+'\' as datetime) >= valid_from';
        query_txt += ' and cast(\''+req.body.dttm+'\' as datetime) <= valid_to';
        query_txt += (req.body.proj_token === undefined ) ? '' : ' and project_tg_token like \''+req.body.proj_token+'%\'';
        query_txt += ' group by Project_name, Project_tg_token order by Project_name';

        request.query(query_txt).then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select Project_name, Project_tg_token, COUNT(distinct Question_id) Q_count from web.v_Available_Questions where 1=1';
        query_txt += ' and '+req.query.lang+' = language_cd';
        query_txt += ' and cast(\''+req.query.dttm+'\' as datetime) >= valid_from';
        query_txt += ' and cast(\''+req.query.dttm+'\' as datetime) <= valid_to';
        query_txt += (req.query.proj_token === undefined ) ? '' : ' and project_tg_token like \''+req.query.proj_token+'%\'';
        query_txt += ' group by Project_name, Project_tg_token order by Project_name';

        console.log(query_txt);

        request.query(query_txt).then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });

// get questions for <project_tg_token> project
router.route('/questions')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select Question_id, Question_text from web.v_Available_Questions where 1=1';
        query_txt += ' and '+req.body.lang+' = language_cd';
        query_txt += ' and cast(\''+req.body.dttm+'\' as datetime) >= valid_from';
        query_txt += ' and cast(\''+req.body.dttm+'\' as datetime) <= valid_to';
        query_txt += (req.body.proj_token_mask === undefined ) ? '' : ' and project_tg_token like \''+req.body.proj_token_mask+'%\'';
        query_txt += (req.body.proj_token === undefined ) ? '' : ' and project_tg_token = \''+req.body.proj_token+'\'';
        query_txt += ' order by question_id';

        request.query(query_txt).then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select Question_id, Question_text from web.v_Available_Questions where 1=1';
        query_txt += ' and '+req.query.lang+' = language_cd';
        query_txt += ' and cast(\''+req.query.dttm+'\' as datetime) >= valid_from';
        query_txt += ' and cast(\''+req.query.dttm+'\' as datetime) <= valid_to';
        query_txt += (req.query.proj_token_mask === undefined ) ? '' : ' and project_tg_token like \''+req.query.proj_token_mask+'%\'';
        query_txt += (req.query.proj_token === undefined ) ? '' : ' and project_tg_token = \''+req.query.proj_token+'\'';
        query_txt += ' order by question_id';

        request.query(query_txt).then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });


// get answers for <question_id> question
router.route('/answers')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select Answer_id, Answer_order_id, Answer_text from web.v_Answers where 1=1';
        query_txt += ' and '+req.body.lang+' = language_cd';
        query_txt += ' and question_id = \''+req.body.question_id+'\'';
        query_txt += ' order by answer_order_id';

        request.query(query_txt).then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select Answer_id, Answer_order_id, Answer_text from web.v_Answers where 1=1';
        query_txt += ' and '+req.query.lang+' = language_cd';
        query_txt += ' and question_id = \''+req.query.question_id+'\'';
        query_txt += ' order by answer_order_id';

        request.query(query_txt).then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });


// set language preferences for customer
router.route('/set_lang')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        request
            .input('Tg_user_id',sql.BigInt,req.body.User_id)
            .input('language_cd',sql.TinyInt,req.body.Lang_id)
            .output('result',sql.TinyInt)
            .output('error',sql.VarChar(100))
            .execute('web.sp_Set_Language')
            .then(function(recordset) {
            res.json({ DBresult: request.parameters.result.value, DBerror: request.parameters.error.value });
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        request
            .input('Tg_user_id',sql.BigInt,req.query.user_id)
            .input('language_cd',sql.TinyInt,req.query.lang_id)
            .output('result',sql.TinyInt)
            .output('error',sql.VarChar(100))
            .execute('web.sp_Set_Language')
            .then(function(recordset) {

            res.json({ DBresult: request.parameters.result.value, DBerror: request.parameters.error.value });
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });


// get language preferences for customer
router.route('/get_lang')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select * from web.v_Language_pref where 1=1';
        query_txt += ' and Tg_user_id = '+req.body.user_id;

        request.query(query_txt).then(function(recordset) {

                res.json(recordset);
            }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select pref_lang from web.v_Language_pref where 1=1';
        query_txt += ' and Tg_user_id = '+req.query.user_id;

        request.query(query_txt)
            .then(function(recordset) {

                res.json(recordset);
            }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });

// get available languages
router.route('/languages')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select * from web.v_Available_Languages';

        request.query(query_txt).then(function(recordset) {
                console.log(recordset.toString());
                res.json(recordset);
            }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        var query_txt = 'select * from web.v_Available_Languages';

        request.query(query_txt).then(function(recordset) {
                console.log(recordset.toString());
                res.json(recordset);
            }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });


// upsert customer
router.route('/upsert_cust')
    .post(function(req, res) {

        var request = new sql.Request(connection);

        request
            .input('Tg_user_id',sql.BigInt,req.body.user_id)
            .input('Tg_first_name',sql.NVarChar(100),req.body.first_nm)
            .input('Tg_last_name',sql.NVarChar(100),req.body.last_nm)
            .input('Tg_middle_name',sql.NVarChar(100),req.body.middle_nm)
            .input('Tg_chat_id',sql.BigInt,req.body.chat_id)
            .input('Birth_DT',sql.DateTime,req.body.birth)
            .input('Gender',sql.TinyInt,req.body.gender)
            .input('Phone_no',sql.VarChar(15),req.body.phone)
            .input('Email',sql.NVarChar(50),req.body.email)
            .output('result',sql.TinyInt)
            .output('error',sql.VarChar(100))
            .execute('web.sp_Upsert_customer')
            .then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    })
    .get(function(req, res) {

        var request = new sql.Request(connection);

        console.log(req.query.user_id);

        request
            .input('Tg_user_id',sql.BigInt,req.query.user_id)
            .input('Tg_first_name',sql.NVarChar(100),req.query.first_nm)
            .input('Tg_last_name',sql.NVarChar(100),req.query.last_nm)
            .input('Tg_middle_name',sql.NVarChar(100),req.query.middle_nm)
            .input('Tg_chat_id',sql.BigInt,req.query.chat_id)
            .input('Birth_DT',sql.DateTime,req.query.birth)
            .input('Gender',sql.TinyInt,req.query.gender)
            .input('Phone_no',sql.VarChar(15),req.query.phone)
            .input('Email',sql.NVarChar(50),req.query.email)
            .output('result',sql.TinyInt)
            .output('error',sql.VarChar(100))
            .execute('web.sp_Upsert_customer')
            .then(function(recordset) {
            console.log(recordset.toString());
            res.json(recordset);
        }).catch(function(err){
            console.error('failed to retrieve data', err);
            res.sendStatus(500);
        });
    });


module.exports = router;
