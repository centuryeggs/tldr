<template>
  <div id="home" style="font-size: 40px;">
    <!-- <div style="font-size: 40px; margin-top: 10px">太长不看</div> -->
      <div
        class="vertical"
        :style="{
          color: direction === 'left' ? '#0004ff' : '#eee',
          position: 'absolute',
          left: '38%',
          top: '48%',
          fontSize: '30px'
        }"
      >
        Text
      </div>

    <div
      class="vertical"
      :style="{
        color: direction === 'right' ? '#0004ff' : '#eee',
        position: 'absolute',
        right: '38%',
        top: '47%',
        fontSize: '30px'
      }"><div>audio</div><div>video</div>
    </div>
  </div>
</template>

<script>
import nipplejs from "nipplejs";
export default {
  name: "Home",
  data() {
    return {
      direction: "",
    };
  },
  props: {},
  mounted() {
    var radius = 100;
    var sampleJoystick = {
      mode: "static",
      position: {
        left: "50%",
        top: "50%",
      },
      size: radius * 2,
      color: "black",
      zone: document.getElementById("home"),
    };

    var joystick;
    var position;
    joystick = nipplejs.create(sampleJoystick);
    joystick.on("end", (evt, data) => {
      console.log(this.direction);
      if (this.direction == "up") {
        this.$router.push("/home");
        // this.$router.push({ path: router.path, replace: true })
      } else if (this.direction == "down") {
        console.log("down");
      } else if (this.direction == "left") {
        this.$router.push("/text");
      } else if (this.direction == "right") {
        this.$router.push("/audio");
      }
    }).on(
      "dir:up plain:up dir:left plain:left dir:down" +
        "plain:down dir:right plain:right",
      (evt, data) => {
        this.direction = data.direction.angle;
      }
    )
  },
};
</script>

<style scoped>
#home {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
/* .vertical {
  writing-mode: tb-rl;
} */
/* .bounce-enter-active {
  animation: bounce-in 3s;
}
.bounce-leave-active {
  animation: bounce-in 1s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
     transform: scale(2.2, 1.6);
  }
  100% {
    transform: scale(1);
  }
} */
</style>
