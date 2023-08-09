<template>
    <v-container>
        <snackbar #default="{ showMessage }">
            <v-row>
                <v-col>
                    <v-row class="mb-2">
                        <v-col cols="12" sm="6" class="d-flex align-items-center">
                            <h4 class="font-weight-black" style="font-size: 2rem; white-space: nowrap">商品清單</h4>
                            <v-divider class="mx-4 mt-0 d-none d-sm-block align-self-stretch fill-height" vertical />
                        </v-col>
                        <v-col cols="12" sm="6" class="text-sm-right mt-3 mt-sm-0 text-right">
                            <category
                                @sync="syncCategoryList"
                                @show-message="showMessage"
                                :products="products"
                                :category-list="categoryList"
                            />
                            <product-editor
                                @update="addProduct($event, showMessage)"
                                :category-list="categoryList"
                                @show-message="showMessage"
                            />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-autocomplete
                        v-model="selectedValue"
                        :items="categoryList"
                        chips
                        clearable
                        deletable-chips
                        multiple
                        rounded
                        small-chips
                        solo
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="elevation-12 rounded-xl">
                        <v-card-title>
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="productsFiltered"
                            item-key="id"
                            :search="search"
                            :custom-sort="custom"
                            :options.sync="sortBy"
                        >
                            <template v-slot:item.onSale="{ item }">
                                <v-icon v-if="item.onSale" color="primary">mdi-check</v-icon>
                                <v-icon v-else color="error">mdi-close </v-icon>
                            </template>
                            <template #item.actions="{ item }">
                                <div class="d-flex align-center position-relative fill-height">
                                    <product-editor
                                        :product="item"
                                        :category-list="categoryList"
                                        @update="updateProduct($event, showMessage)"
                                        @show-message="showMessage"
                                        is-icon
                                    />
                                    <product-deleter
                                        :product="item"
                                        @delete="deleteProduct($event, showMessage)"
                                        @show-message="showMessage"
                                    />
                                    <div
                                        class="ms-auto"
                                        draggable
                                        @dragstart="dragstart(item, products)"
                                        @dragover.prevent
                                        @drop="drop(item, showMessage)"
                                    >
                                        <v-tooltip left color="primary">
                                            <template v-slot:activator="{ on }">
                                                <div v-on="on" class="ms-auto drag-handle blue darken-2" />
                                                <v-btn small class="mb-2 d-sm-none" color="primary " dark v-on="on" icon>
                                                    <v-icon v-on="on" small> mdi-cursor-move </v-icon>
                                                </v-btn>
                                            </template>
                                            <span>拖移</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </snackbar>
    </v-container>
</template>

<script>
import data from '../json/data.json'
import ProductDeleter from '../components/ProductDeleter.vue'
import ProductEditor from '../components/ProductEditor.vue'
import Category from '../components/Category.vue'
import Snackbar from '../components/Snackbar.vue'

export default {
    components: { ProductEditor, ProductDeleter, Category, Snackbar },
    data() {
        return {
            headers: [
                { text: 'name', align: 'start', value: 'name' },
                { text: 'price', value: 'price' },
                { text: 'category', value: 'category' },
                { text: 'description', value: 'description', sortable: false },
                { text: 'onSale', value: 'onSale', sortable: false },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            products: [],
            search: '',
            categoryList: [],
            selectedValue: [],
            sortBy: {},
        }
    },
    created() {
        this.products = data
        this.categoryList = [...new Set(this.products.map((product) => product.category))]
    },
    computed: {
        productsFiltered() {
            return this.products.filter(
                (product) => (this.selectedValue.length === 0 && product) || this.selectedValue.includes(product.category)
            )
        },
    },
    methods: {
        updateProduct($event, showMessage) {
            const index = this.products.findIndex((product) => product.id === $event.id)
            if (index >= 0) {
                this.$set(this.products, index, Object.assign({}, $event))
                showMessage(`${$event.name} 更新成功`, 'success')
            } else {
                showMessage(`${$event.name} 更新失敗`, 'red accent-2')
            }
        },
        addProduct($event, showMessage) {
            const maxId = this.products.reduce((max, product) => {
                return Math.max(product.id, max)
            }, 0)
            const product = Object.assign({}, $event, { id: maxId + 1 })
            this.products.push(product)
            if (this.products.includes(product)) {
                showMessage(`${$event.name} 新增成功`, 'success')
            } else {
                showMessage(`${$event.name} 新增失敗`, 'red accent-2')
            }
        },
        deleteProduct($event, showMessage) {
            const index = this.products.findIndex((product) => product.id === $event.id)
            if (index >= 0) {
                this.products.splice(index, 1)
                showMessage(`${$event.name} 已刪除`, 'orange darken-2')
            } else {
                showMessage(`${$event.name} 刪除失敗`, 'red accent-2')
            }
        },
        syncCategoryList($event) {
            if (!$event.update) {
                return (this.categoryList = $event)
            }
            this.categoryList = $event.updateList
            this.products.forEach((product) => {
                if (product.category === $event.origin) {
                    product.category = $event.update
                }
            })
            let index = this.selectedValue.findIndex((category) => category === $event.origin)
            if (index !== -1) {
                this.selectedValue[index] = $event.update
            }
        },
        dragstart(item) {
            this.draggedIndex = item.id
        },
        drop(item, showMessage) {
            if (this.sortBy.sortBy.length) showMessage(`取消排序邏輯後才可看到拖曳結果`, 'orange darken-2')
            const targetIndex = this.products.findIndex((product) => product.id === item.id)
            const draggedIndex = this.products.findIndex((product) => product.id === this.draggedIndex)
            const draggedProduct = this.products.splice(draggedIndex, 1)
            const [ProductData] = draggedProduct
            this.products.splice(targetIndex, 0, ProductData)
        },
        custom(items, index, isDesc) {
            //將原本排序改成只判斷英文和數字，商品1、商品10、商品2=>商品1、商品2、商品10
            items.sort((a, b) => {
                if (index[0] === 'name') {
                    let A = a[index].replace(/[^0-9a-zA-Z]/g, '')
                    let B = b[index].replace(/[^0-9a-zA-Z]/g, '')
                    if (!isDesc[0]) {
                        return A - B
                    } else {
                        return B - A
                    }
                } else {
                    if (!isDesc[0]) {
                        return a[index] < b[index] ? -1 : 1
                    } else {
                        return b[index] < a[index] ? -1 : 1
                    }
                }
            })
            return items
        },
    },
    watch: {
        products: {
            handler() {
                sessionStorage.setItem('TRAIN-products', JSON.stringify(this.products))
            },
            deep: true,
        },
    },
}
</script>

<style scoped>
.drag-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -16px;
    width: 10px;
    cursor: move;
}

/*vuetify sm*/
@media (max-width: 600px) {
    .drag-handle {
        display: none;
    }
}
</style>
