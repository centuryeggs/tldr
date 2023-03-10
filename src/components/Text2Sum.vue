<template>
  <div id="text">
    <div class="inputBox">
      <div class="upload" v-if="$route.params.type == 'text'">
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
      <div v-else>
        <section class="main-controls">
          <canvas class="visualizer" height="60px"></canvas>
          <div id="buttons">
            <button class="record">Record</button>
            <button class="stop">Stop</button>
          </div>
        </section>

        <section class="sound-clips"></section>
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
  name: 'Text2Sum',
  data() {
    return {
      activeName: 'doc',
      results: ''
    }
  },
  mounted() {
    if (this.$route.params.type != 'text') {
      this.init()
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleAvatarSuccess(res) {
      this.results = res.data;
      window.waveColor = [238, 238, 238]
      window.waveSpeed = 0.03
    },
    onProgress(event, file, fileList) {
      console.log(event, file, fileList);
      window.waveColor =  [27, 30, 43]// [27, 30, 43] [252, 85, 49]
      window.waveSpeed = 0.1
    },
    onError() {
      window.waveColor = [238, 238, 238]
      window.waveSpeed = 0.03
    },
    init() {
      // set up basic variables for app
      const record = document.querySelector('.record')
      const stop = document.querySelector('.stop')
      const soundClips = document.querySelector('.sound-clips')
      const canvas = document.querySelector('.visualizer')
      const mainSection = document.querySelector('.main-controls')

      // disable stop button while not recording

      stop.disabled = true

      // visualiser setup - create web audio api context and canvas

      let audioCtx
      const canvasCtx = canvas.getContext('2d')

      //main block for doing the audio recording
      //判断浏览器是否支持该功能
      if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.')
        // 媒体类型设置了 true ，配置需要获取的权限类型
        const constraints = { audio: true }
        let chunks = []
        //允许授权
        //参数是MediaStream 对象
        let onSuccess = function (stream) {
          //创建一个新的MediaRecorder对象，对指定的MediaStream 对象进行录制
          const mediaRecorder = new MediaRecorder(stream)

          visualize(stream)

          record.onclick = function () {
            window.waveSpeed = 0.005
            // window.waveColor = [185, 216, 201] //
            //开始录制
            mediaRecorder.start()
            console.log(mediaRecorder.state)
            console.log('recorder started')
            record.style.background = 'red'

            stop.disabled = false
            record.disabled = true
          }

          stop.onclick = function () {
            window.waveSpeed = 0.03
            window.waveColor = [238, 238, 238]
            //调用stop后，自记录开始或dataavailable事件最后一次发生以来已捕获的所有媒体数据都将传递到Blob}中；此后，捕获结束。
            mediaRecorder.stop()
            console.log(mediaRecorder.state)
            console.log('recorder stopped')
            record.style.background = ''
            record.style.color = ''
            //将传递自记录开始或事件最后一次发生以来捕获的所有媒体数据；然后Blob创建一个新文件，并将媒体捕获继续到该 blob 中。
            //这里为啥要注释呢
            // mediaRecorder.requestData();

            stop.disabled = true
            record.disabled = false
          }
          //点击暂停
          mediaRecorder.onstop = function (e) {
            console.log('data available after MediaRecorder.stop() called.')
            // 弹窗提示框输入音频文件名称
            const clipName = prompt(
              'Enter a name for your sound clip?',
              'My unnamed clip'
            )
            //动态生成界面元素
            const clipContainer = document.createElement('article')
            const clipLabel = document.createElement('p')
            const audio = document.createElement('audio')
            const deleteButton = document.createElement('button')

            clipContainer.classList.add('clip')
            audio.setAttribute('controls', '')
            deleteButton.textContent = 'Delete'
            deleteButton.className = 'delete'

            if (clipName === null) {
              clipLabel.textContent = 'My unnamed clip'
            } else {
              clipLabel.textContent = clipName
            }

            clipContainer.appendChild(audio)
            clipContainer.appendChild(clipLabel)
            clipContainer.appendChild(deleteButton)
            soundClips.appendChild(clipContainer)
            //生成ogg文件流
            audio.controls = true
            // const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
            const blob = new Blob(chunks, { type: 'audio/wav' })
            chunks = []
            const audioURL = window.URL.createObjectURL(blob)
            audio.src = audioURL
            console.log('recorder stopped')

            deleteButton.onclick = function (e) {
              let evtTgt = e.target
              evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode)
            }

            clipLabel.onclick = function () {
              const existingName = clipLabel.textContent
              const newClipName = prompt(
                'Enter a new name for your sound clip?'
              )
              if (newClipName === null) {
                clipLabel.textContent = existingName
              } else {
                clipLabel.textContent = newClipName
              }
            }
          }
          // 当 MediaRecorder 将媒体数据传递到您的应用程序以供使用时，将触发该事件
          //所以chunks中数组形式存储了所有的媒体数据
          mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data)
          }
        }
        //拒绝授权
        let onError = function (err) {
          console.log('The following error occured: ' + err)
        }
        //提示用户给予使用媒体输入的许可，授权成功，它返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(onSuccess, onError)
      } else {
        console.log('getUserMedia not supported on your browser!')
      }

      function visualize(stream) {
        if (!audioCtx) {
          // 浏览器原生提供AudioContext对象，
          // 音频上下文控制其所包含节点的创建和音频处理、解码。使用其他接口前你必需创建一个音频上下文，一切操作都在这个环境里进行。
          audioCtx = new AudioContext()
        }
        // 创建一个新的 MediaStreamAudioSourceNode 对象，需要传入一个媒体流对象 (MediaStream 对象)，然后来自 MediaStream 的音频就可以被播放和操作。
        const source = audioCtx.createMediaStreamSource(stream)
        // 可以用来获取音频时间和频率数据，以及实现数据可视化。
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 2048
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        source.connect(analyser)
        //analyser.connect(audioCtx.destination);

        //canvas界面绘制波形图
        draw()

        function draw() {
          const WIDTH = canvas.width
          const HEIGHT = canvas.height

          requestAnimationFrame(draw)
          //AnalyserNode 接口的 getByteTimeDomainData() 方法复制当前波形或时域数据到传递给它的 Uint8Array (en-US) (无符号字节数组) 中
          analyser.getByteTimeDomainData(dataArray)

          canvasCtx.fillStyle = 'rgb(200, 200, 200)'
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

          canvasCtx.lineWidth = 2
          canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

          canvasCtx.beginPath()

          let sliceWidth = (WIDTH * 1.0) / bufferLength
          let x = 0

          for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128.0
            let y = (v * HEIGHT) / 2

            if (i === 0) {
              canvasCtx.moveTo(x, y)
            } else {
              canvasCtx.lineTo(x, y)
            }

            x += sliceWidth
          }

          canvasCtx.lineTo(canvas.width, canvas.height / 2)
          canvasCtx.stroke()
        }
      }

      window.onresize = function () {
        canvas.width = mainSection.offsetWidth
      }

      window.onresize()
    }
  }
}
</script>

<style>
#text {
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
.upload {
  height: 30vh;
  color: #aaa;
}
.outputBox {
  height: 50vh;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
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
