<template>
  <div>
    <div class="login">
      <h1>Login</h1>
      <form>
        <input
          type="text"
          v-model="UserId"
          placeholder="UserId"
          required="required"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required="required"
        />
        <div>
          <button @click="login" class="btn" style="margin: 20px; width: 80px">
            로그인
          </button>
          <router-link to="/signUp">
            <button type="submit" class="btn" style="margin: 20px; width: 80px">
              회원가입
            </button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Validate from '@/mixins/Validate.vue'

export default {
  mixins: [Validate],
  data() {
    return {
      UserId: '',
      password: ''
    }
  },
  methods: {
    // 여기서 login 불러와서 사용하기
    // auth.login(this.email , this.password)
    ...mapActions('Auth', ['LOGIN_AUTH']),
    async login(e) {
      e.preventDefault()
      console.log('UserId', this.UserId, 'pw', this.password)
      this.LOGIN_AUTH({ UserId: this.UserId, password: this.password }).then(() => {
        // api 와 store 작업이 끝나면 아래 주로 화면 전환
        localStorage.getItem('token') !== null ? this.$router.push('/gameList') : this.$router.push('/gameList')
      })
    }
  }
}
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans);
.btn { display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center;text-shadow: 0 1px 1px; vertical-align: middle; background-color: #f5f5f5; background-image: -moz-linear-gradient(top, #ffffff, #e6e6e6); background-image: -ms-linear-gradient(top, #ffffff, #e6e6e6); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6)); background-image: -webkit-linear-gradient(top, #ffffff, #e6e6e6); background-image: -o-linear-gradient(top, #ffffff, #e6e6e6); background-image: linear-gradient(top, #ffffff, #e6e6e6); background-repeat: repeat-x; filter: progid:dximagetransform.microsoft.gradient(startColorstr=#ffffff, endColorstr=#e6e6e6, GradientType=0); border-color: #e6e6e6 #e6e6e6 #e6e6e6; border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25); border: 1px solid #e6e6e6; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05); -moz-box-shadow: inset 0 1px; cursor: pointer; *margin-left: .3em; }
.btn:hover, .btn:active, .btn.active, .btn.disabled, .btn[disabled] { background-color: #e6e6e6; }
.btn:hover { color: #333333; text-decoration: none; background-color: #e6e6e6; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear; }
.btn-primary { background-color: #4a77d4; background-image: -moz-linear-gradient(top, #6eb6de, #4a77d4); background-image: -ms-linear-gradient(top, #6eb6de, #4a77d4); background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#6eb6de), to(#4a77d4)); background-image: -webkit-linear-gradient(top, #6eb6de, #4a77d4); background-image: -o-linear-gradient(top, #6eb6de, #4a77d4); background-image: linear-gradient(top, #6eb6de, #4a77d4); background-repeat: repeat-x; filter: progid:dximagetransform.microsoft.gradient(startColorstr=#6eb6de, endColorstr=#4a77d4, GradientType=0);  border: 1px solid #3762bc; text-shadow: 1px 1px 1px rgba(0,0,0,0.4); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5); }
.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled] { filter: none; background-color: #4a77d4; }
.btn-block { width: 100%; display:block; }

* { -webkit-box-sizing:border-box; -moz-box-sizing:border-box; -ms-box-sizing:border-box; -o-box-sizing:border-box; box-sizing:border-box; }

html { width: 100%; height:100%; overflow:hidden; }

.login { 
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -150px 0 0 -150px;
	width:300px;
	height:300px;
  border: #000000;
}
.login h1 { color: #000000; letter-spacing:1px; text-align:center; margin-bottom: 5%;}

input { 
	width: 100%; 
	margin-bottom: 10px; 
	border: none;
	outline: none;
	padding: 10px;
	font-size: 13px;
	background-color: black;
  color: white;
	border: 1px solid rgba(0,0,0,0.3);
	border-radius: 4px;
}

</style>
