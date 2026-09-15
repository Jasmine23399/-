<script setup>
import { ref, computed } from 'vue'
import Overview from './pages/Overview.vue'
import Assets from './pages/Assets.vue'
import Transfers from './pages/Transfers.vue'
import Disposals from './pages/Disposals.vue'
import Count from './pages/Count.vue'
import Advice from './pages/Advice.vue'
import Reports from './pages/Reports.vue'

const items = [
  { key: 'overview', icon: '▦', label: '总览', title: '设备管理总览', component: Overview },
  { key: 'assets', icon: '▤', label: '设备台账', title: '设备台账', component: Assets },
  { key: 'transfers', icon: '⇄', label: '转移审批', title: '转移审批', component: Transfers },
  { key: 'disposals', icon: '♻', label: '报废清理', title: '报废清理', component: Disposals },
  { key: 'count', icon: '◎', label: '智能清点', title: '智能清点', component: Count },
  { key: 'advice', icon: '✦', label: '生命周期建议', title: '生命周期建议', component: Advice },
  { key: 'reports', icon: '▥', label: '统计报表', title: '统计报表', component: Reports },
]
const page = ref('overview')
const current = computed(() => items.find(i => i.key === page.value))
const message = ref('')
let toastTimer
function navigate(key) { page.value = key; window.scrollTo(0, 0) }
function notify(text) { message.value = text; clearTimeout(toastTimer); toastTimer = setTimeout(() => message.value = '', 2800) }
</script>
<template>
  <div class="app">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">◈</span><div><strong>智管设备</strong><small>智能设备管理系统</small></div></div>
      <div class="side-label">工作台</div>
      <nav><button v-for="item in items" :key="item.key" :class="{ active: page === item.key }" @click="navigate(item.key)"><span class="nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span></button></nav>
      <div class="sidebar-bottom"><div class="avatar">彭</div><div><strong>设备管理员</strong><small>高校实验室 · 演示账号</small></div></div>
    </aside>
    <main class="main">
      <header class="topbar"><div><span class="breadcrumb">工作台 / {{ current.label }}</span><h1>{{ current.title }}</h1></div><div class="top-actions"><span class="demo-badge">前端演示版</span><button class="icon-btn" title="通知" @click="notify('演示版暂无消息中心')">♧</button></div></header>
      <component :is="current.component" @navigate="navigate" @notify="notify" />
    </main>
  </div>
  <div class="toast" :class="{ show: message }">{{ message }}</div>
</template>
