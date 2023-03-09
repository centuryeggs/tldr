<template>
  <div id="text">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="card"
      class="inputBox"
    >
      <el-tab-pane label="文档分析" name="doc">
        <div class="upload">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </div>
      </el-tab-pane>
      <el-tab-pane label="音频分析" name="void">
        <div>音频列表</div>
      </el-tab-pane>
    </el-tabs>

    <div class="outputBox">
      <div class="textContent" v-if="results">{{results}}</div>
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
      results:""
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
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
.inputBox {
  height: 30vh;
}
.outputBox {
  height: 60vh;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.textContent{
  height:calc(60vh - 60px);
  width: calc(1000px - 30px);
  text-align: left;
  color:#666;
}

.el-upload-dragger{
  border:none;
}
</style>
