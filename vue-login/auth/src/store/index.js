import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'
import VueCookies from 'vue-cookies';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    host:'http://127.0.0.1:3000',
    token:'',
    role:'',
  },
  mutations: {
    loginToken( state, payload){
      state.token = payload;
    },
    logout(state){         
      if(VueCookies.get('token') !== null){
        state.token='';
        state.role='';
        VueCookies.remove("token");
        alert('로그아웃')
      }
    },
    loginCheck(state){
      // console.log('token', VueCookies.get('token'));
      
      axios.get(`${state.host}/auth/check`, {
        headers:{
          // 'x-access-token':state.token
          'x-access-token':VueCookies.get('token')
        }
      })
      .then( 
        res => {
          // console.log(res);
          state.role=res.data.token;
        },
        error => {
          // console.log('로그인 정보가 없음', error);
          router.push('/login');
        }
      )
    }
  },
  actions: {
  },
  modules: {
  }
})
