<template>
 <div class="comment">
    <div class="comment--header" v-if="!visible">
      <p>{{comment.content}}</p>
    </div>

    <div class="comment--functions">
      <button @click="deletecomment()">D</button>
      <button @click="showEdit()">E</button>
    </div>
    <div class="comment--functions" v-if="visible">
      <textarea v-model="comment.content"/>
      <button @click="putcomment()">Submit</button>
    </div>
  </div>
</template>

<script>
import commentAdd from "../comment/add.comment.vue";

export default {
  name: "comment",
  props: ["comment"],
  components: {
    commentAdd
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    postEntry() {
      return this.post.id;
    }
  },
  methods: {
    deletecomment() {
      axios.delete("/comment", { data: { comment_id: this.comment.id } });
      window.location.href = "/"; // laed die seite neu
    },
    showEdit() {
      this.visible = !this.visible;
    },
    putcomment() {
      axios.put("/comment", {
        comment_id: this.comment.id,
        content: this.comment.content
      });
      window.location.href = "/"; // laed die seite neu
    }
  }
};
</script>

<style scoped>
.comment {
  border: 1px solid red;
}
.comment--functions {
  border: 1px solid violet;
}
</style>