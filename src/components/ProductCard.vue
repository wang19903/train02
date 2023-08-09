<template>
    <v-card class="product-card">
        <v-card-title class="text-h5">{{ product.name }}</v-card-title>
        <v-card-subtitle class="text-left">{{ product.category }}</v-card-subtitle>
        <v-card-text class="text-left">{{ product.description }}</v-card-text>
        <v-card-actions>
            <v-btn text @click="add">加入購物車</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        product: {
            type: Object,
        },
    },
    methods: {
        add() {
            this.$emit('add', this.product)
        },
    },
}
</script>
