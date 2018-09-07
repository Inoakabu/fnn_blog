<template>
  <div class="main">
    <intro :name="name"/>
    <post-add/>
    <postEntry v-for="entry in data" :key="entry.uid" :post="entry"/>
    <outro/>
  </div>
</template>

<script>
import intro from "./intro.vue";
import outro from "./outro.vue";
import postAdd from "../post/add.post.vue";
import postEntry from "../post/entry.post.vue";
export default {
  name: "main",
  components: {
    intro,
    postAdd,
    postEntry,
    outro
  },
  data: () => {
    return {};
  }
};
</script>

<style>
:root {
  --chroma-key: #5fa87b;
  --m-color: #ba0005;
  --bg-color: #020202;
}

* {
  box-sizing: border-box;
}

section {
  margin: 50px 0;
}
</style>