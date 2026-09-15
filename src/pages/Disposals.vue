<script setup>
import { ref, computed } from 'vue'
import { store, findAsset, newId, today } from '../store'
import StatusTag from '../components/StatusTag.vue'
const emit = defineEmits(['navigate', 'notify'])
const showForm = ref(false)
const form = ref({ assetId: '', method: '报废回收', reason: '' })
const available = computed(() => store.assets.filter(a => a.status !== '已报废'))
function open() { form.value = { assetId: available.value[0]?.id || '', method: '报废回收', reason: '' }; showForm.value = true }
function submit() {
  if (!findAsset(form.value.assetId)) { emit('notify', '请选择有效设备'); return }
  store.disposals.unshift({ id: newId('DP'), assetId: form.value.assetId, method: form.value.method, reason: form.value.reason.trim(), status: '待审批', date: today() })
  showForm.value = false; emit('notify', '清理申请已提交，等待审批')
}
function decide(request, approved) {
  request.status = approved ? '已通过' : '已驳回'
  if (approved) { const asset = findAsset(request.assetId); if (asset) asset.status = '已报废' }
  emit('notify', `清理申请${request.status}`)
}
</script>
<template>
  <p class="section-intro">对故障或到期设备发起报废、清理或离场申请，审批后更新设备状态。</p>
  <div class="card"><div class="card-head"><div><div class="card-title">报废清理申请</div><div class="card-sub">记录清理原因与处理方式</div></div><button class="btn primary" @click="open">＋ 发起申请</button></div>
    <table><thead><tr><th>申请编号</th><th>设备</th><th>处理方式</th><th>原因</th><th>状态</th><th>操作</th></tr></thead><tbody>
      <tr v-for="request in store.disposals" :key="request.id"><td>{{ request.id }}</td><td>{{ findAsset(request.assetId)?.name || request.assetId }}<div class="muted">{{ request.assetId }}</div></td><td>{{ request.method }}</td><td>{{ request.reason }}</td><td><StatusTag :status="request.status" /></td><td><template v-if="request.status === '待审批'"><button class="btn small primary" @click="decide(request,true)">通过</button> <button class="btn small danger" @click="decide(request,false)">驳回</button></template><span v-else>—</span></td></tr>
      <tr v-if="!store.disposals.length"><td colspan="6" class="empty">暂无清理申请</td></tr>
    </tbody></table>
  </div>
  <div v-if="showForm" class="modal-shade" @click.self="showForm = false"><div class="modal"><h2>发起报废清理</h2><form @submit.prevent="submit"><div class="form-grid"><div class="field wide"><label>处理设备</label><select v-model="form.assetId" required><option v-for="asset in available" :key="asset.id" :value="asset.id">{{ asset.id }} · {{ asset.name }}（{{ asset.owner }}）</option></select></div><div class="field"><label>处理方式</label><select v-model="form.method"><option>报废回收</option><option>清理离场</option></select></div><div class="field wide"><label>申请原因</label><textarea v-model="form.reason" required placeholder="说明设备故障或清理原因"></textarea></div></div><div class="modal-actions"><button class="btn" type="button" @click="showForm = false">取消</button><button class="btn primary">提交申请</button></div></form></div></div>
</template>
