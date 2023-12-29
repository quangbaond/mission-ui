<script setup lang="ts">

import { GET } from "@/service";
import { useStore } from "vuex";
const introduceTotal = ref([] as any[])
const introduceVerifyTotal = ref([] as any[])
const store = useStore()
const profile = computed(() => store.state.userStore.profile)
const swal = inject("$swal");

const getIntroduce = async () => {
  const res = await GET("/v1/introduce");
  const { status, result, message } = res.data;
    console.log('res', res);
    introduceTotal.value = result?.introduceTotal;
    introduceVerifyTotal.value = result?.introduceVerifyTotal;
};
const urlRegister = ref(`${window.location.origin}/register?ref=${profile.value.code}` as string);
watch(profile, (newVal, oldVal) => {
  if (newVal) {
    urlRegister.value = `${window.location.origin}/register?ref=${newVal.code}`;
  }
})

const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = urlRegister.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    swal({
        title: "Thành công",
        text: "Đã copy vào bộ nhớ tạm",
        icon: "success",
        button: "Đóng",
    });
};
onMounted(() => {
  getIntroduce()
})

</script>
<template>
  <v-row justify="center">
    <v-col md="4" cols="12" sm="12">
      <v-card  append-icon="mdi-briefcase-eye-outline" title="TỔNG NGƯỜI GIỚI THIỆU">
        <template v-slot:append>
            <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
                <v-icon icon="mdi-account-group-outline" color="blue"></v-icon>
            </div>
        </template>
        <v-card-text>
          <b> {{ introduceTotal || 0}} </b>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="4" cols="12" sm="12">
      <v-card  append-icon="mdi-briefcase-eye-outline" title="TỔNG NGƯỜI XÁC THỰC">
        <template v-slot:append>
            <div style="padding: 10px; background: #F3E5F5; border-radius: 7px">
                <v-icon icon="mdi-account-group-outline" color="blue"></v-icon>
            </div>
        </template>
        <v-card-text>
          <b>{{ introduceVerifyTotal || 0}}</b>
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
          <b>{{ profile.balance_introduce || 0}}</b>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col md="12" sm="12" cols="12">
        <v-card title="Mời bạn bè để kiếm ngay 50.000 $ vào ví" subtitle="Bạn sẽ nhận được tiền thưởng cho mỗi người bạn mà bạn giới thiệu sau khi họ hoàn thành đăng ký tài khoản và xác minh số điện thoại thành công!">
            <v-card-text>
                <b style="color: #7367f0 !important">Nhận thêm 10% hoa hồng trọn đời từ doanh thu người bạn giới thiệu</b>

                <p style="margin-top: 10px">Bạn sẽ nhận được 10% hoa hồng trọn đời từ doanh thu người bạn giới thiệu. Ví dụ: Nếu người bạn giới thiệu kiếm được 100.000 $, bạn sẽ nhận được 10.000 $.</p>

                <p style="margin-top: 10px">Hoa hồng sẽ được cập nhật vào tài khoản của bạn sau khi người bạn giới thiệu hoàn thành nhiệm vụ và rút tiền thành công.</p>
                <v-label style="color: #000">Link giới thiệu: </v-label>
                <v-row align="center">
                    <v-col md="10" sm="10" cols="10">
                        <v-text-field
                            outlined
                            readonly
                            :value="urlRegister"
                            style="margin-top: 10px"
                            density="compact"
                        ></v-text-field>
                    </v-col>
                    <v-col md="2" sm="2" cols="2" style="height: 100%">
                        <v-btn
                            style="width: 100%"
                            class="mt-2"
                            color="primary"
                            dark
                            @click="copyToClipboard"
                        >
                            <v-icon>mdi-content-copy</v-icon>
                            Sao chép
                        </v-btn>
                    </v-col>
                </v-row>
                <v-alert
                    class="mt-3"
                    density="compact"
                    type="warning"
                    text="Giới thiệu gian lận, giới thiệu giả mạo, tự giới thiệu sẽ không được thanh toán và có thể bị khóa tài khoản"
                ></v-alert>
            </v-card-text>

        </v-card>

    </v-col>

  </v-row>

</template>
