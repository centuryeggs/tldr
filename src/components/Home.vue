<template>
  <div id="home">
    <div style="font-size: 40px; margin-top: 60px">TL;DR</div>
    <!-- <div style="font-size: 40px; margin-top: 10px">太长不看</div> -->
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
/* #home {
  color: #7dbed6;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
} */

</style>
