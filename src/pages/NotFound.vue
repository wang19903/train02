<template>
    <v-container fluid class="wrap">
        <div class="err">404</div>
        <v-btn to="/shop" class="home-btn">返回首頁</v-btn>
    </v-container>
</template>
<script>
export default {}
</script>

<style>
.wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #202124;
    color: #f1f3f4;
    font-size: 96px;
}

.home-btn {
    transform: translate(-50%, -50%);
    top: 55%;
    left: 50%;
    animation: easy-in 2s;
}

.err {
    position: absolute;
    transform: translate(-50%, -50%) skew(10deg);
    top: 50%;
    left: 50%;
    animation: easy-in 2s, glitch 1s 2s infinite;
}

@keyframes glitch {
    0% {
        left: 51%;
    }
    100% {
        left: 50%;
    }
}

@keyframes easy-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.err:before,
.err:after {
    content: '404';
    position: absolute;
}

.err:before {
    animation: glitch-top 1s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    animation-delay: 2s;
}

@keyframes glitch-top {
    0% {
        left: 2%;
        top: -2%;
    }
}

.err:after {
    animation: glitch-bottom 1s infinite;
    clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%);
    left: 0;
    animation-delay: 2s;
}

@keyframes glitch-bottom {
    100% {
        left: -2%;
        top: 2%;
    }
}
</style>
