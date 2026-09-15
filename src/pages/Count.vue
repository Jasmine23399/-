<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { store, activeAssets } from '../store'
const emit = defineEmits(['navigate', 'notify'])
const location = '实验楼 A305'
const category = ref('电脑')
const photoUrl = ref('')
const photoName = ref('')
const detectedInput = ref('')
const result = ref(null)
const expected = computed(() => activeAssets.value.filter(a => a.category === category.value && a.location === location).length)
function upload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 8 * 1024 * 1024) { emit('notify', '请选择小于 8 MB 的图片'); return }
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
  photoUrl.value = URL.createObjectURL(file)
  photoName.value = file.name
  result.value = null
}
function run() {
  if (!photoUrl.value) { emit('notify', '请先上传清点照片'); return }
  const n = Number(detectedInput.value)
  if (detectedInput.value === '' || !Number.isInteger(n) || n < 0) { emit('notify', '请输入有效的设备数量'); return }
  result.value = { count: n, expected: expected.value, category: category.value }
  emit('notify', '已生成模拟清点结果')
}
function save() {
  if (!result.value) return
  store.counts.unshift({ category: result.value.category, location, expected: result.value.expected, detected: result.value.count, date: new Date().toLocaleDateString('zh-CN') })
  result.value = null
  emit('notify', '清点记录已保存')
}
onUnmounted(() => { if (photoUrl.value) URL.revokeObjectURL(photoUrl.value) })
</script>
<template>
  <p class="section-intro">选择清点区域与设备类别，上传一张照片。演示版由用户填写识别数量，展示台账比对流程。</p>
  <div class="step-row"><div class="step active">1 选择范围</div><div class="step" :class="{ active: photoUrl }">2 上传照片</div><div class="step" :class="{ active: result }">3 核对结果</div></div>
  <div class="grid-2"><div class="card"><div class="card-head"><div class="card-title">清点任务</div></div>
    <div class="form-grid"><div class="field"><label>清点区域</label><select disabled><option>{{ location }}</option></select></div><div class="field"><label>识别类别</label><select v-model="category" @change="result = null"><option v-for="c in ['电脑','显示器','网络设备','打印机']" :key="c">{{ c }}</option></select></div></div>
    <div style="height:18px"></div><div class="upload"><input type="file" accept="image/*" @change="upload"><div v-if="photoUrl"><img :src="photoUrl" alt="清点照片预览"><p>{{ photoName }} · 点击更换图片</p></div><div v-else><div class="upload-icon">⇧</div><strong>点击上传清点照片</strong><p>支持 JPG、PNG；单张图片演示</p></div></div>
    <div style="height:18px"></div><div class="note">台账中该区域的{{ category }}共 <strong>{{ expected }}</strong> 台。当前照片识别尚未连接多模态大模型 API；下面用人工填写的模拟识别数量演示比对结果。</div>
    <div style="height:18px"></div><div class="form-grid"><div class="field"><label>模拟识别数量</label><input v-model="detectedInput" type="number" min="0" max="999" placeholder="请输入照片中的设备数量"></div><div class="field" style="align-self:end"><button class="btn primary" style="width:100%" @click="run">生成清点比对结果</button></div></div>
  </div><div><div class="card"><div class="card-head"><div><div class="card-title">清点结果</div><div class="card-sub">照片数量与指定区域台账数量比对</div></div></div>
    <template v-if="result"><div class="result-grid"><div class="result-box"><span>台账数量</span><strong>{{ result.expected }}</strong></div><div class="result-box"><span>识别数量</span><strong>{{ result.count }}</strong></div><div class="result-box"><span>{{ result.count > result.expected ? '盘盈' : result.count < result.expected ? '盘亏' : '差异' }}</span><strong>{{ Math.abs(result.count - result.expected) }}</strong></div></div><div style="height:18px"></div><div class="note">{{ result.count === result.expected ? '数量一致。仍需核对设备编号与实物标签。' : result.count > result.expected ? `照片中比台账多 ${result.count - result.expected} 台${result.category}，建议核对是否存在未登记设备。` : `照片中比台账少 ${result.expected - result.count} 台${result.category}，建议检查设备是否移位或漏拍。` }} 单张照片只能完成类别数量初步比对，不能确认设备身份。</div><div style="height:17px"></div><button class="btn primary" @click="save">保存清点记录</button></template><div v-else class="empty">上传照片并填写模拟识别数量后，这里会显示盘盈盘亏结果。</div>
  </div><div class="card"><div class="card-head"><div class="card-title">最近清点记录</div></div><div v-for="(item,index) in store.counts.slice(0,4)" :key="index" class="activity"><span class="dot"></span><div><strong>{{ item.category }} · {{ item.location }}</strong><p>台账 {{ item.expected }} 台 / 照片 {{ item.detected }} 台 · {{ item.date }}</p></div></div><div v-if="!store.counts.length" class="empty">暂无清点记录</div></div></div></div>
</template>
