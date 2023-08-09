<template>
    <v-dialog v-model="dialog" width="100%" max-width="1745px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2 ms-2 rounded-lg" v-bind="attrs" v-on="on" @click="open">類別設定</v-btn>
        </template>
        <v-card class="rounded-xl overflow-hidden">
            <v-card-title>
                <v-toolbar-title>
                    <span class="text-h4">類別設定</span>
                </v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-container fluid>
                <v-form ref="form" @submit.prevent>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                label="category"
                                v-model="newCategory"
                                :rules="[
                                    rules.required,
                                    rules.noSpecialChars,
                                    rules.lengthLimit,
                                    rules.keyboardSequence,
                                    rules.isExist(newCategoryList),
                                ]"
                            />
                        </v-col>
                        <v-col cols="6" class="d-flex">
                            <v-btn color="primary" dark class="mb-2 ms-2 rounded-lg align-self-center" @click="add">新增</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
            <v-card-text class="px-4 py-0">數量要小於0才可刪除</v-card-text>
            <v-data-table :headers="headers" :items="listCategory" item-key="id">
                <template #item="{ item, index }">
                    <tr class="text-left">
                        <td>{{ item.category }}</td>
                        <td>{{ item.count }}</td>
                        <td>
                            <category-editor
                                :category="item.category"
                                :category-list="newCategoryList"
                                @update="updateCategory($event)"
                                @show-message="showMessage"
                            />
                            <category-deleter
                                :disabled="item.count !== 0"
                                @show-message="showMessage"
                                @delete="deleteCategory(item)"
                            >
                                <span class="red--text text--accent-2">{{ item.category }}</span>
                            </category-deleter>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-dialog>
</template>

<script>
import CategoryDeleter from './CategoryDeleter.vue'
import CategoryEditor from './CategoryEditor.vue'
import { rules } from '../utils/validationRules'

export default {
    components: { CategoryDeleter, CategoryEditor },
    props: {
        products: {
            type: Array,
            default: [],
        },
        categoryList: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            dialog: false,
            newCategory: '',
            newCategoryList: [],
            headers: [
                { text: 'category', value: 'category' },
                { text: 'count', value: 'count' },
                { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
            ],
            rules,
        }
    },
    created() {
        this.newCategoryList = this.categoryList
    },
    computed: {
        listCategory() {
            const tmp = {}
            this.categoryList.forEach((category) => {
                tmp[category] = 0
            })
            this.products.forEach((product) => {
                if (tmp[product.category]) {
                    tmp[product.category]++
                } else {
                    tmp[product.category] = 1
                }
            })
            let result = Object.keys(tmp).map((category) => ({
                category,
                count: tmp[category],
            }))
            return result
        },
    },
    //類別的CRUD處理完，送到product同步
    methods: {
        showMessage(msg = '取消操作', color = '') {
            this.$emit('show-message', msg, color)
        },
        open() {
            this.dialog = true
            this.$refs.form?.resetValidation()
        },
        add() {
            if (this.$refs.form.validate()) {
                if (typeof this.newCategory !== 'string') {
                    this.showMessage(`${this.newCategory} 新增失敗`, 'red accent-2')
                } else {
                    this.newCategoryList.push(this.newCategory)
                    this.$emit('sync', this.newCategoryList)
                    this.showMessage(`${this.newCategory} 新增成功`, 'success')
                    this.newCategory = ''
                    this.$refs.form?.resetValidation()
                }
            }
        },
        deleteCategory($event) {
            if ($event.count !== 0) {
                return this.showMessage(`產品沒有類別: ${$event.category} 才可刪除。`, 'red accent-2')
            }
            const idx = this.newCategoryList.findIndex((category) => category === $event.category)
            if (idx >= 0) {
                this.newCategoryList.splice(idx, 1)
                this.$emit('sync', this.newCategoryList)
                this.showMessage(`${$event.category} 已刪除`, 'orange darken-2')
            } else {
                this.showMessage(`${newCategoryList[idx]} 刪除失敗`, 'red accent-2')
            }
        },
        updateCategory($event) {
            const { editCategory, originCategory } = $event
            const idx = this.newCategoryList.findIndex((category) => category === originCategory)
            if (idx >= 0) {
                const tmpArr = [...this.newCategoryList]
                tmpArr[idx] = editCategory
                const checkSame = new Set(tmpArr)
                if (checkSame.size !== tmpArr.length) {
                    return this.showMessage(`${editCategory} 與其他類別相同名稱`, 'red accent-2')
                }
                this.newCategoryList = [...tmpArr]
                this.$emit('sync', { updateList: this.newCategoryList, update: editCategory, origin: originCategory })
                this.showMessage(`${originCategory} 更新為 ${editCategory}`, 'success')
            } else {
                this.showMessage(`${originCategory} 更新失敗`, 'red accent-2')
            }
        },
    },
}
</script>
