<script setup lang="ts">
import { GET, POST } from "@/service";
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue';
import moment from 'moment';
import { inject } from "vue";
import { useStore } from 'vuex';
const store = useStore()
const profile = computed(() => store.state.userStore.profile)

const missionAvailable = ref(0 as number)


const missionList = ref([] as any[])

const showMissionSortLink = ref(true)

const iconShowMissionSortLink = ref("mdi-arrow-up")

const swal = inject("$swal");

const getMissions = async () => {
  const res = await GET("/v1/missions");
  const { status, result, message } = res.data;
  missionAvailable.value = result?.countMissionAvailable;

  const missionListData = result?.missionList?.map((item: any) => {
    const userMission = item?.user_mission?.findLast(
      (userMission: any) => userMission.mission_id == item.id
    );
    const start = moment()
    const end = moment(userMission?.created_at).add(import.meta.env.VITE_MINUTES_WAINTING, 'minutes');

    const remainingMinutes = end.diff(start, 'minutes');

    return {
      ...item,
      disabled: userMission ? remainingMinutes > 0 : false,
      countdown: userMission && remainingMinutes > 0 ? remainingMinutes : 0
    };
  });

  console.log(missionListData);

  missionList.value = missionListData.filter((item: any) => item.type == 0);
};

const startCountdown = (item: any) => {
  console.log('item', item);
  item.countdown = item.countdown * 60;
  const intervalId = setInterval(() => {
    if (item.countdown > 0) {
      item.countdown--;
    } else {
      clearInterval(intervalId);
      item.disabled = false;
    }

  }, 1000);
};

watch(missionList, (newVal) => {
  newVal.forEach(item => {
    if (item.countdown === 0) {
      // Perform the task when the countdown ends
      // doTask(item.id);
    } else {
      // Start the countdown
      startCountdown(item);
    }
  });
});

const doTask = async (id: number, url: string) => {
  const res = await POST(`/v1/missions/do-task`, {
    mission_id: id,
  });
  const { status, result, message } = res.data;
  if (status) {

    // call mutation to update profile
    store.dispatch('userStore/getProfile')
    getMissions();

    swal({
      title: "Thành công",
      text: message,
      icon: "success",
      timer: 2000,
    });

    navigateTo(url);
  }
};

const navigateTo = (url: string) => {
  // create a new anchor element
  const a = document.createElement("a");
  // set the href and rel
  a.href = url;
  a.rel = "noopener noreferrer";
  // opens the url in a new window
  a.target = "_blank";
  // dispatches a click event
  a.dispatchEvent(
    new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
  );

  // remove the anchor element from the DOM
  a.remove();
};

onMounted(() => {
  getMissions();
});


</script>
<template>
  <v-row justify="center">
    <v-col md="4" cols="12" sm="12">
      <v-card  append-icon="mdi-briefcase-eye-outline" title="NHIỆM VỤ CÓ SẴN">
        <template v-slot:append>
            <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
                <v-icon icon="mdi-account-box-outline" color="blue"></v-icon>
            </div>
        </template>
        <v-card-text>
          <b> {{ missionAvailable }} </b>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="4" cols="12" sm="12">
      <v-card  append-icon="mdi-briefcase-eye-outline" title="NHIỆM VỤ ĐÃ HOÀN THÀNH">
        <template v-slot:append>
            <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
                <v-icon icon="mdi-thumb-up-outline" color="blue"></v-icon>
            </div>
        </template>
        <v-card-text>
          <b>{{ profile.user_mission_count }}</b>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="4" cols="12" sm="12">
      <v-card append-icon="mdi-briefcase-eye-outline" title="TỔNG THU NHẬP">
        <template v-slot:append>
            <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
                <v-icon icon="mdi-currency-usd " color="blue"></v-icon>
            </div>
        </template>
        <v-card-text>
          <b>{{profile.balance_deposit}}</b>
        </v-card-text>

      </v-card>
    </v-col>
  </v-row>
  <v-row style="margin: 12px 0">
    <v-card
      width="100%"
      title="Nhiệm vụ vượt link rút gọn"
      append-icon="mdi-arrow-down"
    >
    <template v-slot:title>
      <div style="width: 100%; cursor: pointer" @click="() => {
      showMissionSortLink = !showMissionSortLink
      iconShowMissionSortLink = showMissionSortLink ? 'mdi-arrow-up' : 'mdi-arrow-down'
    }">Nhiệm vụ vượt link rút gọn</div>
    </template>
    <template v-slot:append>
      <v-icon size="small" :icon="iconShowMissionSortLink"  @click="() => {
        showMissionSortLink = !showMissionSortLink
        iconShowMissionSortLink = showMissionSortLink ? 'mdi-arrow-up' : 'mdi-arrow-down'
      }"></v-icon>
    </template>
    <v-card-text>
      <collapse-transition>
        <div v-show="showMissionSortLink">
          <v-row class="my-2">
            <v-col md="4" cols="12" sm="12"
                v-for="item in missionList"
                :key="item.id">
              <v-card
                width="100%"
                :title="item.name"
                append-icon="mdi-arrow-down"
              >
                <template v-slot:append>
                  <v-btn size="small" color="primary" @click="doTask(item.id, item?.url)" :disabled="item.disabled">
                     {{ item.countdown > 0 ? `${item.countdown} s` : 'Thực hiện' }}
                  </v-btn>
                </template>
                <v-card-text>
                  <span>{{ item.description }}</span>
                </v-card-text>
                <v-divider class="mb-2"></v-divider>
                <v-card-actions>
                  <v-row justify="space-between" align-content="center">
                    <v-col cols="12" sm="12" md="4">
                      <v-icon size="small" color="#E91E63" icon="mdi-gift"></v-icon>
                      <span class="mx-1">{{ item.reward }} $</span>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </collapse-transition>
    </v-card-text>
  </v-card>

  </v-row>
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
