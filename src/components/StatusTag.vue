<script setup>
defineProps({ status: { type: String, required: true } })
</script>
<template>
  <span class="tag" :class="{ orange: ['待审批','待维修'].includes(status), red: ['已驳回','已报废'].includes(status), blue: status === '已通过', gray: status === '闲置' }">{{ status }}</span>
</template>
