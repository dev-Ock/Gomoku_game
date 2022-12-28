<template>
  <div>
    <Navbar />
    <v-main>
      <h1>게임 리스트가 나오는 페이지로 가장 메인이 되는 페이지 입니다.</h1>
    </v-main>
  </div>
</template>

<script>
import Navbar from '@/components/NavBar.vue'

export default {
  name: 'GameList',
  components: {
    Navbar
  },
}
</script>

<style></style>
