<template>
  <div id="text">
    <el-row :gutter="20" class="textBox">
      <el-col :span="24" class="buttons">
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="show = true"></el-button>
          <el-button type="primary" icon="el-icon-share" @click="show = false"></el-button>
        </el-button-group>
      </el-col>
      <el-col :span="11">
        <transition name="el-fade-in-linear">
          <el-input
          v-if="show"
            type="textarea"
            placeholder="请输入内容"
            v-model="textarea"
            class="text"
          >
          </el-input>
        </transition>
        <transition name="el-fade-in-linear">
          <div v-if="!show" class="text results">列表</div>
        </transition>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-right" circle> </el-button>
      </el-col>
      <el-col :span="11">
        <div class="text results">输出</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Text2Sum',
  data() {
    return {
      textarea: '',
      show:true
    }
  }
}
</script>

<style>
.textBox {
  width: 80vw;
  padding: 0 5vw;
  margin-left: 10vw;
  height: 90vh;
  margin-top: 5vh;
}

.text,
.text .el-textarea__inner {
  background-color: rgba(102, 102, 102, 0.25);
  border: none;
  border-radius: 10px;
  color: #666;
  text-align: left;
}

.text .el-textarea__inner {
  padding: 15px;
  height: calc(90vh - 70px);
}

.results {
  height: calc(90vh - 100px);
  padding: 15px;
}

.buttons {
  padding-bottom: 15px;
  width: 100%;
  display: flex;
  justify-items: start;
}
</style>
