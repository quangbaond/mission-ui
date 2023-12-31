<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { removeStorage, setStorage } from '@/@common'
import { PROFILE_KEY, TOKEN_KEY } from '@/@common/constants'
import logo from '@images/logo.svg?raw'

const swal = inject('$swal')
const store = useStore()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const formRef = ref(null as any)

const isPasswordVisible = ref(false)

const router = useRouter()
const loading = computed(() => store.state.loading)

const submitForm = async () => {
  const isValid = await formRef.value.validate()

  console.log(isValid)

  if (isValid.valid) {
    console.log(form.value)

    const response = await store.dispatch('userStore/login', form.value)

    console.log('response', response)

    const { status, data, message } = response

    if (status) {
      setStorage(PROFILE_KEY, data.data)
      setStorage(TOKEN_KEY, data.data.jwt)
      swal({
        title: 'Đăng nhập thành công!',
        text: message,
        icon: 'success',
        timer: 2000,
      })

      // how to use router global
      router.push({ name: 'tasks' })

      return
    }

    swal({
      title: 'Đăng nhập thất bại!',
      text: message,
      icon: 'error',
      timer: 2000,
    })
  }
}

onMounted(() => {
  removeStorage(PROFILE_KEY)
  removeStorage(TOKEN_KEY)
})
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div
              class="d-flex text-primary"
              v-html="logo"
            />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          Kiếm lúa
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Welcome to Kiếm lúa 👋🏻
        </h5>
      </VCardText>

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="submitForm"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                autofocus
                placeholder="johndoe@email.com"
                label="Email"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                :rules="[
                  (v) => !!v || 'Password is required',
                ]"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="form.remember"
                  label="Remember me"
                />

                <!--
                  <RouterLink
                  class="text-primary ms-2 mb-1"
                  to="javascript:void(0)"
                  >
                  Forgot Password?
                  </RouterLink>
                -->
              </div>

              <!-- login button -->
              <VBtn
                block
                type="submit"
                :loading="loading"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Bạn chưa có tài khoản?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                Đăng ký tại đây.
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<style lang="scss">
.v-btn__loader .text-primary{
  color: white !important;
}
</style>
