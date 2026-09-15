<script setup>
import { ref, computed } from 'vue'
import { store, findAsset, newId, today } from '../store'
import StatusTag from '../components/StatusTag.vue'
const emit = defineEmits(['navigate', 'notify'])
const showForm = ref(false)
const form = ref({ assetId: '', to: '', reason: '' })
const available = computed(() => store.assets.filter(a => a.status !== '已报废'))
function open() { form.value = { assetId: available.value[0]?.id || '', to: '', reason: '' }; showForm.value = true }
function submit() {
  const asset = findAsset(form.value.assetId)
  if (!asset) { emit('notify', '请选择有效设备'); return }
  store.transfers.unshift({ id: newId('TR'), assetId: asset.id, from: asset.owner, to: form.value.to.trim(), reason: form.value.reason.trim(), status: '待审批', date: today() })
  showForm.value = false; emit('notify', '转移申请已提交，等待审批')
}
function decide(request, approved) {
  request.status = approved ? '已通过' : '已驳回'
  if (approved) { const asset = findAsset(request.assetId); if (asset) asset.owner = request.to }
  emit('notify', `转移申请${request.status}`)
}
</script>
<template>
  <p class="section-intro">设备从一位使用人转给另一位使用人时，先提交申请，审批通过后更新台账归属。</p>
  <div class="card"><div class="card-head"><div><div class="card-title">转移申请</div><div class="card-sub">审批记录保留原使用人、接收人和原因</div></div><button class="btn primary" @click="open">＋ 发起转移</button></div>
    <table><thead><tr><th>申请编号</th><th>设备</th><th>流转方向</th><th>申请原因</th><th>状态</th><th>操作</th></tr></thead><tbody>
      <tr v-for="request in store.transfers" :key="request.id"><td>{{ request.id }}</td><td>{{ findAsset(request.assetId)?.name || request.assetId }}<div class="muted">{{ request.assetId }}</div></td><td>{{ request.from }} → {{ request.to }}</td><td>{{ request.reason }}</td><td><StatusTag :status="request.status" /></td><td><template v-if="request.status === '待审批'"><button class="btn small primary" @click="decide(request,true)">通过</button> <button class="btn small danger" @click="decide(request,false)">驳回</button></template><span v-else>—</span></td></tr>
      <tr v-if="!store.transfers.length"><td colspan="6" class="empty">暂无转移申请</td></tr>
    </tbody></table>
  </div>
  <div v-if="showForm" class="modal-shade" @click.self="showForm = false"><div class="modal"><h2>发起设备转移</h2><form @submit.prevent="submit"><div class="form-grid"><div class="field wide"><label>转移设备</label><select v-model="form.assetId" required><option v-for="asset in available" :key="asset.id" :value="asset.id">{{ asset.id }} · {{ asset.name }}（{{ asset.owner }}）</option></select></div><div class="field"><label>接收人</label><input v-model="form.to" required></div><div class="field wide"><label>转移原因</label><textarea v-model="form.reason" required placeholder="例如：教学项目调整"></textarea></div></div><div class="modal-actions"><button class="btn" type="button" @click="showForm = false">取消</button><button class="btn primary">提交申请</button></div></form></div></div>
</template>
