<template>
  <div>
    <Navbar />
    <div class="grid-box">
      <div class="video-box">
        <a
          href="http://192.168.0.64:8080/"
          target="_blank"
        >
          <video
            class="f"
            autoplay
            muted
            loop
            height="auto"
          >
            <source
              src="~@/assets/video/HomebackgroundVideo.mp4"
              type="video/mp4"
            >
          </video>
        </a>
      </div>
      <div class="s">
        <h1 style="margin-top: 250px">
          <router-link
            to="/gamePlay"
            style="text-decoration: none; color:black"
          >
            오목게임
          </router-link>
        </h1>
      </div>
      <div class="t">
        <h1 style="margin-top: 250px">
          Coming Soon!
        </h1>
      </div>
    </div>
    <h1 class="vt">
      슈팅게임
    </h1>
  </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";

export default {
  name: "GameList",
  components: {
    Navbar,
  },
};
</script>

<style>
.grid-box {
  margin: 200px 10px 0px 10px;
}
.video-box {
  width: 90%;
  margin: auto;
  box-sizing: border-box;
}
.f {
  border: 1px solid black;
  float: left;
  width: 30%;
  box-sizing: border-box;
  background: url("~@/assets/video/HomebackgroundVideo.mp4");
}
.s {
  border: 1px solid black;
  float: left;
  margin-left: 4%;
  width: 30%;
  height: 228px;
  box-sizing: border-box;
  background: url("~@/assets/video/omok.gif") 100% 100% / cover no-repeat;
}
.t {
  border: 1px solid black;
  float: right;
  width: 30%;
  height: 228px;
  box-sizing: border-box;
  background: url("~@/assets/video/Coming.jpg") 48% 100% / cover no-repeat;
}
.text-video {
  margin-right: 20px;
}
.vt {
  position: absolute;
  display: inline-block;
  margin-top: 250px;
  margin-left: -820px;
}
</style>
