const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

app.use('/users', require('./api/users/user'));
app.use('/auth', require('./api/auth/auth'));

// 토큰값을 발급받기위해 id, pw를 서버에 전달 
// 토큰, 리프레시 토큰 응답
app.post('/testLogin', (req, res)=>{
    return res.status(200).json({
      'data': {
        'token': 'this_is_token',
        'refresh_token': 'this_is_refresh_token'
      },
      'status': 200,
      'msg': 'success'
  });
});

//서버에서는 refreshToken값을 받고 db에 있는 refreshToken값이 유효한지 확인 후 새로운 토큰 값 응답
app.post('/testRefreshToken', (req, res)=>{
  return res.status(200).json({
    'data':{
      'token' : 'new_token',
    },
    'status': 200,
  });
});

// 현재 토큰값이 서버의 토큰값(new_token)과 일치하지 않으면 인증안되었으므로 다시 로그인
app.post('/testCall', (req, res)=>{
  console.log(req.headers.token);
  // if(req.headers.token!=='new_token'){
  //   return res.status(401).json({
  //     'data':{
  //       'data' : '인증 안됨',
  //     },
  //     'status': 401,
  //   });
  // }
  // return res.status(200).json({
  //   'data':{
  //     'data' : 'test_call_success',
  //   },
  //   'status': 200,
  // });
});

app.listen(3000, () => {
  console.log('3000 포트 열기 !');
});