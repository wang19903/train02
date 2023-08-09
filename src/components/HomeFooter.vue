<template>
    <div>
        <v-footer color="primary" :padless="padless">
            <v-card class="flex" flat tile>
                <v-row class="primary">
                    <v-col>
                        <v-list dense color="primary">
                            <v-list-item-group>
                                <v-list-item v-for="(item, index) in content" :key="index">
                                    <v-list-item-title class="text-body1" style="line-height: normal">
                                        <a :href="item.path" target="_blank" class="white--text">{{ item.title }}</a>
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-col>
                    <v-btn v-for="icon in icons" :key="icon" class="mx-4" dark icon>
                        <v-icon size="24px">
                            {{ icon }}
                        </v-icon>
                    </v-btn>
                </v-row>
                <v-card-text class="primary lighten-2 py-4 text-center white--text" cols="12">
                    {{ new Date().getFullYear() }} — <strong>©All rights reserved</strong>
                </v-card-text>
            </v-card>
        </v-footer>
        <transition name="slide">
            <div v-show="!userAgreed" class="cookie text-center text-body-1 font-weight-bold">
                <p>點擊下方的 "同意" 來改善您的體驗。表示您同意我們下方的cookies收集政策。</p>
                <v-btn @click="agree" elevation="2">同意</v-btn>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data: () => ({
        padless: true,
        userAgreed: false,
        icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'],
        content: [
            { title: '客戶隱私權政策', path: 'https://www.webguide.nat.gov.tw/cp.aspx?n=554' },
            { title: '客戶權利義務', path: 'https://www.ey.gov.tw/Page/AABD2F12D8A6D561/0e0572f1-7e0f-460e-bd03-3e11f89d3466' },
            { title: '防詐騙宣傳', path: 'https://165.npa.gov.tw/#/' },
            { title: 'Q&A', path: 'https://www.amazon.in/ask/guidelines/qa/' },
            { title: '國內與國外配送', path: 'https://www.post.gov.tw/post/internet/SearchZone/index.jsp?ID=1396157311807' },
        ],
    }),
    created() {
        this.userAgreed = localStorage.getItem('TRAIN-userAgree')
    },
    methods: {
        agree() {
            localStorage.setItem('TRAIN-userAgree', 'true')
            this.userAgreed = true
        },
    },
}
</script>


<style scoped>
.cookie {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #1976d2;
    padding: 15px;
}

.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.slide-leave-active {
    transition: transform 0.5s;
}

.slide-leave-to {
    transform: translateY(100%);
}
@media screen and (max-width: 600px) {
    .container {
        grid-template-columns: 1fr;
    }
}
</style>
