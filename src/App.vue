<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  text-align: center;
  background-color: #3975c6;
}
</style>
