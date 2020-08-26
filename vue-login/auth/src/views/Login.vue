<template>
  <div class="home">
    <div>
      <label for="id">id</label>
      <input type="text" id="id" v-model="user_id">
    </div>
    <div>
      <label for="pw">pw</label>
      <input type="text" id="pw" v-model="user_pwd">
    </div>
    <input type="button" @click="onLogin" value="로그인" />
  </div>
</template>

<script>
import { testLogin } from '../service/login'

export default {
  name: 'login',
  data() {
    return {
      user_id: '',
      user_pwd: '',
    }
  },
  created(){

  },
  methods:{
    // 로그인 만들기 https://kdinner.tistory.com/31?category=310445 
    async onLogin(){
      if(this.user_id!=='' && this.user_pwd !==''){
        const login = await testLogin(this.user_id, this.user_pwd);
        // console.log('login', login);
        if(login){
          this.$router.push('/');
        }
      }
    }

    // onLogin(){
    //   this.$axios.post(`${this.$store.state.host}/auth/login`,{
    //     id:this.user_id,
    //     pwd:this.user_pwd
    //   })
    //   .then( res => {
    //     console.log('res', res);
    //     this.$store.commit('loginToken', res.data.token)
    //     // this.$router.push('/');
    //   })
    //   .catch( error => {
    //     console.log(error);        
    //   })
    // },

  }
}
</script>
