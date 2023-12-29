<script setup lang="ts">
import { formatDateTime } from '@/@common';
import { useStore } from 'vuex';
const store = useStore()
const profile = computed(() => store.state.userStore.profile)
const formRef = ref(null as any)
const loading = computed(() => store.state.loading)

const swal = inject('$swal')

const form = ref({
  method: 'momo',
  amount: 10000,
  phone: null,
  bank_name: '',
  bank_number: '',
  bank_owner: '',
  card_name: '',
  card_value: '',
})

const withdraws = ref([])


const withdraw = async () => {
  const isValid = await formRef.value.validate()

  const query = {
    ...form.value,
    amount: Number(form.value.amount)
  }

  if (profile.value.balance < form.value.amount) {
    swal({
      title: 'Tạo lệnh rút tiền thất bại',
      text: 'Số tiền rút phải nhỏ hơn số dư khả dụng',
      icon: 'error',
      timer: 3000,
    })
    return
  }


  if (isValid.valid) {
    const response = await store.dispatch('userStore/withdraw', query)

    const { status, result, message } = response.data

    if (status) {
      swal({
        title: 'Tạo lệnh rút tiền thành công',
        text: response.message,
        icon: 'success',
        timer: 3000,
      })

      store.dispatch('userStore/getProfile')
      getWithDraw()
      return
    }

    swal({
      title: 'Tạo lệnh rút tiền thất bại',
      text:  response.message || 'Bạn tạo lệnh rút tiền thất bại, vui lòng kiểm tra lại thông tin',
      icon: 'error',
      timer: 3000,
    })
  }
}
const getWithDraw = async () => {
  const response = await store.dispatch('userStore/getWithdrawHistory')

  const { status, result, message } = response.data
  console.log('result', result);

  if (status) {
    withdraws.value = result
  }

}

onMounted(() => {
  getWithDraw()
})
</script>
<template>
  <v-row >
    <v-col md="4" cols="12" sm="12">
      <v-card title="SỐ DƯ KHẢ DỤNG">
        <v-card-text>
          <b> {{ profile.balance }} $</b>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="4" cols="12" sm="12">
      <v-card title="TỔNG SỐ TIỀN ĐANG DUYỆT">
        <v-card-text>
          <b>{{ profile.balance_pending }} $</b>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col md="4" cols="12" sm="12">
      <v-card title="TỔNG SỐ TIỀN ĐÃ RÚT">
        <v-card-text>
          <b>{{profile.balance_withdraw }} $</b>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col md="12" cols="12" sm="12">
      <v-card title="Thông tin thanh toán">
        <template v-slot:append>
            Quy đổi: 10.000 $ = 10.000 VNĐ
        </template>
          <v-card-text>
            <v-form @submit.prevent="withdraw" ref="formRef">
              <v-row>
                  <v-col md="6" sm="12" cols="12">
                      <v-row>
                          <v-col md="12" sm="12" cols="12">
                              <v-text-field type='number' density="compact" label="Số tiền rút" v-model="form.amount" min="10000"
                              :rules="[
                                  (v) => !!v || 'Số tiền rút không được để trống',
                                  (v) => (v && !isNaN(v)) || 'Số tiền rút phải là số',
                                  (v) => (v && v >= 10000) || 'Số tiền rút phải lớn hơn 10.000',
                              ]"
                              >
                              </v-text-field>
                          </v-col>
                          <v-col md="12" sm="12" cols="12">
                              <v-radio-group v-model="form.method" inline>
                                  <v-radio label="Momo" value="momo"></v-radio>
                                  <v-radio label="Thẻ cào" value="card"></v-radio>
                                  <v-radio label="Ngân hàng" value="bank"></v-radio>
                              </v-radio-group>
                          </v-col>
                          <v-col md="12" sm="12" cols="12">
                              <div v-if="form.method == 'momo'">
                                  <v-text-field
                                  density="compact"
                                  label="Số điện thoại MoMo"
                                  :rules="[
                                      (v) => !!v || 'Số điện thoại không được để trống',
                                      (v) => (v && !isNaN(v)) || 'Số điện thoại phải là số',
                                      (v) => (v && v[0] == '0') || 'Số điện thoại phải bắt đầu bằng số 0',
                                      (v) => (v && v.length == 10) || 'Số điện thoại phải đủ 10 số',
                                  ]"
                                  v-model="form.phone">
                                  <template #label>
                                      <span></span>Số điện thoại MoMo <strong style="color: red"> * </strong>
                                  </template>
                                  </v-text-field>
                              </div>
                              <div v-else-if="form.method == 'card'">
                                  <v-row>
                                      <v-col md="12" sm="12" cols="12">
                                          <v-select
                                              label="Select"
                                              density="compact"
                                              v-model="form.card_name"
                                              :items="[
                                                  'Viettel', 'Vinaphone', 'Mobifone', 'Vietnamobile', 'Garenar', 'Zing', 'Vcoin', 'Gate'
                                              ]"
                                              :rules="[v => !!v || 'Item is required']"
                                          >
                                              <template #label>
                                                  <span></span>Loại thẻ <strong style="color: red"> * </strong>
                                              </template>
                                          </v-select>
                                      </v-col>
                                      <v-col md="12" sm="12" cols="12">
                                          <v-select
                                              label="Chọn mệnh giá"
                                              density="compact"
                                              v-model="form.card_value"
                                              :items="[
                                                  '10.000', '20.000', '50.000', '100.000', '200.000', '500.000', '1.000.000'
                                              ]"
                                              :rules="[v => !!v || 'Item is required']"
                                          >
                                              <template #label>
                                                  <span></span>Mệnh giá <strong style="color: red"> * </strong>
                                              </template>
                                          </v-select>
                                      </v-col>
                                  </v-row>
                              </div>
                              <div v-else>
                                <v-row>
                                      <v-col md="12" sm="12" cols="12">
                                          <v-select
                                              label="Tên ngân hàng*"
                                              density="compact"
                                              v-model="form.bank_name"
                                              :items="[
                                                  'Vietinbank', 'Vietcombank', 'BIDV', 'Techcombank', 'VPBank', 'ACB', 'MBBank', 'TPBank', 'HDBank', 'SHB', 'VIB', 'SeABank', 'BacABank', 'OceanBank', 'Eximbank', 'MSB', 'LienVietPostBank', 'NamABank', 'PGBank', 'VietCapitalBank', 'VietABank', 'BaoVietBank', 'KienLongBank', 'VietBank', 'Orient Commercial Bank', 'BacA Bank', 'PvcomBank', 'VRB', 'BVB', 'GPBank', 'NCB', 'SCB', 'BVB', 'OCB', 'BacABank', 'BaoVietBank', 'VietBank', 'Orient Commercial Bank', 'BacA Bank', 'PvcomBank', 'VRB', 'BVB', 'GPBank', 'NCB', 'SCB', 'BVB', 'OCB', 'BacABank', 'BaoVietBank', 'VietBank', 'Orient Commercial Bank', 'BacA Bank', 'PvcomBank', 'VRB', 'BVB', 'GPBank', 'NCB', 'SCB', 'BVB', 'OCB', 'BacABank', 'BaoVietBank', 'VietBank', 'Orient Commercial Bank', 'BacA Bank', 'PvcomBank', 'VRB', 'BVB', 'GPBank', 'NCB', 'SCB', 'BVB', 'OCB', 'BacABank', 'BaoVietBank', 'VietBank', 'Orient Commercial Bank', 'BacA Bank', 'PvcomBank', 'VRB', 'BVB', 'GPBank', 'NCB', 'SCB', 'BVB', 'OCB', 'BacABank', 'BaoVietBank', 'VietBank', 'Orient Commercial Bank', 'BacA Bank', 'PvcomBank', 'VRB', 'BVB', 'GPBank', 'NCB', 'SCB', 'BVB', 'OCB'
                                              ]"
                                              :rules="[v => !!v || 'Item is required']"
                                          >
                                              <template #label>
                                                  <span></span>Tên ngân hàng <strong style="color: red"> * </strong>
                                              </template>
                                          </v-select>


                                      </v-col>
                                      <v-col md="12" sm="12" cols="12">
                                          <v-text-field
                                              density="compact"
                                              label="Số tài khoản"
                                              :rules="[
                                                  (v) => !!v || 'Số tài khoản không được để trống',
                                                  (v) => (v && !isNaN(v)) || 'Số tài khoản phải là số',
                                              ]"
                                              v-model="form.bank_number">
                                              <template #label>
                                                  <span></span>Số tài khoản <strong style="color: red"> * </strong>
                                              </template>
                                          </v-text-field>
                                      </v-col>

                                      <v-col md="12" sm="12" cols="12">
                                          <v-text-field
                                              density="compact"
                                              label="Tên chủ tài khoản"
                                              :rules="[
                                                  (v) => !!v || 'Tên chủ tài khoản không được để trống',
                                              ]"
                                              v-model="form.bank_owner">
                                              <template #label>
                                                  <span></span>Tên chủ tài khoản <strong style="color: red"> * </strong>
                                              </template>
                                          </v-text-field>
                                      </v-col>
                                  </v-row>
                              </div>
                          </v-col>
                      </v-row>
                      <v-row>
                        <v-col md="12" sm="12" cols="12">
                          <v-btn style="width: 100%" type="submit" color="primary" :loading="loading">Rút tiền</v-btn>
                        </v-col>
                      </v-row>
                  </v-col>
                  <v-col md="6" sm="12" cols="12">
                      <v-data-table
                          :headers="[
                              { title: 'PHƯƠNG THỨC RÚT TIỀN', value: 'method', key: 'method', },
                              { title: 'SỐ TIỀN RÚT TỐI THIỂU', value: 'amount', key: 'amount', },
                              { title: 'RÚT LẦN 3 TRỞ ĐI', value: 'threeTime', key: 'threeTime' },
                          ]"
                          :items="[
                              { method: 'Momo', amount: '10.000', threeTime: '20.000' },
                              { method: 'Thẻ cào', amount: '10.000', threeTime: '20.000' },
                              { method: 'Ngân hàng', amount: '50.000', threeTime: '50.000' },
                          ]"
                          item-key="method"
                          :hide-default-footer="true"
                          disable-pagination
                          class="elevation-1"
                      >
                      <template #bottom></template>
                      </v-data-table>
                  </v-col>
              </v-row>
            </v-form>
          </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col md="12" cols="12" sm="12">
      <v-card title="Lịch sử rút tiền">
        <v-card-text>
          <v-data-table
            :headers="[
              { title: 'Số tiền rút', value: 'amount', key: 'amount' },
              { title: 'Phương thức rút', value: 'method', key: 'method' },
              { title: 'Trạng thái', value: 'status', key: 'status',  },
              { title: 'Ngày tạo', value: 'created_at', key: 'created_at' },
            ]"
            :items="withdraws"
            item-key="id"
            :hide-default-footer="true"
            no-data-text="Không có dữ liệu"
            loading-text="Đang tải dữ liệu"
            items-per-page-text="Số dòng trên trang"

          >
            <template v-slot:item.status="{item}">
              <v-chip  :color="item.selectable.status == 0 ? 'warning' : item.selectable.status  == 1 ? 'success' : 'error'"  small >
                {{ item.selectable.status == 0 ? 'Đang chờ' : item.selectable.status  == 1 ? 'Thành công' : 'Từ chối'}}
              </v-chip>
            </template>

            <template v-slot:item.created_at="{item}">
              <span>{{ formatDateTime(item.selectable.created_at) }}</span>
            </template>
            <template v-slot:item.method="{item}">
              <span>{{ item.selectable.method === 'bank' ? 'Ngân hàng' : item.selectable.method == 'card' ? 'Thẻ cào' : 'momo'  }}</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
