<template>
  <div class="nav">
    <v-app-bar color="indigo lighten-5" elevation="5">
      KYOL X WYL
      <v-spacer></v-spacer>
      <v-avatar
        color=" indigo lighten-2"
        size="56"
        margin-left="50px"
      ></v-avatar>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Hahmlet&display=swap');

.nav{
font-family: 'Hahmlet', serif;
font-weight: bold;
font-size: 25px;
}
</style>
