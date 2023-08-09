<template>
    <v-container>
        <snackbar #default="{ showMessage }">
            <v-row>
                <v-col cols="12" class="" md="6">
                    <v-sheet elevation="3">
                        <cartList />
                    </v-sheet>
                    <p class="pa-2 text-h5 black--text font-weight-medium">訂購資訊</p>
                    <v-card class="pa-2">
                        <v-form ref="form1" @submit.prevent>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        label="First name"
                                        v-model="orderList.FirstName"
                                        filled
                                        required
                                        :rules="[rules.required, rules.noSpecialChars]"
                                    />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        label="Last name"
                                        v-model="orderList.LastName"
                                        filled
                                        required
                                        :rules="[rules.required, rules.noSpecialChars]"
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        label="E-mail"
                                        v-model="orderList.Email"
                                        filled
                                        required
                                        :rules="[rules.emailRules]"
                                    />
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        label="country"
                                        v-model="orderList.country"
                                        filled
                                        required
                                        :rules="[rules.required]"
                                    />
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        label="zip"
                                        v-model="orderList.zip"
                                        filled
                                        required
                                        :rules="[rules.atLeastLength(3)]"
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        label="address1"
                                        v-model="orderList.address1"
                                        filled
                                        required
                                        :rules="[rules.atLeastOne(orderList.address1, orderList.address2)]"
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        label="address2"
                                        v-model="orderList.address2"
                                        filled
                                        required
                                        :rules="[rules.atLeastOne(orderList.address1, orderList.address2)]"
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card>
                </v-col>

                <v-col class="" cols="12" md="6">
                    <p class="pa-2 text-h5 black--text font-weight-medium">付款資訊</p>
                    <v-form ref="form2" @submit.prevent>
                        <div>
                            <v-card
                                :height="height"
                                width="100%"
                                max-width="430px"
                                max-height="270"
                                flat
                                class="position-relative mx-auto card-item fill-width my-5"
                                :class="{ '-active': isCardFlipped }"
                            >
                                <div class="card-side front">
                                    <div class="border-radius">
                                        <div
                                            class="card-item-focus h-100 fill-height"
                                            :class="{ '-active': focusElementStyle }"
                                            :style="focusElementStyle"
                                            ref="focusElement"
                                        ></div>
                                    </div>
                                    <div class="card-background-wrapper">
                                        <v-img
                                            v-bind:src="
                                                'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +
                                                currentCardBackground +
                                                '.jpeg'
                                            "
                                            contain
                                        />
                                    </div>
                                    <div class="card-front-wrapper py-6 px-4 position-relative fill-height">
                                        <v-row class="fill-height" align="start" justify="space-between" no-gutters>
                                            <v-col cols="6" class="pb-4 pb-md-10 pb-sm-6 pb-4 pl-2">
                                                <div class="card-left-img">
                                                    <v-img
                                                        max-width="60px"
                                                        min-width="40px"
                                                        src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                                                    >
                                                    </v-img>
                                                </div>
                                            </v-col>
                                            <v-col cols="6" class="card-type-img pr-2 d-flex justify-end">
                                                <transition name="slide-fade-up">
                                                    <v-img
                                                        :src="
                                                            'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +
                                                            getCardType +
                                                            '.png'
                                                        "
                                                        v-if="getCardType"
                                                        :key="getCardType"
                                                        width="100%"
                                                        max-width="100px"
                                                        height="45px"
                                                        max-height="100%"
                                                        contain
                                                    />
                                                </transition>
                                            </v-col>
                                            <v-col cols="12">
                                                <label
                                                    for="cardNumber"
                                                    class="card-number white--text mb-md-8 mb-sm-4 py-2 px-md-4 px-2 font-weight-medium d-inline-block"
                                                    ref="cardNumber"
                                                >
                                                    <transition-group name="slide-fade-up">
                                                        <span
                                                            v-for="(value, index) in cardNumberArray"
                                                            :key="value + index"
                                                            class="card-number-item d-inline-block"
                                                        >
                                                            {{ value }}
                                                        </span>
                                                    </transition-group>
                                                </label>
                                            </v-col>
                                            <v-col class="d-flex justify-space-between white--text">
                                                <label
                                                    for="CardHolder"
                                                    class="card-holder pa-md-0 pb-2 px-4 font-weight-medium fill-width"
                                                    ref="CardHolder"
                                                >
                                                    <div class="card-holder-title white--text mb-1">Card Holder</div>
                                                    <transition name="slide-fade-up">
                                                        <!-- key="1": 讓transition識別 -->
                                                        <div
                                                            class="text-uppercase text-truncate"
                                                            v-if="paymentInfo.CardHolder.length"
                                                            key="1"
                                                        >
                                                            <transition-group name="slide-fade">
                                                                <!--正則切掉空白，transition-group裡key不可綁index-->
                                                                <span
                                                                    v-for="(value, index) in paymentInfo.CardHolder.replace(
                                                                        /\s\s+/g,
                                                                        ' '
                                                                    )"
                                                                    :key="value + index"
                                                                    >{{ value }}</span
                                                                >
                                                            </transition-group>
                                                        </div>
                                                        <div class="text-uppercase text-truncate" v-else key="2">Full Name</div>
                                                    </transition>
                                                </label>
                                                <div class="card-date d-inline-flex flex-wrap" ref="cardDate">
                                                    <span class="card-date-title fill-width">Expires</span>
                                                    <label for="Month">
                                                        <transition name="slide-fade-up">
                                                            <span v-if="paymentInfo.Month" :key="paymentInfo.Month">{{
                                                                paymentInfo.Month.toString().padStart(2, '0')
                                                            }}</span>
                                                            <span v-else key="2">MM</span>
                                                        </transition>
                                                    </label>
                                                    /
                                                    <label for="Year" class="card-date-item">
                                                        <transition name="slide-fade-up">
                                                            <span v-if="paymentInfo.Year" :key="paymentInfo.Year">
                                                                {{ paymentInfo.Year }}
                                                            </span>
                                                            <span v-else key="2">YY</span>
                                                        </transition>
                                                    </label>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                                <!-- 卡片背面開始 -->
                                <div class="card-side back">
                                    <div class="card-background-wrapper" style="z-index: 1">
                                        <v-img
                                            v-bind:src="
                                                'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +
                                                currentCardBackground +
                                                '.jpeg'
                                            "
                                            contain
                                        >
                                            <v-row
                                                no-gutters
                                                class="fill-height rotate-y-180"
                                                style="position: relative; z-index: 1"
                                            >
                                                <v-col cols="12" class="mt-7 black card-band"></v-col>
                                                <v-col cols="12" class="text-right mt-4 pr-4 white--text"><span>CVV</span></v-col>
                                                <v-col
                                                    cols="11"
                                                    class="mt-1 mb-3 mb-md-7 mx-auto white rounded text-right pr-1 card-band"
                                                    style="line-height: 3"
                                                    ><span v-for="(value, index) in paymentInfo.Ccv" :key="index">*</span></v-col
                                                >
                                                <v-col cols="12" class="d-flex justify-end fill-height"
                                                    ><v-img
                                                        :src="
                                                            'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +
                                                            getCardType +
                                                            '.png'
                                                        "
                                                        v-if="getCardType"
                                                        v-bind:key="getCardType"
                                                        width="100%"
                                                        max-width="100px"
                                                        height="45px"
                                                        max-height="100%"
                                                        contain
                                                /></v-col>
                                            </v-row>
                                        </v-img>
                                    </div>
                                </div>
                            </v-card>
                        </div>
                        <v-card class="pa-2"
                            ><v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        label="Card number"
                                        v-model="paymentInfo.CardNumber"
                                        filled
                                        required
                                        maxlength="16"
                                        :rules="[rules.atLeastLength(16), rules.CreditCardRestraint]"
                                        @focus="focusInput"
                                        @blur="blurInput"
                                        id="cardNumber"
                                        data-ref="cardNumber"
                                    >
                                        <template v-slot:prepend-inner>
                                            <transition name="slide-fade-up">
                                                <component :is="getCardType" class="iconWrap"></component>
                                            </transition>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        label="Card holder"
                                        v-model="paymentInfo.CardHolder"
                                        filled
                                        required
                                        :rules="[rules.required]"
                                        @focus="focusInput"
                                        @blur="blurInput"
                                        id="CardHolder"
                                        data-ref="CardHolder"
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <v-select
                                        label="Year"
                                        v-model="paymentInfo.Year"
                                        :items="years"
                                        filled
                                        :rules="[rules.required]"
                                        @focus="focusInput"
                                        @blur="blurInput"
                                        id="Year"
                                        data-ref="cardDate"
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <v-select
                                        label="Month"
                                        v-model="paymentInfo.Month"
                                        :items="months"
                                        filled
                                        :rules="[rules.required]"
                                        @focus="focusInput"
                                        @blur="blurInput"
                                        id="Month"
                                        data-ref="cardDate"
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <!-- 只能輸入數字的字串，不要type=數字的樣式 -->
                                    <v-text-field
                                        label="cvv"
                                        v-model="paymentInfo.Ccv"
                                        filled
                                        :rules="[rules.atLeastLength(3), rules.numberRule]"
                                        maxlength="3"
                                        @focus="flipCard(true)"
                                        @blur="flipCard(false)"
                                    />
                                </v-col>
                            </v-row>
                            <v-card-actions class="justify-center">
                                <v-btn @click="checkOut">送出訂單</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>
        </snackbar>
    </v-container>
</template>

<script>
import { rules } from '../utils/validationRules'
import jcb from '../components/IconJcb.vue'
import visa from '../components/IconVisa.vue'
import mastercard from '../components/IconMastercard.vue'
import CartList from '../components/CartList.vue'
import Snackbar from '../components/Snackbar.vue'

export default {
    components: {
        jcb,
        visa,
        mastercard,
        CartList,
        Snackbar,
    },
    data: () => ({
        cartArray: [],
        rules,
        orderList: {
            FirstName: '',
            LastName: '',
            Email: '',
            country: '',
            zip: '',
            address1: '',
            address2: '',
        },
        paymentInfo: {
            CreditCardBank: '',
            CardNumber: '',
            CardHolder: '',
            Year: 0,
            Month: 0,
            Ccv: '',
        },
        currentCardBackground: Math.floor(Math.random() * 25 + 1),
        cardNumberArray: [],
        isCardFlipped: false,
        isInputFocused: false,
        focusElementStyle: null,
    }),
    created() {
        this.cartArray = JSON.parse(localStorage.getItem('TRAIN-cart')) || []
    },
    computed: {
        total() {
            return this.cartArray.reduce((total, product) => {
                total += product.count * product.price
                return total
            }, 0)
        },
        years() {
            const currentYear = parseInt(new Date().getFullYear().toString().slice(-2)) //擷取年的後兩位數
            return Array.from({ length: 21 }, (value, index) => currentYear - 10 + index)
        },
        months() {
            return Array.from({ length: 12 }, (value, index) => index + 1)
        },
        getCardType() {
            let number = this.paymentInfo.CardNumber
            let re = new RegExp('^4')
            if (number.match(re) != null) return 'visa'

            re = new RegExp('^5[1-5]')
            if (number.match(re) != null) return 'mastercard'

            re = new RegExp('^(3528|3529|35[3-8][0-9])')
            if (number.match(re) != null) return 'jcb'

            return ''
        },
        height() {
            switch (this.$vuetify.breakpoint.name) {
                case 'sm':
                    return 360
                case 'md':
                    return 480
            }
        },
    },
    methods: {
        checkOut() {
            const isForm1Valid = this.$refs.form1.validate()
            const isForm2Valid = this.$refs.form2.validate()

            if (isForm1Valid && isForm2Valid) {
                const timeStamp = Date.now()
                this.orderList.cardNumber = this.paymentInfo.CardNumber.slice(-4)

                const userID = this.$root.selectedRole
                const allUser = JSON.parse(localStorage.getItem('TRAIN-cart')) || {}
                if (allUser) {
                    const cartItems = allUser[userID].cart
                    const orderList = this.orderList
                    const history = allUser[userID].history
                    history.push({ timeStamp, orderList, cartItems })
                    allUser[userID].history = history
                    allUser[userID].cart = []
                    localStorage.setItem('TRAIN-cart', JSON.stringify(allUser))
                    showMessage('訂單完成，請查詢歷史頁面', 'success')
                    setTimeout(() => {
                        this.$router.push({
                            name: 'OrderCompelet',
                            params: {
                                orderList: this.orderList,
                            },
                        })
                    }, 3500)
                } else {
                    throw new Error('購物車錯誤需重新操作')
                }
            }
        },
        flipCard(status) {
            this.isCardFlipped = status
        },
        focusInput(e) {
            this.isInputFocused = true
            let targetRef = e.target.dataset.ref
            let target = this.$refs[targetRef] //取得有ref的dom元素含邊界的寬高
            console.log(targetRef, target)
            this.focusElementStyle = {
                width: `${target.offsetWidth}px`,
                height: `${target.offsetHeight}px`,
                transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
                border: `2px solid rgba(255, 255, 255, 0.65)`,
                background: 'rgba(6, 2, 29, 0.45)',
            }
        },
        blurInput() {
            setTimeout(() => {
                if (!this.isInputFocused) {
                    this.focusElementStyle = null
                }
            }, 300)
            this.isInputFocused = false
        },
    },
    watch: {
        cardYear() {
            if (this.cardMonth < this.minCardMonth) {
                this.cardMonth = ''
            }
        },
        'paymentInfo.CardNumber': {
            immediate: true,
            handler(newValue) {
                let cardNumberString = newValue.replace(/\D/g, '')
                let array = cardNumberString.padEnd(16, '#').split('')
                array = array
                    .join('')
                    .replace(/(.{4})/g, '$1 ')
                    .split('')
                this.cardNumberArray = array
            },
        },
    },
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:400,500,600,700|Source+Sans+Pro:400,600,700&display=swap');

.iconWrap {
    width: 40px;
    height: auto;
}

/*信用卡寬高start*/
.card-side {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 10px 0 rgba(14, 42, 90, 0.55);
    transform: perspective(2000px) rotateY(0deg);
    transform-style: preserve-3d;
    transition: all 0.8s cubic-bezier(0.71, 0.03, 0.56, 0.85);
    backface-visibility: hidden;
    height: 100%;
}

.card-item {
    max-width: 430px;
    height: 270px;
    z-index: 2;
}

@media (max-width: 480px) {
    .card-item {
        max-width: 310px;
        height: 220px;
        width: 90%;
    }
}

@media (max-width: 360px) {
    .card-item {
        height: 180px;
    }
}
/*信用卡寬高end*/
/**點擊框線 START */
.card-item-focus {
    position: absolute;
    z-index: 3;
    border-radius: 5px;
    width: 100%;
    transition: all 0.35s;
    pointer-events: none;
    overflow: hidden;
}

.card-item-focus:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    opacity: 0.5;
}
/**點擊框線 END */
/**正面內容start*/
.card-front-wrapper {
    font-family: 'Source Code Pro', monospace;
    z-index: 4;
    text-shadow: 7px 6px 10px rgba(14, 42, 90, 0.8);
    user-select: none;
}
/**上方圖案start */
.card-left-img {
    width: 60px;
}

@media (max-width: 480px) {
    .card-left-img {
        width: 50px;
    }

    .card-type-img {
        height: 40px;
        max-width: 90px;
    }
}

@media (max-width: 360px) {
    .card-left-img {
        width: 40px;
    }

    .card-type-img {
        height: 30px;
    }
}

/**上方圖案end */
/**信用卡號start */
.card-number {
    line-height: 1;
    font-size: 27px;
    cursor: pointer;
}

@media (max-width: 480px) {
    .card-number {
        font-size: 21px;
    }
}

@media (max-width: 360px) {
    .card-number {
        font-size: 19px;
    }
}

.card-number-item {
    width: 16px;
}

@media (max-width: 480px) {
    .card-number-item {
        width: 13px;
    }
}

@media (max-width: 360px) {
    .card-number-item {
        width: 12px;
    }
}
/**信用卡號end */
/**持卡人start */
.card-holder {
    max-width: calc(100% - 85px);
    cursor: pointer;
}

.card-holder-title {
    opacity: 0.7; /**text--secondary 後面放 white--text 無法變白  */
    font-size: 13px;
}
/**持卡人end */
/**日期start */
.card-date {
    font-size: 18px;
    width: 80px;
    cursor: pointer;
}

@media (max-width: 480px) {
    .card-date {
        font-size: 16px;
    }
}

.card-date-title {
    opacity: 0.7;
    font-size: 13px;
}

@media (max-width: 480px) {
    .card-date-title {
        font-size: 12px;
    }
}

.card-date-item span {
    width: 22px;
}
/**日期end、正面內容end */
/**卡片背面 start */
.back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: perspective(2000px) rotateY(-180deg);
    z-index: 2;
    padding: 0;
    border-radius: 15px !important; /**壓過v-card內建 */
}

.back .card-background-wrapper {
    transform: rotateY(-180deg); /**卡背圖案顛倒 */
}

.rotate-y-180 {
    transform: perspective(1000px) rotateY(180deg); /**顛倒後卡背文字轉正 */
}

.card-background-wrapper {
    /**避免正背面寬高有差 */
    height: 100%;
    position: absolute; /**顯示內容 */
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
}

.card-band {
    height: 50px; /**卡背黑色及白色橫條 */
}

@media (max-width: 480px) {
    .card-band {
        height: 40px;
    }
}
@media (max-width: 360px) {
    .card-band {
        height: 30px;
    }
}
/**卡片背面 end */

/**滑動特效start */
.slide-fade-up-enter-active,
.slide-fade-enter-active {
    transition: all 0.25s ease-in-out;
}

.slide-fade-up-leave-active,
.slide-fade-leave-active {
    transition: all 0.25s ease-in-out;
    position: absolute;
}

.slide-fade-up-enter {
    opacity: 0;
    transform: translateY(15px);
}

.slide-fade-up-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}

.slide-fade-enter {
    opacity: 0;
    transform: translateX(15px) rotate(45deg);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-15px) rotate(45deg);
}
/**卡片旋轉動畫 perspective:3維往左上角移動，動畫比較立體 isCardFlipped為false時觸發*/
.card-item.-active .card-side.front {
    transform: perspective(1000px) rotateY(180deg);
}

.card-item.-active .card-side.back {
    transform: perspective(1000px) rotateY(0);
}
/**滑動特效end */
</style>
