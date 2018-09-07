<template>
 <div class="comment-add">
    <textarea v-model="content"/>
    <button @click="submitComment()">Submit</button>
  </div>
</template>

<script>
export default {
  name: "comment-add",
  props: ["id"],
  data: () => {
    return {
      content: undefined
    };
  },
  methods: {
    submitComment() {
      axios.post("/comment", { content: this.content, post_id: this.id });
      window.location.href = "/"; // laed die seite neu
    }
  }
};
</script>

<style scoped>
</style>