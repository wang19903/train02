<template>
    <div ref="container" id="container">
        <div
            class="triangle-wrap"
            v-for="(triangle, index) in triangles"
            :key="'triangle-' + index"
            :style="{
                left: triangle.position + '%',
                animation: `rise ${triangle.speed}s infinite linear, spin ${triangle.speed}s infinite linear`,
            }"
        >
            <div
                class="triangle"
                :style="{
                    '--size': triangle.size + 'px',
                    backgroundColor: triangle.color,
                }"
            />
        </div>

        <div
            v-for="(diamond, index) in diamonds"
            :key="'diamond-' + index"
            class="diamond"
            :style="{
                backgroundColor: diamond.color,
                width: diamond.size + 'px',
                height: diamond.size + 'px',
                left: diamond.position + '%',
                animation: `rise ${diamond.speed}s infinite linear, spin ${diamond.speed}s infinite linear`,
            }"
        />

        <div
            v-for="(dot, index) in dots"
            :key="index"
            class="dot"
            :style="{
                width: dot.size + 'px',
                height: dot.size + 'px',
                left: dot.position + '%',
                animation: `rise ${dot.speed}s infinite linear`,
            }"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            triangles: [],
            diamonds: [],
            dots: [],
            colors: ['#fffdf0', '#f8f9fe', '#fffcf3', '#fbfbfb', '#fefbea', '#f9fafe', '#fbfaff'],
        }
    },
    mounted() {
        this.createShapes('triangles', 7, 100, 150, 10)
        this.createShapes('diamonds', 7, 50, 100, 10)
        this.createShapes('dots', 21, 10, 10, 10)
    },
    methods: {
        createShapes(type, numShapes, minSize, maxSize, speedRange) {
            for (let i = 0; i < numShapes; i++) {
                const size = Math.random() * (maxSize - minSize) + minSize
                const color = this.colors[Math.floor(Math.random() * this.colors.length)]
                const position = Math.random() * 100
                const speed = Math.random() * speedRange + 10
                this[type].push({ size, color, position, speed })
            }
        },
    },
}
</script>

<style>
#container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
}

#container div {
    position: absolute;
}

.triangle-wrap {
    --size: 0;
    width: 100px;
    height: 100px;
}

.triangle {
    --size: 1; /*預設用*/
}

.triangle:before,
.triangle:after {
    content: '';
    position: absolute;
    background-color: inherit;
}

.triangle,
.triangle:before,
.triangle:after {
    width: var(--size);
    height: var(--size);
    border-top-right-radius: 30%;
}

.triangle {
    transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866);
}

.triangle:before {
    transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707) translate(0, -50%);
}

.triangle:after {
    transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
}

.diamond {
    clip-path: polygon(50% 0%, 0% 50%, 50% 100%, 100% 50%);
    border-radius: 30px;
}

.dot {
    border-radius: 50%;
    background: #ededed;
}

@keyframes spin {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes rise {
    0% {
        bottom: 0;
    }
    100% {
        bottom: 120%; /*完全遮蔽*/
    }
}
</style>


