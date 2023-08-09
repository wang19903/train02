<template>
    <div>
        <p class="pa-2 text-h5 black--text font-weight-medium">購物車</p>
        <v-card v-if="cart.length" flat>
            <v-row class="flex-column" no-gutters>
                <v-col cols="12" class="py-0 d-flex justify-space-between" v-for="product in cart" :key="product.id">
                    <div class="fill-width">
                        <v-card-title class="pb-0">
                            {{ product.name }}
                        </v-card-title>
                        <v-card-text class="text--primary d-flex justify-space-between">
                            <div class="d-flex">
                                <p>售價: ${{ product.price }} 數量: {{ product.count }}</p>
                            </div>
                            <p v-if="!cartSync">共: ${{ product.price * product.count }}</p>
                        </v-card-text>
                    </div>

                    <v-card-actions class="flex-column" v-if="cartSync">
                        <v-btn icon @click="add(product)">
                            <v-icon> mdi-plus </v-icon>
                        </v-btn>
                        <v-btn icon @click.stop="minus(product)" class="ml-0">
                            <v-icon> mdi-minus </v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
            <p class="text-right pa-2 text-h5 black--text font-weight-medium">總計: ${{ total }}</p>
            <div class="d-flex justify-center">
                <v-btn v-if="cartSync" to="/shop/CheckOut" link max-width="100px">checkout</v-btn>
            </div>
        </v-card>
        <p v-else class="text-center mt-5 text-h5">購物車是空的</p>
    </div>
</template>

<script>
export default {
    props: {
        cartSync: {
            //初始值作為樣式設定，放在頁面時不能按鈕
            typeof: Boolean,
            default: false,
        },
    },
    data: () => ({
        cart: [],
        userID: '',
    }),
    created() {
        this.userID = this.$root.selectedRole
        if (JSON.parse(localStorage.getItem('TRAIN-cart')) && JSON.parse(localStorage.getItem('TRAIN-cart'))[this.userID]) {
            this.cart = JSON.parse(localStorage.getItem('TRAIN-cart'))[this.userID].cart || []
        }
        // console.log('orderList', this.$routes)
    },
    computed: {
        total() {
            return this.cart.reduce((total, product) => {
                total += product.count * product.price
                return total
            }, 0)
        },
    },
    methods: {
        add($event) {
            let index = this.cart.findIndex((product) => product.id === $event.id)
            let product = this.cart[index]
            if (index !== -1) {
                this.$set(this.cart, index, Object.assign({}, product, { count: product.count + 1 }))
            }
            const allUser = JSON.parse(localStorage.getItem('TRAIN-cart')) || {}
            allUser[this.userID].cart = this.cart
            localStorage.setItem('TRAIN-cart', JSON.stringify(allUser))
        },
        minus($event) {
            let index = this.cart.findIndex((product) => product.id === $event.id)
            let product = this.cart[index]
            if (index !== -1) {
                if (product.count > 1) {
                    this.$set(this.cart, index, Object.assign({}, product, { count: product.count - 1 }))
                } else {
                    this.cart.splice(index, 1)
                }
                const allUser = JSON.parse(localStorage.getItem('TRAIN-cart')) || {}
                allUser[this.userID].cart = this.cart
                localStorage.setItem('TRAIN-cart', JSON.stringify(allUser))
            }
        },
    },
    watch: {
        cartSync() {
            this.userID = this.$root.selectedRole
            const allUser = JSON.parse(localStorage.getItem('TRAIN-cart')) || {}
            this.cart = allUser[this.userID]?.cart || []
        },
    },
}
</script>
