<template>
 <div id="playground">
     {{data}}
  </div>
</template>

<script>
export default {
  name: "playground",
  data: () => {
    return {};
  }
};
</script>

<style scoped>
:root {
  --chroma-key: #5fa87b;
  --m-color: #ba0005;
  --bg-color: #020202;
}

* {
  box-sizing: border-box;
}
</style>