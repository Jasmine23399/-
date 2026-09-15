<script setup>
import { ref, computed } from 'vue'
import { store } from '../store'
import AssetTable from '../components/AssetTable.vue'
const emit = defineEmits(['navigate', 'notify'])
const search = ref('')
const category = ref('全部')
const editing = ref(null)
const form = ref({})
const categories = computed(() => ['全部', ...new Set(store.assets.map(a => a.category))])
const filtered = computed(() => store.assets.filter(a => (category.value === '全部' || a.category === category.value) && `${a.id} ${a.name} ${a.owner} ${a.location}`.toLowerCase().includes(search.value.toLowerCase())))
function open(asset = null) {
  editing.value = asset
  form.value = asset ? { ...asset } : { id: '', name: '', model: '', category: '电脑', owner: '', department: '', location: '', date: '', status: '在用', repairs: 0 }
}
function save() {
  const data = { ...form.value, id: form.value.id.trim(), repairs: Number(form.value.repairs) }
  if (!data.id || store.assets.some(a => a.id === data.id && a !== editing.value)) { emit('notify', '设备编号已存在或无效'); return }
  if (editing.value) Object.assign(editing.value, data)
  else store.assets.unshift(data)
  editing.value = null; emit('notify', '设备信息已保存')
}
</script>
<template>
  <p class="section-intro">为每台设备登记唯一编号、使用人和存放位置，形成可查询的设备台账。</p>
  <div class="card"><div class="toolbar"><div class="toolbar-left"><input v-model="search" class="search" placeholder="搜索编号、名称、使用人或位置"><select v-model="category"><option v-for="c in categories" :key="c">{{ c }}</option></select></div><button class="btn primary" @click="open()">＋ 录入设备</button></div><AssetTable :assets="filtered" editable @edit="open" /></div>
  <div class="note">此页面使用浏览器本地存储保存演示数据。后续接入后端 API 后，台账会由数据库统一管理。</div>
  <div v-if="form.id !== undefined" class="modal-shade" @click.self="form = {}"><div class="modal"><h2>{{ editing ? '编辑设备' : '录入设备' }}</h2><form @submit.prevent="save"><div class="form-grid">
    <div class="field"><label>设备编号</label><input v-model="form.id" required></div><div class="field"><label>设备名称</label><input v-model="form.name" required></div>
    <div class="field"><label>型号</label><input v-model="form.model" required></div><div class="field"><label>类别</label><select v-model="form.category"><option v-for="c in ['电脑','显示器','打印机','网络设备','箱子','其他']" :key="c">{{ c }}</option></select></div>
    <div class="field"><label>使用人</label><input v-model="form.owner" required></div><div class="field"><label>所属部门</label><input v-model="form.department" required></div>
    <div class="field"><label>存放位置</label><input v-model="form.location" required></div><div class="field"><label>购买日期</label><input v-model="form.date" type="date" required></div>
    <div class="field"><label>状态</label><select v-model="form.status"><option v-for="s in ['在用','待维修','闲置']" :key="s">{{ s }}</option></select></div><div class="field"><label>维修次数</label><input v-model.number="form.repairs" type="number" min="0" required></div>
  </div><div class="modal-actions"><button class="btn" type="button" @click="form = {}">取消</button><button class="btn primary">保存</button></div></form></div></div>
</template>
