<template>
  <v-app data-app>
    <div id="app">
      <DataTable
        :headers="headers"
        :desserts="desserts"
        :defaultIndex="defaultIndex"
        :defaultItem="defaultItem"
        :dialogDelete="dialogDelete"
        :dialog="dialog"
        @edit="editItem"
        @delete="deleteItem"
        @closeDelete="CloseDelete"
        @close="close"
        @deleteItemConfirm="deleteItemConfirm"
        @save="save"
      />
    </div>
  </v-app>
</template>

<script>
import DataTable from "./components/DataTable.vue";

export default {
  components: {
    DataTable
  },
  data() {
    return {
      headers: [
        { text: "name", align: "start", sortable: false, value: "name" },
        { text: "price", value: "price" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      desserts: [],
      dialogDelete: false,
      dialog: false,
      defaultIndex: -1,
      defaultItem: {
        name: "",
        price: 0
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch("./json/data.json") // 替换为实际的 API 地址
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.desserts = data; // 将获取的数据赋值给 desserts 属性
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    editItem(item) {
      console.log("APP-edit-item ", item.name);
      this.defaultIndex = this.desserts.indexOf(item);
      this.defaultItem = Object.assign({}, item);
      console.log("APP-edit-defaultItem ", this.defaultItem);
      this.dialog = true;
    },
    deleteItem(item) {
      console.log("APP-del ", item.name);
      this.defaultIndex = this.desserts.indexOf(item);
      this.dialogDelete = true;
    },
    CloseDelete() {
      this.dialogDelete = false;
    },
    close() {
        this.dialog = !this.dialog;
        console.log("close", this.dialog);
    },
    deleteItemConfirm() {
      console.log("del OK", this.defaultIndex);
      this.desserts.splice(this.defaultIndex, 1);
    },
    save(item) {
      if (this.defaultIndex > -1) {
        Object.assign(this.desserts[this.defaultIndex], item);
      } else {
        this.desserts.push(item);
      }
    }
  }
};
</script>
