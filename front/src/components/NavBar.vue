<template>
  <div class="nav">
    <v-app-bar color="indigo lighten-5" elevation="5">
      KYOL X WYL
      <v-spacer></v-spacer>
    </v-app-bar>
    <template>
      <!-- <div v-if="!loginCheck">
        <v-container>
          <v-row justify="center">
            <v-menu bottom min-width="200px" rounded offset-y>
              <template #activator="{ on }">
                <v-btn class="d" icon x-large v-on="on">
                  <v-avatar color="brown" size="48">
                    <span class="white--text text-h7"> NO </span>
                  </v-avatar>
                </v-btn>
              </template>
            </v-menu>
          </v-row>
        </v-container>
      </div> -->
      <!-- <div v-if="loginCheck"> -->
      <!-- <v-container fluid style="height: 300px"> -->
      <v-row justify="center">
        <v-menu bottom min-width="200px" rounded offset-y>
          <template #activator="{ on }">
            <v-btn class="d" icon x-large v-on="on">
              <v-avatar color="brown" size="48">
                <span class="white--text text-h5">
                  {{ TokenUser.UserId }}
                </span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="brown">
                  <span class="d white--text text-h5"></span>
                </v-avatar>
                <h3>{{ TokenUser.UserId }}</h3>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text> 승 : {{ TokenUser.win }} </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text>
                  패 : {{ TokenUser.lose }}
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-row>
      <!-- </v-container> -->
      <!-- </div> -->
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      loginCheck: false,
    };
  },
  computed: {
    ...mapGetters("Auth", {
      TokenUser: "TokenUser",
    }),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Hahmlet&display=swap");

.nav {
  font-family: "Hahmlet", serif;
  font-weight: bold;
  font-size: 25px;
}

.row {
  display: flex;
  /* flex-wrap: wrap; */
  flex: 1 1 auto;
  margin: -67px;
}
.d {
  /* align-items: center; */
  margin-right: -1410px;
  /* margin-top: -3px; */
}
</style>
