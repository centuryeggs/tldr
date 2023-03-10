<template>
  <div id="audio">
    <div class="inputBox">
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action="http://172.16.8.150:7773/radio_steam"
          multiple
          :on-success="handleAvatarSuccess"
          :on-error="onError"
          :on-progress="onProgress"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div class="video">
        <!-- 黑色外边框 -->
        <div class="bigBoder">
          <!-- <div></div>
          <div></div> -->
          <canvas id="canvas" class="canvas" width="400px" height="300px"></canvas>
        </div>

        <button @click="start()">开始录音</button>
        <button @click="stop()">停止录音</button>
        <button @click="play()">播放录音</button>
        <button @click="downloadWAV()">下载</button>
        <span v-if="oTime > 0">录音时长：{{ oTime }}s</span>
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
import Recorder from 'js-audio-recorder'

export default {
  name: 'Audio2Sum',
  data() {
    return {
      activeName: 'doc',
      results: '',
      recorder: '',
      drawRecordId: null,
      oCanvas: '',
      ctx: ''
    }
  },
  inject:["setLoading"],
  mounted() {
    //初始化canvas
    this.init()
  },
  methods: {
    init() {
      let oCanvas = document.getElementById('canvas') // 显示波形的canvas
      let canvasCtx = oCanvas.getContext('2d')
      canvasCtx.fillStyle = 'rgb(200, 200, 200)'
      canvasCtx.fillRect(0, 0, oCanvas.width, oCanvas.height)

      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

      canvasCtx.beginPath()

      this.oCanvas = oCanvas
      this.ctx = canvasCtx
    },
    //开始录音
    start() {
      if (!this.recorder) {
        this.recorder = new Recorder({
          // 以下是默认配置
          sampleBits: 16,
          sampleRate: 16000, // 浏览器默认的输入采样率,
          numChannels: 1
        })
        let _this = this
        this.recorder.onprocess = function (duration) {
          // 部分低版本浏览器不支持innerText，改用innerHTML
          this.oTime = duration.toFixed(0)
        }
      }
      this.recorder.start().then(function () {
        console.log('开始录音')
      })
      // 开始绘制canvas
      this.drawRecord()
    },

    // canvas波形绘制函数
    drawRecord() {
      // 用requestAnimationFrame稳定60fps绘制
      this.drawRecordId = requestAnimationFrame(this.drawRecord)
      let oCanvas = this.oCanvas
      // 实时获取音频大小数据
      let dataArray = this.recorder.getRecordAnalyseData(),
        bufferLength = dataArray.length
      let ctx = this.ctx
      // 填充背景色
      ctx.fillStyle = 'rgb(200, 200, 200)'
      ctx.fillRect(0, 0, oCanvas.width, oCanvas.height)

      // 设定波形绘制颜色
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgb(0, 0, 0)'

      ctx.beginPath()

      var sliceWidth = (oCanvas.width * 1.0) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
        x = 0 // 绘制点的x轴位置

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = (v * oCanvas.height) / 2

        if (i === 0) {
          // 第一个点
          ctx.moveTo(x, y)
        } else {
          // 剩余的点
          ctx.lineTo(x, y)
        }
        // 依次平移，绘制所有点
        x += sliceWidth
      }

      ctx.lineTo(oCanvas.width, oCanvas.height / 2)
      ctx.stroke()
    },
    //结束录音
    stop() {
      this.recorder && this.recorder.stop()
      console.log('结束录音')
      this.drawRecordId && cancelAnimationFrame(this.drawRecordId)
      this.drawRecordId = null
      //结束录音时，生成列表
      // this.getWAVBlob()
    },
    //播放
    play() {
      this.recorder && this.recorder.play()
    },
    //获取wav数据
    getWAVBlob() {
      this.recorder && this.recorder.getWAVBlob()
    },
    //下载wav
    downloadWAV() {
      this.recorder && this.recorder.downloadWAV('录音文件')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleAvatarSuccess(res) {
      this.results = res.data
      window.waveColor = [238, 238, 238]
      window.waveSpeed = 0.03
    },
    onProgress(event, file, fileList) {
      console.log(event, file, fileList)
      window.waveColor = [27, 30, 43] // [27, 30, 43] [252, 85, 49]
      window.waveSpeed = 0.1
    },
    onError() {
      window.waveColor = [238, 238, 238]
      window.waveSpeed = 0.03
    }
  }
}
</script>

<style>
#audio {
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
  display: flex;
}
.upload {
  height: 30vh;
  color: #aaa;
}
.outputBox {
  height: 40vh;
  margin-top: 30px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.textContent {
  height: calc(60vh - 60px);
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
