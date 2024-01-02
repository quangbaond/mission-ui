<script setup lang="ts">
import { GET, POST } from '@/service'
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'
import moment from 'moment'
import { inject } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const profile = computed(() => store.state.userStore.profile)

const missionAvailable = ref(0 as number)

const missionList = ref([] as any[])

const showMissionSortLink = ref(true)

const iconShowMissionSortLink = ref('mdi-arrow-up')

const swal = inject('$swal')

const getMissions = async () => {
  const res = await GET('/v1/missions')
  const { status, result, message } = res.data

  missionAvailable.value = result?.countMissionAvailable

  const missionListData = result?.missionList?.map((item: any) => {
    const userMission = item?.user_mission?.findLast(
      (userMission: any) => userMission.mission_id == item.id,
    )

    const start = moment()
    const end = moment(userMission?.created_at).add(import.meta.env.VITE_MINUTES_WAINTING, 'minutes')

    const remainingMinutes = end.diff(start, 'minutes')

    return {
      ...item,
      disabled: userMission ? remainingMinutes > 0 : false,
      countdown: userMission && remainingMinutes > 0 ? remainingMinutes : 0,
    }
  })

  console.log(missionListData)

  missionList.value = missionListData.filter((item: any) => item.type == 0)
}

const startCountdown = (item: any) => {
  console.log('item', item)
  item.countdown = item.countdown * 60

  const intervalId = setInterval(() => {
    if (item.countdown > 0) {
      item.countdown--
    }
    else {
      clearInterval(intervalId)
      item.disabled = false
    }
  }, 1000)
}

watch(missionList, newVal => {
  newVal.forEach(item => {
    if (item.countdown === 0) {
      // Perform the task when the countdown ends
      // doTask(item.id);
    }
    else {
      // Start the countdown
      startCountdown(item)
    }
  })
})

const doTask = async (id: number, keywork: string) => {
  const res = await POST('/v1/missions/do-task', {
    mission_id: id,
  })

  const { status, result, message } = res.data
  if (status) {
    // call mutation to update profile
    store.dispatch('userStore/getProfile')
    getMissions()
    swal({
      title: 'Thành công',
      text: 'Link rút gọn đã được tạo, bạn có thể copy link và dán vào trình duyệt để làm nhiệm vụ',
      input: 'text',
      inputValue: keywork,
      inputAttributes: {
        autocapitalize: 'off',
        readonly: true,
      },
      icon: 'success',
      confirmButtonText: 'Copy',
      showCancelButton: true,
      cancelButtonText: 'Đóng',
      showLoaderOnConfirm: true,
      preConfirm: (value: string) => {
        copyToClipboard(value)
      },
    }).then((value: string) => {
      switch (value) {
      case 'copy':
        copyToClipboard(keywork)
          break
        default:
        break
      }
    })

    return

    // navigateTo(url);
  }

  swal({
    title: 'Thất bại',
    text: message,
    icon: 'error',
    confirmButtonText: 'Đóng',
    timer: 2000,
  })
}

const copyToClipboard = (text: string) => {
  const input = document.createElement('input')

  input.setAttribute('value', text)
  document.body.appendChild(input)
  input.select()

  const result = document.execCommand('copy')

  document.body.removeChild(input)

  return result
}

const navigateTo = (url: string) => {
  // create a new anchor element
  const a = document.createElement('a')

  // set the href and rel
  a.href = url
  a.rel = 'noopener noreferrer'

  // opens the url in a new window
  a.target = '_blank'

  // dispatches a click event
  a.dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    }),
  )

  // remove the anchor element from the DOM
  a.remove()
}

onMounted(() => {
  getMissions()
})
</script>

<template>
  <VRow justify="center">
    <VCol
      md="4"
      cols="12"
      sm="12"
    >
      <VCard
        append-icon="mdi-briefcase-eye-outline"
        title="NHIỆM VỤ CÓ SẴN"
      >
        <template #append>
          <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
            <VIcon
              icon="mdi-account-box-outline"
              color="blue"
            />
          </div>
        </template>
        <VCardText>
          <b> {{ missionAvailable }} </b>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      md="4"
      cols="12"
      sm="12"
    >
      <VCard
        append-icon="mdi-briefcase-eye-outline"
        title="NHIỆM VỤ ĐÃ HOÀN THÀNH"
      >
        <template #append>
          <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
            <VIcon
              icon="mdi-thumb-up-outline"
              color="blue"
            />
          </div>
        </template>
        <VCardText>
          <b>{{ profile.user_mission_count || 0 }}</b>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      md="4"
      cols="12"
      sm="12"
    >
      <VCard
        append-icon="mdi-briefcase-eye-outline"
        title="TỔNG THU NHẬP"
      >
        <template #append>
          <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
            <VIcon
              icon="mdi-currency-usd "
              color="blue"
            />
          </div>
        </template>
        <VCardText>
          <b>{{ profile.balance_deposit }}</b>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VRow style="margin: 12px 0">
    <VCard
      width="100%"
      title="Nhiệm vụ vượt link rút gọn"
      append-icon="mdi-arrow-down"
    >
      <template #title>
        <div
          style="width: 100%; cursor: pointer"
          @click="() => {
            showMissionSortLink = !showMissionSortLink
            iconShowMissionSortLink = showMissionSortLink ? 'mdi-arrow-up' : 'mdi-arrow-down'
          }"
        >
          Nhiệm vụ vượt link rút gọn
        </div>
      </template>
      <template #append>
        <VIcon
          size="small"
          :icon="iconShowMissionSortLink"
          @click="() => {
            showMissionSortLink = !showMissionSortLink
            iconShowMissionSortLink = showMissionSortLink ? 'mdi-arrow-up' : 'mdi-arrow-down'
          }"
        />
      </template>
      <VDivider />
      <VCardText>
        <CollapseTransition>
          <div v-show="showMissionSortLink">
            <VRow class="my-2">
              <VCol
                v-for="item in missionList"
                :key="item.id"
                md="4"
                cols="12"
                sm="12"
              >
                <VCard
                  width="100%"
                  :title="item.title"
                  append-icon="mdi-arrow-down"
                  style="box-shadow: 7px 9px 8px -9px rgba(0,0,0,0.9); border: 1px solid #E0E0E0;"
                >
                  <template #append>
                    <VBtn
                      size="small"
                      color="primary"
                      link
                      :href="`/task/${item.slug}`"
                    >
                      Chi tiết
                    </VBtn>
                  </template>
                  <!--
                    <VCardText>
                    <span>{{ item.description }}</span>
                    </VCardText>
                  -->
                  <VDivider class="mb-2" />
                  <VCardActions>
                    <VRow
                      justify="space-between"
                      align-content="center"
                    >
                      <VCol
                        cols="12"
                        sm="12"
                        md="4"
                      >
                        <VIcon
                          size="small"
                          color="#E91E63"
                          icon="mdi-gift"
                        />
                        <span class="mx-1">{{ item.reward }} $</span>
                      </VCol>
                    </VRow>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
          </div>
        </CollapseTransition>
      </VCardText>
    </VCard>
  </VRow>
</template>

<style>
.v-card-item{
    padding: 1rem !important;
}
.v-card-title{
  font-size: 1em !important;
}
.v-card-text {
  padding : .5rem 1rem !important;
}
</style>
