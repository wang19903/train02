<template>
    <div>
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: Object,
    },
    methods: {
      editItem(item) {
        this.$emit('edit', item);
      },
      deleteItem(item) {
        this.$emit('delete', item);
      },
    },
  };
  </script>
  