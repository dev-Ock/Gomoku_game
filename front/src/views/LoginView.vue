<template>
  <div>
    <h1>로그인이 진행되는 페이지 입니다.</h1>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Validate from '@/mixins/Validate.vue'

export default {
  mixins: [Validate],
  data() {
    return {
      employee_number: '',
      password: ''
    }
  },
  methods: {
    // 여기서 login 불러와서 사용하기
    // auth.login(this.email , this.password)
    ...mapActions('Auth', ['LOGIN_AUTH']),
    async login() {
      // console.log('LoginView page - login - data check : ', this.employee_number, this.password)
      this.LOGIN_AUTH({ employee_number: this.employee_number, password: this.password }).then(() => {
        // api 와 store 작업이 끝나면 아래 주로 화면 전환
        localStorage.getItem('token') !== null ? this.$router.push('/gameList') : this.$router.go(0)
      })
    }
  }
}
</script>

<style></style>
