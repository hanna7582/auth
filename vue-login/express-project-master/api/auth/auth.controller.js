const mysql = require('mysql');
const config = require('../../config');
const connection = mysql.createConnection(config.SQL);
let User = require('../../models/user/user');
const crypto = require('crypto');
const secret = config.KEY.secret;
const jwt = require('jsonwebtoken');


exports.login = (req, res) => {
    // 로그인 인증
    User.user_id = req.body.id;
    User.user_pwd = req.body.pwd;
    // let jwt_secret = 'jwtAI';
    if (User.user_id) {
      connection.query(`SELECT user_pwd, user_role FROM user WHERE user_id = "${User.user_id}"`, function (error, results, fields) {
        if (error) {
          console.log(error);
        }
        console.log(results);

        const hash = crypto.createHmac('sha256', secret)
          .update(req.body.pwd)
          .digest('base64');
        User.user_role = results[0].user_role;
        if (hash == results[0].user_pwd) {
          const getToken = new Promise((resolve, reject) => {
            // 토큰의 내용, 비밀키, 설정(유효시간, 발행자, 주제 등)
            jwt.sign({
                id: User.user_id,
                role: User.user_role
              },
              secret, {
                expiresIn: '1m',
                issuer: 'hanna',
                subject: 'jwt 토큰 인증'
              }, (err, token) => {
                if (err) reject(err)
                resolve(token)
              })
          });
          
          getToken.then(
            token => {
              res.status(200).json({
                'status': 200,
                'msg': 'login success',
                token
              });
            }
          );
        } else {
          res.status(400).json({
            'status': 400,
            'msg': 'password 가 틀림'
          });
        }
      });
    } else {
      res.status(400).json({
        'status': 400,
        'msg': 'id값이 없음'
      });
    }
  };
  
  
exports.check = (req, res) => {
    // 인증 확인
    const token = req.headers['x-access-token'] || req.query.token;
    // let jwt_secret = 'jwtAI';
  
    if (!token) {
      res.status(400).json({
        'status': 400,
        'msg': 'Token 없음'
      });
    }
    const checkToken = new Promise((resolve, reject) => {
      // 토큰, 시크릿 키
      jwt.verify(token, secret, function (err, decoded) {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  
    checkToken.then(
      token => {
        console.log(token);
        res.status(200).json({
          'status': 200,
          'msg': 'success',
          token
        });
      }
    ).catch( error => {
      console.log(error);      
      //유효기간 초과
      if(error.name === 'TokenExpiredError'){
        return res.status(419).json({
          code:419,
          message:'토큰이 만료되었습니다.'
        })
      }
      //유효하지 않은 토큰
      if(error.name === 'JsonWebTokenError'){
        return res.status(401).json({
          code:401,
          message:'유효하지 않은 토큰입니다.'
        })
      }
    })
  };
