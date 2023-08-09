<template>
    <v-dialog v-model="dialog" width="100%" max-width="1745px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn small class="mb-2" color="primary" dark v-bind="attrs" v-on="on" @click="open" icon>
                <v-icon small class="mr-2"> mdi-pencil </v-icon>
            </v-btn>
        </template>
        <v-card class="rounded-xl">
            <v-card-title>
                <span class="text-h4">編輯類別</span>
            </v-card-title>
            <v-form ref="form" @submit.prevent>
                <v-card-text>
                    修改後會改變產品列表的類別
                    <v-container>
                        <v-row>
                            <v-col cols="10">
                                <v-text-field
                                    v-model="editCategory"
                                    label="category"
                                    :rules="[
                                        rules.required,
                                        rules.noSpecialChars,
                                        rules.lengthLimit,
                                        rules.keyboardSequence,
                                        rules.isExist(newCategoryList),
                                    ]"
                                    required
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" class="mr-1 rounded-lg" @click="cancel">取消</v-btn>
                    <v-btn color="primary" class="rounded-lg" @click="save">確定</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { rules } from '../utils/validationRules'

export default {
    props: {
        category: {
            type: String,
            default: '',
        },
        categoryList: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            dialog: false,
            editCategory: '',
            rules,
        }
    },
    computed: {
        newCategoryList() {
            return this.categoryList.filter((category) => {
                return category !== this.category
            })
        },
    },
    methods: {
        cancel() {
            this.dialog = false
            this.editCategory = ''
            this.$emit('show-message', '取消操作')
        },
        save() {
            if (this.$refs.form.validate()) {
                this.$emit('update', {
                    editCategory: this.editCategory.trim(),
                    originCategory: this.category,
                })
                this.dialog = false
            }
        },
        open() {
            this.editCategory = this.category
            this.$refs.form?.resetValidation()
        },
    },
}
</script>
