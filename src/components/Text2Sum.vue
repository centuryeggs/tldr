<template>
  <div id="text">
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入很长长长长长长长长长长长长长长长长长长长长长长长长的文字"
      v-model="textarea">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'Text2Sum',
  data() {
    return {
      textarea: ''
    }
  }
}
</script>

<style>
#text {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
