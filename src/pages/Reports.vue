<script setup>
import { computed } from 'vue'
import { store, activeAssets } from '../store'
import CategoryBars from '../components/CategoryBars.vue'
defineEmits(['navigate', 'notify'])
const stats = computed(() => [
  ['在册设备', activeAssets.value.length, '▤', '未报废'],
  ['在用设备', activeAssets.value.filter(x => x.status === '在用').length, '◉', '正常使用'],
  ['待维修设备', activeAssets.value.filter(x => x.status === '待维修').length, '⚒', '需要跟进'],
  ['已报废设备', store.assets.filter(x => x.status === '已报废').length, '♻', '完成审批'],
])
</script>
<template>
  <p class="section-intro">查看当前设备数量、状态、类别和清点情况，帮助管理员掌握整体情况。</p>
  <div class="stats"><div v-for="s in stats" :key="s[0]" class="stat"><div><div class="stat-label">{{ s[0] }}</div><div class="stat-value">{{ s[1] }}</div><div class="stat-foot">{{ s[3] }}</div></div><div class="stat-icon">{{ s[2] }}</div></div></div>
  <div class="grid-2"><div class="card"><div class="card-head"><div class="card-title">设备类别</div></div><CategoryBars :assets="activeAssets" /></div><div class="card"><div class="card-head"><div class="card-title">清点记录</div></div><div v-for="(item,index) in store.counts" :key="index" class="activity"><span class="dot"></span><div><strong>{{ item.category }} · {{ item.date }}</strong><p>台账 {{ item.expected }} / 照片 {{ item.detected }} / 差异 {{ Math.abs(item.expected - item.detected) }}</p></div></div><div v-if="!store.counts.length" class="empty">暂无清点记录</div></div></div>
</template>
