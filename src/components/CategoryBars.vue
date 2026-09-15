<script setup>
import { computed } from 'vue'
const props = defineProps({ assets: { type: Array, required: true } })
const bars = computed(() => {
  const counts = {}
  props.assets.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1 })
  const max = Math.max(1, ...Object.values(counts))
  return Object.entries(counts).map(([name, count]) => ({ name, count, width: `${count / max * 100}%` }))
})
</script>
<template>
  <div v-for="bar in bars" :key="bar.name" class="bar-row"><span>{{ bar.name }}</span><div class="bar"><i :style="{ width: bar.width }"></i></div><b>{{ bar.count }}</b></div>
  <div v-if="!bars.length" class="empty">暂无在册设备</div>
</template>
