<template>
 <section class="outro">
    <b>© Copyright {{year}} Your Mum Gay</b>
  </section>
</template>

<script>
export default {
  name: "outro",
  computed: {
    year() {
      return new Date().getFullYear() + 20;
    }
  }
};
</script>

<style>
</style>