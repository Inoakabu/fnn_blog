<template>
 <section class="post">
    <div class="post--header" v-if="!visible">
      <h3>{{post.title}}</h3>
      <p>{{post.content}}</p>
    </div>
    <div class="post--functions">
      <button @click="deletePost()">D</button>
      <button @click="showEdit()">E</button>
    </div>
    <commentAdd :id="post.id" v-if="!visible"/>
    <commentEntry :comment="comment" v-for="comment in post.comments" :key="comment.id"/>
    <div class="post--functions" v-if="visible">
      <input type="text" v-model="post.title"/>
      <textarea v-model="post.content"/>
      <button @click="putPost()">Submit</button>
    </div>
  </section>
</template>

<script>
import commentAdd from "../comment/add.comment.vue";
import commentEntry from "../comment/entry.comment.vue";

export default {
  name: "post",
  props: ["post"],
  components: {
    commentAdd,
    commentEntry
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
    deletePost() {
      axios.delete("/post", { data: { post_id: this.post.id } });
      window.location.href = "/"; // laed die seite neu
    },
    showEdit() {
      this.visible = !this.visible;
    },
    putPost() {
      axios.put("/post", {
        post_id: this.post.id,
        post_title: this.post.title,
        post_content: this.post.content
      });
      window.location.href = "/"; // laed die seite neu
    }
  }
};
</script>

<style scoped>
.post {
  border: 1px solid blue;
}

.post--functions {
  border: 1px solid green;
}
</style>