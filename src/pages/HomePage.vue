<template>
    <div>
        <div class="fill-height position-relative">
            <v-card>
                <v-img
                    lazy-src="https://picsum.photos/1000/360"
                    src="https://picsum.photos/1000/360"
                    min-height="300"
                    max-height="360"
                >
                    <v-row class="white--text fill-height" no-gutters>
                        <v-col cols="12">
                            <p class="glassmorphism">這是 promotion 和 announcement 的文字區塊</p>
                        </v-col>
                        <v-col cols="12" class="d-flex justify-center align-center">
                            <h3 class="glassmorphism text-h3">這是 slogan 的文字區塊</h3>
                        </v-col>
                        <v-col cols="12" class="d-flex align-end">
                            <p class="glassmorphism mb-0 fill-width">這是 promotion 和 announcement 的文字區塊</p>
                        </v-col>
                    </v-row>
                </v-img>
            </v-card>
            <animation />
            <snackbar #default="{ showMessage }">
                <v-container>
                    <v-row>
                        <v-col cols="9">
                            <v-text-field placeholder="搜尋產品" v-model="search" />
                        </v-col>
                        <v-col cols="3">
                            <v-autocomplete
                                v-model="selectedValue"
                                label="類別"
                                :items="categoryList"
                                chips
                                deletable-chips
                                small-chips
                                solo
                            />
                        </v-col>
                    </v-row>
                    <v-row class="flex-column flex-sm-row">
                        <v-col cols="12" sm="10">
                            <template v-for="(product, index) in productsFiltered">
                                <div :key="product.id" class="mb-5" ref="productCards">
                                    <product-card :product="product" @add="addCart(product, showMessage)" :data-id="product.id" />
                                </div>
                                <template v-if="(index + 1) % 5 === 0">
                                    <a href="https://www.google.com/" target="_blank" :key="`ad-${index}`">
                                        <v-card class="mb-5" :style="{ height: cardHeight + 'px' }">
                                            <v-card-title class="text-h5" text-center>一些廣告詞</v-card-title>
                                            <v-card-text class="text-center">更多廣告詞......................</v-card-text>
                                        </v-card>
                                    </a>
                                </template>
                            </template>
                        </v-col>
                        <v-col cols="12" sm="2" class="index-1">
                            <v-carousel cycle hide-delimiters :show-arrows="false" height="300px" class="mb-3">
                                <v-carousel-item v-for="(color, index) in colors" :key="index">
                                    <v-sheet
                                        class="d-flex justify-center align-center flex-column"
                                        elevation="3"
                                        height="300px"
                                        :color="color"
                                    >
                                        <p>輪播廣告區</p>
                                        <p>{{ index }}</p>
                                    </v-sheet>
                                </v-carousel-item>
                            </v-carousel>
                            <v-sheet
                                class="d-flex justify-center align-center flex-column"
                                width="100%"
                                height="300px"
                                color="primary"
                            >
                                <p>時段廣告區</p>
                                <p>{{ timeAdvertise }}</p>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-container>
            </snackbar>
            <foot />
        </div>
    </div>
</template>

<script>
import ProductCard from '../components/ProductCard.vue'
import Foot from '../components/HomeFooter.vue'
import Snackbar from '../components/Snackbar.vue'
import Animation from '../components/HomeAnime.vue'
import data from '../json/data.json'
export default {
    components: { Animation, Snackbar, Foot, ProductCard },
    data() {
        return {
            products: [],
            categoryList: [],
            selectedValue: [],
            search: '',
            targets: [],
            saleStatistics: {},
            observer: null,
            colors: ['blue lighten-1', 'purple lighten-1', 'red lighten-1', 'orange lighten-1', 'teal lighten-1'],
            cardHeight: 0,
        }
    },
    created() {
        //模擬get API暫時用sessionStorage
        const storedProducts = sessionStorage.getItem('TRAIN-products')
        if (storedProducts && storedProducts !== JSON.stringify(data)) {
            this.products = JSON.parse(storedProducts)
        } else {
            this.products = data
        }
        this.categoryList = [...new Set(this.products.map((product) => product.category))]

        const userID = this.$root.selectedRole
        const allAdDate = JSON.parse(localStorage.getItem('TRAIN-statistics')) || {}
        this.saleStatistics = allAdDate[userID] || {}
    },
    mounted() {
        this.targets = document.querySelectorAll('.product-card')
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 1,
        }
        let callback = (entries) => {
            entries.forEach((entry) => {
                const productId = entry.target.dataset.id // 獲取產品 ID js
                const product = this.productsFiltered.find((product) => product.id == productId) // 找到對應的產品 vue
                if (product) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in')
                        if (!this.saleStatistics[product.id]) {
                            this.saleStatistics[product.id] = {
                                id: product.id,
                                name: product.name,
                                appear: Date.now(),
                                totalAppear: 0,
                                addCartTimes: 0,
                                quantity: 0,
                                totalPrice: 0,
                                addCartFailed: 0,
                            }
                        } else if (this.saleStatistics[product.id]) {
                            this.saleStatistics[product.id].appear = Date.now()
                        }
                    } else if (this.saleStatistics[product.id] && this.saleStatistics[product.id].appear) {
                        const disappear = Date.now()
                        this.saleStatistics[product.id].totalAppear += (disappear - this.saleStatistics[product.id].appear) / 1000
                        this.saleStatistics[product.id].appear = null
                    }
                }
            })
        }
        this.observer = new IntersectionObserver(callback, options)
        this.targets.forEach((target) => this.observer.observe(target))
        //離開網頁時儲存
        window.addEventListener('beforeunload', this.saveStatistics)
        //縮小視窗、關閉瀏覽器觸發
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') this.saveStatistics()
        })
        // 獲取第一個產品卡片的高度
        this.cardHeight = this.$refs.productCards[0].clientHeight
    },
    computed: {
        productsFiltered() {
            return this.products.filter(
                (product) =>
                    (this.selectedValue === null ||
                        this.selectedValue.length === 0 ||
                        this.selectedValue.includes(product.category)) &&
                    (product.name.includes(this.search) || product.description.includes(this.search) || this.search === '') &&
                    product.onSale === true
            )
        },
        timeAdvertise() {
            let currentTime = new Date().getHours()
            if (currentTime < 12) {
                return '早上的廣告'
            } else if (currentTime < 14) {
                return '中午的廣告'
            } else if (currentTime < 18) {
                return '下午的廣告'
            } else {
                return '晚上的廣告'
            }
        },
    },
    methods: {
        addCart($event, showMessage) {
            const userID = this.$root.selectedRole
            const storedProducts = JSON.parse(sessionStorage.getItem('TRAIN-products')) || []
            const index = storedProducts.findIndex((product) => {
                return product.id === $event.id
            })
            const product = Object.values(this.saleStatistics).find((product) => {
                return product.id === $event.id
            })
            if (storedProducts[index].onSale) {
                const allUser = JSON.parse(localStorage.getItem('TRAIN-cart')) || {}
                const user = allUser[userID] || { cart: [], history: [] }
                allUser[userID] = user
                const cartItems = user.cart
                let index = cartItems.findIndex((cartItem) => cartItem.id === $event.id)
                let existingItem = {}
                if (index !== -1) {
                    existingItem = cartItems[index]
                    cartItems[index] = Object.assign({}, existingItem, { count: existingItem.count + 1 })
                } else {
                    $event.count = 1
                    cartItems.push($event)
                }
                user.cart = cartItems
                product.addCartTimes += 1
                console.log(this.saleStatistics)
                localStorage.setItem('TRAIN-cart', JSON.stringify(allUser))
                showMessage('加入購物車成功', 'success')
            } else {
                this.saleStatistics[$event.id].addCartFailed += 1
                showMessage('加入購物車失敗', 'red accent-2')
            }
        },
        saveStatistics() {
            console.log(this.saleStatistics)
            const userID = this.$root.selectedRole
            const allAdDate = JSON.parse(localStorage.getItem('TRAIN-statistics')) || {}
            allAdDate[userID] = this.saleStatistics
            localStorage.setItem('TRAIN-statistics', JSON.stringify(allAdDate))
        },
    },
    beforeDestroy() {
        //卸載=>節省記憶體
        window.removeEventListener('beforeunload', this.saveStatistics)
    },
    beforeRouteLeave(to, from, next) {
        this.saveStatistics()
        next()
    },
    watch: {
        //篩選後觀察不到，重新觀察
        productsFiltered() {
            this.targets.forEach((target) => this.observer.unobserve(target))
            this.targets = document.querySelectorAll('.product-card')
            this.targets.forEach((target) => this.observer.observe(target))
        },
        saveStatistics() {
            const userID = this.$root.selectedRole
            const allAdDate = JSON.parse(localStorage.getItem('TRAIN-statistics')) || {}
            allAdDate[userID] = this.saleStatistics
            localStorage.setItem('TRAIN-statistics', JSON.stringify(allAdDate))
        },
    },
    beforeDestroy() {
        //卸載=>節省記憶體
        window.removeEventListener('beforeunload', this.saveStatistics)
    },
    beforeRouteLeave(to, from, next) {
        this.saveStatistics()
        next()
    },
    watch: {
        //篩選後觀察不到，重新觀察
        productsFiltered() {
            this.targets.forEach((target) => this.observer.unobserve(target))
            this.targets = document.querySelectorAll('.product-card')
            this.targets.forEach((target) => this.observer.observe(target))
        },
    },
}
</script>

<style scoped>
.glassmorphism {
    backdrop-filter: brightness(60%);
}

.fade-in {
    animation: fade-in 0.75s forwards;
}

@keyframes fade-in {
    0% {
        transform: translateY(100px);
    }
    100% {
        transform: translateY(0px);
        opacity: 1;
    }
}
</style>
