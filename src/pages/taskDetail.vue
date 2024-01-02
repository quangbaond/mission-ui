<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GET, POST } from '@/service'

const store = useStore()
const router = useRouter()

const slug = computed(() => router.currentRoute.value.params.slug)

const task = ref({} as any)

const loading = computed(() => store.state.loading)

const swal = inject('$swal')

const getTask = async () => {
  const res = await GET(`/v1/mission/${slug.value}`)
  const { status, result, message } = res.data

  console.log('res', res)

  if (status)
    task.value = result
}

const isComplete = ref(false)
const code = ref('')

const doTask = async () => {
  const res = await POST('/v1/missions/do-task', {
    mission_id: task.value.id,
  })

  const { status, result, message } = res.data

  window.addEventListener('popstate', event => {
    console.log('Lịch sử thay đổi:', event.state)
  })

  if (status) {
    swal({
      icon: 'success',
      title: 'Nhận nhiệm vụ thành công!',
      text: 'Vui lòng làm theo hướng dẫn để hoàn thành nhiệm vụ.',
    })
    isComplete.value = true

    return
  }

  swal({
    icon: 'error',
    title: 'Nhận nhiệm vụ thất bại!',
    text: 'Vui lòng thử lại sau.',
  })
}

const completeTask = async () => {
  const res = await POST('/v1/missions/complete-task', {
    mission_id: task.value.id,
    code: code.value,
  })

  const { status, result, message } = res.data

  if (status) {
    swal({
      icon: 'success',
      title: 'Hoàn thành nhiệm vụ thành công!',
      text: 'Vui lòng chờ xác nhận từ admin.',
    })
    isComplete.value = true

    return
  }

  swal({
    icon: 'error',
    title: 'Hoàn thành nhiệm vụ thất bại!',
    text: 'Vui lòng thử lại sau.',
  })
}

onMounted(() => {
  getTask()
})
</script>

<template>
  <VRow>
    <VCol
      md="12"
      sm="12"
      cols="12"
    >
      <VCard>
        <VCardTitle>
          <h4 class="text-h5">
            Chi tiết nhiệm vụ
          </h4>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <div v-html="task.description" />
        </VCardText>
        <VDivider />
        <VCardText>
          <VRow>
            <VCol
              :md="!isComplete ? '6' : '6'"
              :sm="isComplete ? '12' : '6'"
              :cols="isComplete ? '12' : '6'"
            >
              <div v-if="!isComplete">
                <VBtn
                  color="primary"
                  :loading="loading"
                  style="width: 100%;"
                  @click="doTask"
                >
                  Làm nhiệm vụ
                </VBtn>
              </div>
              <VRow
                v-else
                align="center"
                justify="center"
              >
                <VCol
                  cols="12"
                  sm="12"
                  md="6"
                >
                  <VTextField
                    v-model="code"
                    label="Mã xác nhận"
                    outlined
                    density="compact"
                    style="margin-right: 1rem; width: 100%;"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="12"
                  md="6"
                >
                  <VBtn
                    style="width: 100%;"
                    color="primary"
                    :loading="loading"
                    @click="completeTask"
                  >
                    Hoàn thành nhiệm vụ
                  </VBtn>
                </vcol>
              </VRow>
            </VCol>
            <VCol
              :class="!isComplete ? 'text-right' : ''"
              :md="isComplete ? '6' : '6'"
              :sm="isComplete ? '12' : '6'"
              :cols="isComplete ? '12' : '6'"
            >
              <VBtn
                style="width: 100%;"
                color="warning"
                link
                href="/task"
              >
                Quay lại
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol
      md="7"
      sm="12"
      cols="12"
    >
      <VCard>
        <VCardTitle>
          <h4 class="text-h5">
            Điều kiện xác nhận
          </h4>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <div>
            <ol>
              <li>Phải tìm kiếm bằng google với keyword có trong nhiệm vụ.</li>
              <li>Phải click vào link của website có trong nhiệm vụ.</li>
              <li>Phải ở lại trang web đó ít nhất 60s.</li>
              <li>Phải click vào 1 link bất kỳ trên trang web đó.</li>
              <li>Phải ở lại trang web bất kì đó ít nhất 60s.</li>
              <li>Nhập mã xác nhận có trong trang web để hoàn thành nhiệm vụ</li>
            </ol>
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      md="5"
      sm="12"
      cols="12"
    >
      <VCard>
        <VCardTitle>
          <h4 class="text-h5">
            Các lưu ý
          </h4>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <div>
            <ol>
              <li>Không lấy mã trực tiếp ở trang web.</li>
              <li>Không sử dụng trình duyệt ẩn danh.</li>
              <li>Không sử dụng Proxy (VPN), 1.1.1.1 khi vượt link.</li>
            </ol>
          </div>
          <VAlert
            type="warning"
            elevation="2"
            icon="mdi-alert-circle-outline"
          >
            <span>
              Nếu bạn vi phạm các điều kiện trên, bạn sẽ bị xóa tài khoản và mất toàn bộ tiền trong tài khoản.
            </span>
          </VAlert>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style>
h3 { margin-bottom: 1rem;}
li { margin: 1rem;}
</style>
