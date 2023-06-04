<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <DataTableToolbar
        :dialogDelete="dialogDelete"
        :dialog="dialog"
        :defaultItem="defaultItem"
        @closeDelete="closeDelete"
        @close="close"
        @deleteItemConfirm="deleteItemConfirm"
        @save="save"
      />
    </template>
    <template v-slot:item.actions="{ item }">
      <DataTableActions :item="item" @edit="editItem" @delete="deleteItem" />
    </template>
  </v-data-table>
</template>

<script>
import DataTableToolbar from "./DataTableToolbar.vue";
import DataTableActions from "./DataTableActions.vue";

export default {
  props: {
    headers: Array,
    desserts: Array,
    defaultIndex: Number,
    defaultItem: Object,
    dialogDelete: Boolean,
    dialog: Boolean
  },
  components: {
    DataTableToolbar,
    DataTableActions
  },
  methods: {
    editItem(item) {
      this.$emit("edit", item);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
    closeDelete() {
      this.$emit("closeDelete");
    },
    close() {
      this.$emit("close");
    },
    deleteItemConfirm() {
      this.$emit("deleteItemConfirm");
    },
    save(item) {
      this.$emit("save", item);
    }
  }
};
</script>
