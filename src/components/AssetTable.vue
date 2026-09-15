<script setup>
import StatusTag from './StatusTag.vue'
defineProps({ assets: { type: Array, required: true }, editable: { type: Boolean, default: false } })
defineEmits(['edit'])
</script>
<template>
  <table>
    <thead><tr><th>设备信息</th><th>编号</th><th>使用人 / 位置</th><th>状态</th><th v-if="editable">操作</th></tr></thead>
    <tbody>
      <tr v-for="asset in assets" :key="asset.id">
        <td><div class="asset-name">{{ asset.name }}</div><div class="muted">{{ asset.model }} · {{ asset.category }}</div></td>
        <td>{{ asset.id }}</td>
        <td>{{ asset.owner }}<div class="muted">{{ asset.location }}</div></td>
        <td><StatusTag :status="asset.status" /></td>
        <td v-if="editable"><button class="text-link" @click="$emit('edit', asset)">编辑</button></td>
      </tr>
      <tr v-if="!assets.length"><td :colspan="editable ? 5 : 4" class="empty">没有符合条件的设备</td></tr>
    </tbody>
  </table>
</template>
