<template>
    <v-dialog v-model="dialog" width="100%" max-width="1745px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn small color="primary" dark class="mb-2" v-bind="attrs" v-on="on" icon :disabled="disabled">
                <v-icon small> mdi-delete </v-icon>
            </v-btn>
        </template>
        <v-card class="elevation-12 rounded-xl">
            <v-card-text>
                <v-card-title class="text-h5 font-weight-bold">
                    確定要刪除&nbsp;
                    <slot />
                    &nbsp;嗎?
                </v-card-title>
                <v-card-text>此操作將無法取回資料</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" class="mr-1 rounded-lg" @click="cancel">取消</v-btn>
                    <v-btn color="primary" class="rounded-lg" @click="deleteConfirm">確定</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
        cancel() {
            this.dialog = false
            this.$emit('show-message', '取消操作')
        },
        deleteConfirm() {
            this.$emit('delete')
            this.dialog = false
        },
    },
}
</script>
