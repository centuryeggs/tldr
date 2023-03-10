<template>
  <div id="video">
    <div class="inputBox">
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action="http://172.16.8.150:7773/video_steam"
          multiple
          :on-success="handleAvatarSuccess"
          :on-error="onError"
          :on-progress="onProgress"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
    </div>
    <div class="outputBox">
      <div class="textContent" v-if="results">{{ results }}</div>
      <div v-else>
        <el-empty description="啥也没有"></el-empty>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Video2Sum',
  data() {
    return {
      results: '',
    }
  },
  inject:["setLoading"],
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleAvatarSuccess(res) {
      this.results = res.data
      window.waveColor = [238, 238, 238]
      window.waveSpeed = 0.03
      this.setLoading(false)
    },
    onProgress(event, file, fileList) {
      console.log(event, file, fileList)
      window.waveColor = [27, 30, 43] // [27, 30, 43] [252, 85, 49]
      window.waveSpeed = 0.1
      this.setLoading(true)
    },
    onError() {
      window.waveColor = [238, 238, 238]
      window.waveSpeed = 0.03
      this.setLoading(false)

    }
  }
}
</script>

<style>
#video {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: #fff;
}

.inputBox,
.outputBox {
  width: 1000px;
  margin: 30px auto;
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
  border-radius: 4px;
}

.bigBoder{
  width: 500px;
  height:320px;
  border-radius: 10px;
  background:#222;
}

.inputBox {
  width: 1060px;
  display: flex;
}
.upload {
  height: 30vh;
  color: #aaa;
}
.outputBox {
  height: 30vh;
  margin-top: 30px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.textContent {
  color: #fff;
  height: calc(60vh - 300px);
  width: calc(1000px - 30px);
  text-align: left;
  color: #666;
}
.upload,
.upload-demo {
  height: 100%;
  width: 100%;
}
.el-upload.el-upload--text {
  height: 100%;
  width: 100%;
}
.el-upload-dragger {
  border: none;
  width: 100%;
}
</style>
