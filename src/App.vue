<template>
  <div id="app">
    <div class="title" @click="goHome">TL;DR</div>
    <router-view></router-view>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  },
  mounted() {
  },
  methods: {
    goHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  position: absolute;
}
.title {
  position: absolute;
  margin: 0 auto;
  width: 100%;
  font-size: 60px;
  cursor: pointer;
  margin-top: 90px;
  color: #7dbed6;
}
</style>
