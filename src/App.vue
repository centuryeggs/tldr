<template>
  <div id="app">
    <Home />
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
  background-color: #1b1e2b;
}
</style>
