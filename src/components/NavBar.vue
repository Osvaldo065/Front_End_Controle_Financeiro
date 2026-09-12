<template>
  <header class="border-b border-line bg-paper">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <span class="font-semibold text-ledger tracking-tight">Controle Financeiro</span>
      <nav class="flex items-center gap-6 text-sm">
        <router-link
          to="/dashboard"
          class="hover:text-ledger"
          :class="{ 'text-ledger font-medium': route.name === 'dashboard' }"
        >
          Painel
        </router-link>
        <router-link
          to="/lancamentos"
          class="hover:text-ledger"
          :class="{ 'text-ledger font-medium': route.name && route.name.toString().startsWith('lancamento') }"
        >
          Lançamentos
        </router-link>
        <button @click="sair" class="text-rust hover:underline">Sair</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { clearAuth } from '../stores/auth'

const route = useRoute()
const router = useRouter()

function sair() {
  clearAuth()
  router.push({ name: 'login' })
}
</script>
