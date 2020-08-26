const mysql = require('mysql');
const config = require('../../config');
const connection = mysql.createConnection(config.SQL);
let User = require('../../models/user/user');
const crypto = require('crypto');
const secret = config.KEY.secret;

console.log('mysql', mysql);

exports.showAll = (req, res) => {
    connection.query(`SELECT * from user`, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('results', results);
        
        return res.json(results);
    });
};

exports.register = (req, res) => {
    const hash = crypto.createHmac('sha256', secret)
        .update(req.body.pwd)
        .digest('base64');
    User.user_id = req.body.id;
    User.user_pwd = hash;
    User.user_role = req.body.role;

    // 유저 등록
    if (User.user_id && User.user_pwd && User.user_role) {
        connection.query(`SELECT user_id FROM user WHERE user_id = "${User.user_id}"`, function (error, check_result, fields) {
            if (check_result.length == 0) {
                connection.query(`INSERT INTO user (user_id, user_pwd, user_role) VALUES ("${User.user_id }", "${User.user_pwd}", "${User.user_role}")`,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        res.status(200).json({
                            'status': 200,
                            'msg': 'success'
                        });
                    });
            } else {
                res.status(400).json({
                    'status': 400,
                    'msg': '중복 ID'
                });
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'msg': '값을 다 채워주세요'
        });
    }
};


exports.destroy = (req, res) => {
    // 유저 삭제
    const id = req.params.id;
    connection.query(`DELETE FROM user WHERE user_id = "${id}"`, function (error, results, fields) {
        console.log('results', results);
        console.log('id 값', id);
        
        if (error) {
            console.log(error);
        }
        if (results.length == 0) {
            console.log('찾는값 없음');
            return res.status(400).json({
                error: 'Incorrect id'
            });
        }
        res.status(201).send('success');
    });
};