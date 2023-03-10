<template>
  <div id="audio">
    <div class="inputBox2">
      <div class="video">
        <!-- 黑色外边框 -->
        <div class="bigBoder">
          <div class="left">
            <div class="cir"></div>
          </div>
          <div class="right">
            <div class="cir"></div>
          </div>
          <canvas id="canvas" class="canvas" width="400px" height="280px">
          </canvas>
          <span class="time" v-if="oTime">{{ oTime }} s</span>
          <div class="buttons">
            <el-button
              type="warning"
              icon="el-icon-microphone"
              circle
              @click="start()"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-remove-outline"
              circle
              @click="stop()"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-download"
              circle
              @click="downloadWAV()"
            ></el-button>
          </div>
        </div>
      </div>
      <div class="upload boxShadow">
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
          <div class="el-upload__text">音频上传</div>
        </el-upload>
      </div>
    </div>
    <div class="outputBox boxShadow bgColor">
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
      ctx: '',
      oTime: 0
    }
  },
  inject: ['setLoading'],
  mounted() {
    //初始化canvas
    this.init()
  },
  methods: {
    init() {
      let oCanvas = document.getElementById('canvas') // 显示波形的canvas
      let canvasCtx = oCanvas.getContext('2d')
      canvasCtx.fillStyle = 'rgb(250, 250, 250)'
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
      ctx.fillStyle = 'rgb(250, 250, 250)'
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

.inputBox2,
.outputBox {
  width: 1000px;
  margin: 30px auto;
}

.bgColor {
  background-color: rgba(250, 250, 250, 0.5);
}

.inputBox2 .left,
.inputBox2 .right {
  position: absolute;
  width: 3px;
  height: 50px;
  background-color: #01d8d0;
  left: 50%;
  top: -50px;
}

.inputBox2 .cir {
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background-color: #01d8d0;
}

.inputBox2 .left .cir {
  position: relative;
  left: -9px;
  top: -9px;
}

.inputBox2 .right .cir {
  position: relative;
  left: -9px;
  top: -9px;
}

.inputBox2 .left {
  transform-origin: left bottom;
  transform: rotate(45deg);
}

.inputBox2 .right {
  transform-origin: right bottom;
  transform: rotate(-45deg);
}

.boxShadow {
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
  border-radius: 4px;
}

.bigBoder {
  width: 500px;
  height: 320px;
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f;
  border-radius: 10px;
  background: #01d8d0;
  position: relative;
}

.time {
  position: absolute;
  bottom: 30px;
  color: #333;
  right: 100px;
}

.buttons {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
}

.buttons > button {
  margin-bottom: 10px;
  margin-left: 10px;
}

.buttons > button i[class^='el-icon-'] {
  font-size: 20px;
}

.bigBoder .canvas {
  position: absolute;
  left: 20px;
  top: 20px;
}

.inputBox2 {
  display: flex;
  width: 1060px;
  margin-top: 50px;
}

.inputBox2 .upload,
.upload-demo {
  height: 320px;
  width: 100%;
  position: relative;
}
.inputBox2 .el-upload-dragger {
  height: 100%;
  background-color: rgba(250, 250, 250, 0.5);
}

.inputBox2 .el-upload-dragger .el-icon-upload {
  font-size: 67px;
  color: #01d8d0;
  margin: 40px 0 16px;
  line-height: 50px;
  margin-top: 120px;
}

.inputBox2 .el-upload-list {
  margin: 0;
  padding: 0;
  list-style: none;
  /* display: none; */
  position: absolute;
  bottom: 15px;
  width: 100%;
}
.upload {
  height: 30vh;
  color: #aaa;
  margin-left: 15px;
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
