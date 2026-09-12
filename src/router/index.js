import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import LancamentosView from '../views/LancamentosView.vue'
import LancamentoFormView from '../views/LancamentoFormView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  { path: '/cadastro', name: 'cadastro', component: RegisterView, meta: { public: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/lancamentos', name: 'lancamentos', component: LancamentosView },
  { path: '/lancamentos/novo', name: 'lancamento-novo', component: LancamentoFormView },
  { path: '/lancamentos/:id/editar', name: 'lancamento-editar', component: LancamentoFormView, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de rota: exige login em tudo, exceto rotas marcadas como públicas
router.beforeEach((to) => {
  if (!to.meta.public && !isAuthenticated()) {
    return { name: 'login' }
  }
  if (to.meta.public && isAuthenticated() && to.name === 'login') {
    return { name: 'dashboard' }
  }
  return true
})

export default router
