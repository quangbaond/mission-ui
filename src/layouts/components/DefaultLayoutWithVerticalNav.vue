<script lang="ts" setup>
import { useTheme } from 'vuetify'

import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { useStore } from 'vuex'

// Banner
const store = useStore()

const vuetifyTheme = useTheme()

const profile = computed(() => store.state.userStore.profile)


const getProfile = async () => {
  const res = store.dispatch('userStore/getProfile')


  console.log('res', res);
}

onMounted(() => {
  getProfile()
})


</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none;"
        >
          <!-- 👉 Search Trigger button -->
          <IconBtn>
            <VIcon icon="mdi-currency-usd" />
          </IconBtn>

          <span class="d-none d-md-flex align-center">
            <span class="me-3">Số dư khả dụng</span>
            <span class="meta-key">
              {{profile.balance}} $
            </span>
          </span>
        </div>

        <VSpacer />

        <!-- <IconBtn
          class="me-2"
          href="https://github.com/themeselection/sneat-vuetify-vuejs-admin-template-free"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="bxl-github" />
        </IconBtn>

        <IconBtn class="me-2">
          <VIcon icon="bx-bell" />
        </IconBtn> -->

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <!-- <VerticalNavLink
        :item="{
          title: 'Trang tổng quan',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      /> -->
      <VerticalNavLink
        :item="{
          title: 'Làm nhiệm vụ',
          icon: 'mdi-account-cog-outline',
          to: '/tasks',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Rút tiền',
          icon: 'mdi-currency-usd',
          to: '/withdraw',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Giới thiệu',
          icon: 'mdi-account-group-outline',
          to: '/introduce',
        }"
      />


      <!-- <VerticalNavLink
        :item="{
          title: '',
          icon: 'mdi-currency-usd',
          to: '/withdraw',
        }"
      /> -->

    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
<style lang="scss">
.v-btn__loader .text-primary{
  color: white !important;
}
</style>
