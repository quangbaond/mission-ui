<script setup lang="ts">
import logo from '@images/logo.svg?raw';
import { inject } from 'vue';
import { useStore } from 'vuex';
const swal = inject('$swal')
const store = useStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  ref: null as any,
})

const formRef = ref(null as any)

const router = useRouter()

const query = computed(() => router.currentRoute.value.query.ref)

const loading = computed(() => store.state.loading)


const register = async () => {
  const isValid = await formRef.value.validate()

  form.value.ref = query.value

  if (isValid.valid) {
    const response = await store.dispatch('userStore/register', form.value)

    const { status, data, message } = response

    if(status) {
      swal({
        title: 'Register Success',
        text: message,
        icon: 'success',
        timer: 2000,
      })

      return router.push({ name: 'login' })
    }

    swal({
      title: 'Register Failed',
      text: message,
      icon: 'error',
      timer: 3000,
    })


  }
}

const isPasswordVisible = ref(false)
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
          Kiem lua
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">
          Đăng ký
        </h5>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="register"  ref="formRef">
          <VRow>
            <!-- Username -->
            <VCol cols="12">
              <VTextField
                v-model="form.name"
                label="Họ tên"
                :rules="[
                  (v) => !!v || 'Name is required',
                ]"
                placeholder="Nguyễn Văn A"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                label="Email"
                placeholder="nguyenvana@email.com"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <div class="d-flex align-center my-4">
                <VBtn
                block
                type="submit"
                :loading="loading"
              >
                Đăng ký
              </VBtn>
              </div>


            </VCol>

            <!-- login instead -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Bạn đã có tài khoản?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/login"
              >
                Đăng nhập
              </RouterLink>
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <!-- <AuthProvider /> -->
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
