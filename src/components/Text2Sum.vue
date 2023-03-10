<template>
  <div id="text">
    <div class="inputBox">
      <el-input
        :disabled="disabled"
        type="textarea"
        :rows="16"
        style="background: transparent;"
        placeholder="请输入很长长长长长长长长长长长长长长长长长长长长长长长长的文字, 然后回车"
        v-model="textarea"
        @keyup.enter.native.prevent="post">
      </el-input>
    </div>
    <div class="outputBox">
      <div v-if="resultsList && resultsList.length > 0">
        <p style="text-align: left;padding-bottom: 6px;" v-for="i in resultsList" :key="i">{{ i }}</p>
      </div>
      <div v-else>
        <el-empty description="啥也没有"></el-empty>
      </div>
    </div>
   
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Text2Sum',
  data() {
    return {
      textarea: '',
      results: '',
      disabled: false
    }
  },
  inject:["setLoading"],
  computed: {
    resultsList() {
      return this.results.split('\n').filter(i => i)
    }
  },
  methods: {
    post() {
      this.setLoading(true)
      window.waveSpeed = 0.08
      this.disabled = true
      axios({
        method: 'post',
        url: 'http://172.16.8.150:7773/text_steam',
        data: {
          param: this.textarea,
          _type: 1
        }
      }).then(res => {
        console.log(res.data);
        this.results = res.data.data
      }).finally(() => {
        this.setLoading(false)
        window.waveSpeed = 0.03
        this.disabled = false
      })
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
.inputBox,
.outputBox {
  width: 1000px;
  margin: 30px auto;
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
  border-radius: 4px;
}
.outputBox {
  color: #fff;
  height: 40vh;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
