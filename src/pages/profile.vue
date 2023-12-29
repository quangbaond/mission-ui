<script setup lang="ts">
// import firebase from 'firebase/compat/app';
import { auth } from '@/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const loading = computed(() => store.state.loading)
const navActive = ref(1)

const profile = computed(() => store.state.userStore.profile)

const navs = [
    {
        title: 'Thông tin cơ bản',
        icon: 'mdi-account',
        link: '/profile',
        id: 1
    },
    {
        title: 'Đổi mật khẩu',
        icon: 'mdi-lock',
        link: '/profile/change-password',
        id: 2
    },
    {
        title: 'Xác thực số điện thoại',
        icon: 'mdi-cellphone',
        link: '/logout',
        id: 3
    }
]

const formBasicRef = ref(null as any)
const formPasswordRef = ref(null as any)
const formPhoneRef = ref(null as any)
const isPasswordVisible = ref(false)
const isPasswordOldVisible = ref(false)
const isPasswordConfirmVisible = ref(false)

const otp = ref('')
const verify = ref(false)

const appVerifier = ref(null as any)
const confirmationResult = ref(null as any)

const sendOtp = () => {
    store.commit('setLoading', true)
    //validate phone number
    const phoneNumber = profile.value.phone
    const appVerifierValue = appVerifier.value
    signInWithPhoneNumber(auth, phoneNumber, appVerifierValue)
        .then((confirmation: any) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            confirmationResult.value = confirmation;
            store.commit('setLoading', false)
            swal({
                title: 'Thành công',
                text: 'Mã OTP đã được gửi đến số điện thoại của bạn',
                icon: 'success',
                button: 'Đóng'
            })
        }).catch((error: any) => {
            store.commit('setLoading', false)

            swal({
                title: 'Thất bại',
                text: 'Gửi mã OTP thất bại',
                icon: 'error',
                button: 'Đóng'
            })
        });
}

const verifyOtp = () => {
    store.commit('setLoading', false)
    const code = otp.value
    if(!confirmationResult || !confirmationResult.value) {
        swal({
            title: 'Thất bại',
            text: 'Vui lòng lấy mã OTP trước',
            icon: 'error',
            button: 'Đóng'
        })
        return
    }
    confirmationResult.value.confirm(code).then((result: any) => {
        submitFormPhone()
    }).catch((error: any) => {
        store.commit('setLoading', false)
        swal({
            title: 'Thất bại',
            text: 'Mã OTP không hợp lệ',
            icon: 'error',
            button: 'Đóng'
        })
    });

}

const initRecaptcha = () => {
    setTimeout(()=>{
        appVerifier.value = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': (response: any) => {
                console.log('response', response);
            },
            'expired-callback': () => {
                console.log('expired-callback');
                verify.value = false
            }
        })
    }, 1000)
}

watch(navActive, (newVal) => {
    if (newVal === 3) {
        initRecaptcha()
    }
})


const swal = inject('$swal')

const submitFormBasic = async () => {
    const isValid = await formBasicRef.value.validate()

    if (isValid.valid) {
        const res = await store.dispatch('userStore/updateProfile', profile.value)

        const { status, result, message } = res.data

        if (status) {
            swal({
                title: 'Thành công',
                text: message,
                icon: 'success',
                button: 'Đóng'
            })
        }

    }
}

const submitFormPassword = async () => {
    const isValid = await formPasswordRef.value.validate()

    if (isValid.valid) {
        const res = await store.dispatch('userStore/updateProfile', profile.value)

        const { status, result, message } = res

        console.log('res', message);


        if (status) {
            swal({
                title: 'Thành công',
                text: message,
                icon: 'success',
                button: 'Đóng'
            })
            return
        }
        swal({
            title: 'Thất bại',
            text: message || 'Cập nhật không thành công!',
            icon: 'error',
            button: 'Đóng'
        })
    }
}

const submitFormPhone = async () => {
    const isValid = await formPhoneRef.value.validate()

    if (isValid.valid) {
        const res = await store.dispatch('userStore/updateProfile', profile.value)

        const { status, result, message } = res

        if (status) {
            swal({
                title: 'Thành công',
                text: message,
                icon: 'success',
                button: 'Đóng'
            })
        }
    }
}

</script>

<template>
        <v-row>
            <v-col md="4">
                <v-card>
                    <v-list-item link :class="{'active' : navActive == nav.id}" v-for="nav in navs" :key="nav.id" @click="() => {navActive = nav.id}">
                        <v-list-item-icon>
                            <v-icon>{{ nav.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="ml-2">
                            <v-list-item-title>{{ nav.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col md="8">
                <v-card title="Thông tin cơ bản" v-if="navActive === 1">
                    <v-form ref="formBasicRef" @submit.prevent="submitFormBasic">
                        <v-card-text>
                            <v-row class="me-3">
                                <v-col md="6">
                                    <v-text-field density="compact" label="Họ và tên" v-model="profile.name"
                                    :rules="[v => !!v || 'Vui lòng nhập họ và tên']"
                                >
                                </v-text-field>
                                </v-col>
                                <v-col md="6">
                                    <v-text-field density="compact" label="Email" v-model="profile.email"
                                    :rules="[v => !!v || 'Vui lòng nhập email', v => /.+@.+\..+/.test(v) || 'Email không hợp lệ']"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="me-3">
                                <v-col md="6">
                                    <v-text-field density="compact" label="Số điện thoại" v-model="profile.phone" readonly></v-text-field>
                                </v-col>
                                <v-col md="6">
                                    <v-text-field density="compact" label="Địa chỉ" v-model="profile.address"
                                    :rules="[v => !!v || 'Vui lòng nhập địa chỉ']"
                                    >
                                </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col md="12">
                                    <v-btn style="width: 100%" color="primary" type="submit" :loading="loading">Cập nhật</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-form>
                </v-card>
                <v-card title="Đặt lại mật khẩu" v-if="navActive === 2">
                    <v-form ref="formPasswordRef" @submit.prevent="submitFormPassword">
                        <v-card-text>
                            <v-row class="me-3">
                                <v-col md="12">
                                    <v-text-field density="compact" label="Mật khẩu hiện tại" v-model="profile.password_old"
                                    :rules="[v => !!v || 'Vui lòng nhập mật khẩu hiện tại']"
                                    :type="isPasswordOldVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordOldVisible ? 'bx-hide' : 'bx-show'"
                                    @click:append-inner="isPasswordOldVisible = !isPasswordOldVisible"
                                    >

                                    </v-text-field>
                                </v-col>
                                <v-col md="12">
                                    <v-text-field density="compact" label="Mật khẩu mới" v-model="profile.password"
                                    :rules="[v => !!v || 'Vui lòng nhập mật khẩu mới']"
                                    :type="isPasswordVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                                    @click:append-inner="isPasswordVisible = !isPasswordVisible"

                                    ></v-text-field>
                                </v-col>
                                <v-col md="12">
                                    <v-text-field density="compact" label="Xác nhận lại mật khẩu" v-model="profile.password_confirmation"
                                    :rules="[v => !!v || 'Vui lòng nhập xác nhận mật khẩu', v => v === profile.password || 'Mật khẩu không khớp']"
                                    :type="isPasswordConfirmVisible ? 'text' : 'password'"
                                    :append-inner-icon="isPasswordConfirmVisible ? 'bx-hide' : 'bx-show'"
                                    @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col md="12">
                                    <v-btn style="width: 100%" color="primary" type="submit" :loading="loading">Cập nhật</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-form>
                </v-card>
                <v-card title="Xác thực số điện thoại" v-if="navActive === 3">
                    <v-form ref="formPhoneRef" @submit.prevent="submitFormPhone">
                        <v-card-text>
                            <v-row>
                                <v-col md="10" sm="12" cols="12">
                                    <v-text-field density="compact" label="Số điện thoại" v-model="profile.phone" placeholder="+840389228486"
                                    :rules="[v => !!v || 'Vui lòng nhập số điện thoại',  v => v[0] === '+' || 'Số điện thoại không hợp lệ', v => v.length === 13 || 'Số điện thoại không hợp lệ']"
                                    ></v-text-field>
                                </v-col>
                                <v-col auto>
                                    <v-btn style="width: 100%" @click="sendOtp" :loading="loading">Lấy mã</v-btn>
                                </v-col>
                                <v-col md="12" sm="12" cols="12">
                                    <div id="recaptcha-container"></div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col md="12">
                                    <v-text-field density="compact" label="Mã OTP" v-model="otp"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col md="12">
                                    <v-btn style="width: 100%" color="primary" @click="verifyOtp" :loading="loading">Cập nhật</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
</template>
<style>
    .active {
        background-color: #7367f0 !important;
        color: white !important;
    }
    .v-list-item__content {
        display: flex;
    }
    .v-list-item {
        border-radius: 10px;
        margin-bottom: 10px;
        margin: 10px;
    }
</style>
