<template>
    <v-dialog v-model="dialog" width="100%" max-width="1745px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn small class="mb-2" color="primary" dark v-bind="attrs" v-on="on" @click="open" icon v-if="isIcon">
                <v-icon small class="mr-2"> mdi-pencil </v-icon>
            </v-btn>
            <v-btn color="primary" dark class="mb-2 ms-2 rounded-lg" v-bind="attrs" v-on="on" @click="open" v-else>
                新增商品
            </v-btn>
        </template>
        <v-card class="rounded-xl">
            <v-card-title>
                <span class="text-h4">{{ editedItem.id === -1 ? '新增' : '編輯' }}商品</span>
            </v-card-title>
            <v-form ref="form" @submit.prevent>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="editedItem.name"
                                    label="name"
                                    :rules="[rules.required, rules.noSpecialChars, rules.lengthLimit]"
                                    required
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model.number="editedItem.price"
                                    label="price"
                                    prefix="$"
                                    :rules="[rules.required, rules.greaterThanZero]"
                                    type="number"
                                    required
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-select
                                    v-model="editedItem.category"
                                    label="category"
                                    :items="categoryList"
                                    :rules="[rules.required]"
                                    required
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-checkbox v-model="editedItem.onSale" label="是否上架" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="editedItem.description"
                                    label="description"
                                    outlined
                                    counter
                                    maxlength="150"
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
        product: {
            type: Object,
            default: () => ({
                id: -1,
                name: '',
                price: '',
                category: '',
                description: '',
                onSale: false,
            }),
        },
        isIcon: {
            type: Boolean,
            default: false,
        },
        categoryList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            dialog: false,
            editedItem: {
                id: -1,
                name: '',
                price: 0,
                category: '',
                description: '',
                onSale: false,
            },
            rules: {
                ...rules,
            },
        }
    },
    methods: {
        cancel() {
            this.dialog = false
            this.$emit('show-message', '取消操作')
        },
        save() {
            if (this.$refs.form.validate()) {
                this.editedItem.name = this.editedItem.name.trim()
                this.$emit('update', this.editedItem)
                this.dialog = false
            }
        },
        open() {
            this.editedItem = Object.assign({}, this.product)
            this.$refs.form?.resetValidation()
        },
    },
}
</script>
