<template>
    <div class="d-flex flex-column justify-space-between" style="min-height: 100vh">
        <v-container>
            <v-tabs v-model="tab">
                <v-tab v-for="item in tabItems" :key="item">{{ item }}</v-tab>

                <v-tab-item><cartList /></v-tab-item>

                <v-tab-item>
                    <v-card>
                        <v-card-title>
                            search
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-card-title>
                        <v-data-table :headers="headers" :items="historyList" :search="search">
                            <template #item.actions="{ item }">
                                <!-- <v-icon color="primary">mdi-list-box </v-icon> -->
                                <!--  -->
                                <v-dialog v-model="dialog" width="100%" max-width="1745px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            small
                                            color="primary"
                                            dark
                                            v-bind="attrs"
                                            v-on="on"
                                            icon
                                            @click="setCurrentItem(item)"
                                        >
                                            <v-icon small> mdi-list-box </v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card class="elevation-12 rounded-xl">
                                        <v-card-title class="mb-3">
                                            <v-toolbar-title>
                                                <span class="text-h4">訂單編號:{{ currentItem.time }}</span>
                                            </v-toolbar-title>
                                            <v-spacer />
                                            <v-btn icon @click="dialog = false">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row class="flex-column mb-3 black--text text-body-1">
                                                <v-col cols="12"> 訂單時間: {{ formatTime(currentItem.time) }} </v-col>
                                                <v-col cols="12"> 訂購人:{{ currentItem.name }} </v-col>
                                                <v-col cols="12"> 地址:{{ currentItem.address }} </v-col>
                                                <v-col cols="12"> 卡號末四碼:{{ currentItem.cardNumber }} </v-col>
                                            </v-row>

                                            <cartList />

                                            <v-card-actions>
                                                <v-spacer />
                                                <v-btn color="error" class="mr-1 rounded-lg" @click="dialog = false">關閉</v-btn>
                                                <v-spacer />
                                            </v-card-actions>
                                        </v-card-text>
                                    </v-card>
                                </v-dialog>
                                <!--  -->
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </v-container>
        <foot class="mt-auto" />
    </div>
</template>

<script>
//表單用tab分成歷史紀錄表格以及購物車內容00
//購物車內容有重複使用可以考慮做成元件，只有側欄做成list可以考慮跟其他人一樣00
//歷史紀錄表格顯示名字、時間戳、信箱、交易總金額、數量、00
//顯示清單彈窗按鈕
//彈窗顯示詳細購物清單、名字、完整地址、卡號末4碼
//點選商品時增加ID、點選送出訂單時增加時間戳，清空購物車
//searh table00
import Foot from '../components/HomeFooter.vue'
import CartList from '../components/CartList.vue'
export default {
    components: { Foot, CartList },
    name: 'OrderCompelet',
    props: ['orderList'],
    data: () => ({
        dialog: false,
        tab: null,
        tabItems: ['購物車', '歷史紀錄'],
        user: {},
        search: '',
        currentItem: 0,
        headers: [
            { text: 'Id', align: 'start', value: 'time' },
            { text: 'Name', value: 'name' },
            { text: 'Email', value: 'email' },
            { text: 'Total', value: 'total' },
            { text: 'Quantity', value: 'quantity' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),
    created() {
        const allUser = JSON.parse(localStorage.getItem('TRAIN-cart')) || {}
        const userID = this.$root.selectedRole
        this.user = allUser[userID]
        console.log(this.user)
    },
    computed: {
        total() {
            return this.cartArray.reduce((total, product) => {
                total += product.count * product.price
                return total
            }, 0)
        },
        historyList() {
            let historyArray = []
            this.user.history.forEach((item) => {
                let tmp = {}
                console.log('item', item.timeStamp)
                tmp.time = item.timeStamp
                tmp.name = item.orderList.FirstName.concat(',', item.orderList.LastName)
                tmp.email = item.orderList.Email
                tmp.total = item.cartItems.reduce((total, product) => {
                    total += product.count * product.price
                    return total
                }, 0)
                tmp.quantity = item.cartItems.reduce((total, product) => {
                    total += product.count
                    return total
                }, 0)
                tmp.address = `${item.orderList.country} ${item.orderList.address1}${item.orderList.address2} ${item.orderList.zip}`
                tmp.cardNumber = item.orderList.cardNumber
                historyArray.push(tmp)
            })

            return historyArray
        },
    },
    methods: {
        home() {
            this.$router.push('/shop')
            localStorage.removeItem('TRAIN-cart')
        },
        formatTime(item) {
            let date = new Date(item)
            // YYYY/MM/DD HH:mm:ss
            let formatted = `${date.getFullYear().toString()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/
            ${date.getDate().toString().padStart(2, '0')}  ${date.getHours().toString().padStart(2, '0')}:
                ${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            return formatted
        },
        setCurrentItem(item) {
            this.currentItem = item
        },
    },
}
</script>
