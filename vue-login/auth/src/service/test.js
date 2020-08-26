import axios from './axios';
import VueCookies from 'vue-cookies';

export async function testCall(){
    try{
        // 토큰값을 서버에 전달
        const test = await axios.post('/testCall',{
            headers: {
                token:VueCookies.get('token')
            }
        });
        return test;
    }catch(err){
        return err;
    }
}