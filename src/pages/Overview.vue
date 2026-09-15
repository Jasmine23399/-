<script setup>
import { computed } from 'vue'
import { store, activeAssets } from '../store'
import AssetTable from '../components/AssetTable.vue'
import CategoryBars from '../components/CategoryBars.vue'
const emit = defineEmits(['navigate', 'notify'])
const pending = computed(() => store.transfers.filter(x => x.status === '待审批').length + store.disposals.filter(x => x.status === '待审批').length)
const tasks = computed(() => [
  ...store.transfers.filter(x => x.status === '待审批').map(x => ({ title: '转移申请', detail: `${x.assetId} · ${x.from} → ${x.to}`, page: 'transfers' })),
  ...store.disposals.filter(x => x.status === '待审批').map(x => ({ title: '报废申请', detail: `${x.assetId} · ${x.method}`, page: 'disposals' })),
])
const stats = computed(() => [
  ['设备总数', activeAssets.value.length, '▤', '当前在册设备'],
  ['在用设备', activeAssets.value.filter(x => x.status === '在用').length, '◉', '正常使用中'],
  ['待处理审批', pending.value, '⇄', '转移与报废申请'],
  ['清点记录', store.counts.length, '◎', '已保存的清点任务'],
])
</script>
<template>
  <div class="hero"><div><div class="eyebrow">设备全生命周期管理</div><h2>让每一台设备，管理有据可循</h2><p>从台账录入、流转审批到图像清点，集中查看设备状态与异常。</p></div><button @click="emit('navigate','count')">开始智能清点 →</button><div class="hero-orb">◎</div></div>
  <div class="stats"><div v-for="s in stats" :key="s[0]" class="stat"><div><div class="stat-label">{{ s[0] }}</div><div class="stat-value">{{ s[1] }}</div><div class="stat-foot">{{ s[3] }}</div></div><div class="stat-icon">{{ s[2] }}</div></div></div>
  <div class="grid-2"><div>
    <div class="card"><div class="card-head"><div><div class="card-title">最近设备</div><div class="card-sub">当前台账中的设备与归属</div></div><button class="text-link" @click="emit('navigate','assets')">查看全部 →</button></div><AssetTable :assets="activeAssets.slice(0,4)" /></div>
    <div class="card"><div class="card-head"><div class="card-title">快捷入口</div></div><div class="split"><button class="btn" @click="emit('navigate','assets')">＋ 录入设备</button><button class="btn" @click="emit('navigate','transfers')">⇄ 发起转移</button><button class="btn" @click="emit('navigate','disposals')">♻ 报废清理</button><button class="btn primary" @click="emit('navigate','count')">◎ 图片清点</button></div></div>
  </div><div>
    <div class="card"><div class="card-head"><div><div class="card-title">待办事项</div><div class="card-sub">需要设备管理员处理</div></div></div><div v-for="task in tasks" :key="task.detail" class="activity"><span class="dot"></span><div><strong>{{ task.title }}</strong><p>{{ task.detail }}　<button class="text-link" @click="emit('navigate',task.page)">处理 →</button></p></div></div><div v-if="!tasks.length" class="empty">暂无待办事项</div></div>
    <div class="card"><div class="card-head"><div class="card-title">设备类别分布</div></div><CategoryBars :assets="activeAssets" /></div>
  </div></div>
</template>
