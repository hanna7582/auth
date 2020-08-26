import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import VueCookies from 'vue-cookies'

import { refreshToken } from '../service/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { unauthorized : true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach( async(to, from, next) => {
  console.log('테스트', to.matched.some(record => record.meta.unauthorized), VueCookies.get('token'));
  
  // 1. 토큰값이 null이고 리프레시 토큰값이 null이 아니면 토큰값 재발급
  // if(VueCookies.get('token')===null && VueCookies.get('refresh_token') !== null){
  //   await refreshToken();
  // }

  // 2. 토큰값이 있거나 unauthorized가 true이면 페이지 이동
  // if (to.matched.some(record => record.meta.unauthorized) || VueCookies.get('token')){
  //   return next();
  // }

  if(VueCookies.get('token')===null){
    await refreshToken();
  }
  
 
  if (to.matched.some(record => record.meta.unauthorized) || VueCookies.get('token') !== 'undefined'){
    return next();
  }

  alert('로그인 해주세요');
  return next('/login');
})


export default router
