<template>
    <div class="text-center ma-2">
        <v-snackbar timeout="4000" :color="color" v-model="snackbar">
            {{ message }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">關閉</v-btn>
            </template>
        </v-snackbar>
        <slot v-bind="{ showMessage: show }" />
    </div>
</template>

<script>
export default {
    data: () => ({
        snackbar: false,
        message: '',
        color: '',
    }),
    methods: {
        show(message, color = '') {
            this.message = message
            this.color = color
            this.snackbar = true
        },
    },
}
</script>
