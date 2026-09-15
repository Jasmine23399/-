// 演示数据、浏览器本地存储与共享工具
const seedAssets = [
  {id:'GD-IT-001',name:'联想台式电脑',model:'ThinkCentre M720',category:'电脑',owner:'张老师',department:'网络实验室',location:'实验楼 A305',date:'2021-09-12',status:'在用',repairs:1},
  {id:'GD-IT-002',name:'戴尔台式电脑',model:'OptiPlex 7090',category:'电脑',owner:'李老师',department:'网络实验室',location:'实验楼 A305',date:'2022-03-18',status:'在用',repairs:0},
  {id:'GD-IT-003',name:'联想台式电脑',model:'ThinkCentre M720',category:'电脑',owner:'张老师',department:'网络实验室',location:'实验楼 A305',date:'2021-09-12',status:'在用',repairs:2},
  {id:'GD-IT-004',name:'华为显示器',model:'MateView 23.8',category:'显示器',owner:'张老师',department:'网络实验室',location:'实验楼 A305',date:'2023-05-08',status:'在用',repairs:0},
  {id:'GD-IT-005',name:'惠普打印机',model:'LaserJet Pro',category:'打印机',owner:'王老师',department:'办公室',location:'实验楼 A302',date:'2019-06-20',status:'待维修',repairs:3},
  {id:'GD-IT-006',name:'网络交换机',model:'S5735S',category:'网络设备',owner:'设备管理员',department:'网络实验室',location:'实验楼 A305',date:'2020-11-04',status:'在用',repairs:0},
];
const seedTransfers=[{id:'TR-2026-001',assetId:'GD-IT-004',from:'张老师',to:'李老师',reason:'教学项目调整',status:'待审批',date:'2026-09-15'}];
const seedDisposals=[{id:'DP-2026-001',assetId:'GD-IT-005',reason:'故障频繁，维修成本较高',method:'报废回收',status:'待审批',date:'2026-09-15'}];
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const state={assets:load('demo-assets',seedAssets),transfers:load('demo-transfers',seedTransfers),disposals:load('demo-disposals',seedDisposals),counts:load('demo-counts',[]),page:'overview',search:'',filter:'全部',photo:null,photoName:'',countCategory:'电脑',detected:null};
const save=()=>{localStorage.setItem('demo-assets',JSON.stringify(state.assets));localStorage.setItem('demo-transfers',JSON.stringify(state.transfers));localStorage.setItem('demo-disposals',JSON.stringify(state.disposals));localStorage.setItem('demo-counts',JSON.stringify(state.counts))};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=id=>state.assets.find(x=>x.id===id);
const badge=s=>`<span class="tag ${s==='待审批'||s==='待维修'?'orange':s==='已驳回'||s==='已报废'?'red':s==='已通过'?'blue':''}">${esc(s)}</span>`;
const navItems=[['overview','▦','总览'],['assets','▤','设备台账'],['transfers','⇄','转移审批'],['disposals','♻','报废清理'],['count','◎','智能清点'],['advice','✦','生命周期建议'],['reports','▥','统计报表']];
const activeAssets=()=>state.assets.filter(a=>a.status!=='已报废');
