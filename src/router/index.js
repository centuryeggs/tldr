import VueRouter from 'vue-router'
import Home from '/src/components/Home.vue'
import Text2Sum from '/src/components/Text2Sum.vue'
// import Audio2Sum from '/src/components/Audio2Sum.vue'
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: "/home",
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/text/:type',
      name: 'Text2Sum',
      component: Text2Sum
    },
    // {
    //   path: '/audio',
    //   name: 'Audio2Sum',
    //   component: Audio2Sum
    // }
  ],
})

export default router