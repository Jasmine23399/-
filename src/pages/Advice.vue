<script setup>
import { computed } from 'vue'
import { activeAssets } from '../store'
import StatusTag from '../components/StatusTag.vue'
defineEmits(['navigate', 'notify'])
const suggestions = computed(() => activeAssets.value.map(a => {
  const years = new Date().getFullYear() - Number(a.date.slice(0, 4))
  const action = a.repairs >= 3 || years >= 7 ? '建议评估报废' : years >= 5 || a.repairs >= 2 ? '建议检查或更新' : '建议继续使用'
  const detail = action === '建议评估报废' ? '建议核实故障状况与维修成本，再决定是否发起报废申请。' : action === '建议检查或更新' ? '建议检查性能是否满足当前教学任务，必要时安排维修或更新。' : '现有数据未显示明显更新需求，按计划继续巡检。'
  return { ...a, years, action, detail }
}))
</script>
<template>
  <p class="section-intro">根据购买日期和维修次数展示生命周期辅助判断。后续可接入大模型，结合性能、用途和维修文本给出更细的建议。</p>
  <div class="note" style="margin-bottom:18px">当前建议由演示规则生成，并非 AI 推理或自动审批结论。设备是否报废仍须由管理员核实并走审批流程。</div>
  <div class="grid-2"><div class="card"><div class="card-head"><div class="card-title">设备建议列表</div></div><div v-for="a in suggestions" :key="a.id" class="recommend"><div class="recommend-top"><div><strong>{{ a.name }}</strong><div class="mini">{{ a.id }} · 使用约 {{ a.years }} 年 · 维修 {{ a.repairs }} 次</div></div><StatusTag :status="a.action === '建议继续使用' ? '在用' : a.action === '建议检查或更新' ? '待维修' : '待审批'" /></div><p>{{ a.action }}。{{ a.detail }}</p></div></div>
  <div class="card"><div class="card-head"><div class="card-title">建议依据</div></div><div class="activity"><span class="dot"></span><div><strong>购买时间</strong><p>用于估算设备已使用年限</p></div></div><div class="activity"><span class="dot"></span><div><strong>维修记录</strong><p>演示数据中的维修次数参与判断</p></div></div><div class="activity"><span class="dot"></span><div><strong>后续 AI 扩展</strong><p>加入性能参数、维修文本与使用场景，生成可解释的辅助建议</p></div></div></div></div>
</template>
