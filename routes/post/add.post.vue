<template>
 <div class="post-add">
    <input type="text" v-model="post.title" />
    <textarea v-model="post.content"/>
    <button @click="submitPost()">Submit</button>
  </div>
</template>

<script>
export default {
  name: "post-add",
  data: () => {
    return {
      post: {
        title: undefined,
        content: undefined
      }
    };
  },
  methods: {
    submitPost() {
      axios.post("/post", this.post); // schickt via axios(http client) nen "post"-request raus
      window.location.href = "/"; // laed die seite neu
    }
  }
};
</script>

<style scoped>
.post-add {
  border: 1px solid black;
}
</style>