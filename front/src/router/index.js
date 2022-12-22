import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

// 로그인이 되어 있지 않으면 못 들어가게 해주는 네비게이션 가드이다.
const requireAuth = (to, from, next) => {
  const isAuth = localStorage.getItem('token')
  const loginPath = `/login?rPath=${encodeURIComponent(to.path)}`
  isAuth ? next() : next(loginPath)
}

// 게임 리스트화면으로 돌아가게 하는 네비게이션 가드
const requireList = (to, from, next) => {
  next({ path: '/gameList' })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: requireList
  },
  {
    // 가장 처음 보이는곳, 게임방 목록이 나오는 곳
    path: '/gameList',
    name: 'GameList',
    component: () => import('../views/GameList.vue')
    // beforeEnter: requireAuth,
    // originalPush
  },
  {
    // 게임 준비단계 (게임방 안쪽, 유저2명)
    path: '/gameStandBy',
    name: 'GameStandBy',
    component: () => import('../views/GameStandBy.vue')
  },
  {
    // 게임 하는 곳
    path: '/gamePlay',
    name: 'GamePlay',
    component: () => import('../views/GamePlay.vue')
    // beforeEnter: requireAuth,
    // originalPush
  },
  {
    // 로그인
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    // 회원 가입
    path: '/signUp',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    // 404
    path: '/*',
    name: '404page',
    component: () => import('../views/404View.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
