<template>
  <v-toolbar flat>
    <v-toolbar-title>My CRUD</v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark class="mb-2" v-bind="attrs" @click="close">
          New Item
        </v-btn>
        <p>321{{ defaultItem }}</p>
        <p>123{{ editedItem }}</p>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.name"
                  label="name"
                  @input="update('name', editedItem.name)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.price"
                  label="price"
                  @input="update('price', editedItem.price)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save(editedItem)">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    dialogDelete: Boolean,
    dialog: Boolean,
    defaultIndex: Number,
    defaultItem: Object
  },
  data() {
    return {
      //  editIndex:  -1,
      //   editedItem: this.defaultItem
    };
  },
  computed: {
    formTitle() {
      return this.editIndex === -1 ? "New Item" : "Edit Item";
    },
    editedItem() {
      return {
        name: this.defaultItem.name,
        price: this.defaultItem.price
      };
    }
  },
  watch: {
    // dialog(val) {
    //   val || this.close();
    // },
    // dialogDelete(val) {
    //   val || this.closeDelete();
    // }
    // defaultItem: {
    //   handler(newVal) {
    //     this.editedItem = { ...newVal };
    //   }
    // }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    closeDelete() {
      this.$emit("closeDelete");
    },
    save(item) {
      console.log("save3", item);
      this.$emit("save", item);
      this.close();
    },
    deleteItemConfirm() {
      this.$emit("deleteItemConfirm");
      this.closeDelete();
    },
    update(type, val) {
      console.log(val, this.editedItem);
      this.editedItem[type] = val;
    }
  }
};
</script>
