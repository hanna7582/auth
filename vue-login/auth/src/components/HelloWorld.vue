<template>
  <div class="hello">
    {{role}}
    <button type="button" @click="onTest">통신 테스트</button>
    <button type="button" @click="onLogout">로그아웃</button>
  </div>
</template>

<script>
import { testCall } from '../service/test';
import VueCookies from 'vue-cookies';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  computed: {
    token() {
      return this.$store.state.token; 
    },
    role(){
      return this.$store.state.role; 
    }
  },
  created () {
    if(VueCookies.get('token')!=='undefined'){
      this.$store.commit("loginCheck");
    }else{
      this.$router.push('/login');
    }
  },
  methods:{
    async onTest(){
      const test = await testCall();
      console.log(test);
    },    
    onLogout(){
      this.$store.commit('logout')
      this.$router.push('/login');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
