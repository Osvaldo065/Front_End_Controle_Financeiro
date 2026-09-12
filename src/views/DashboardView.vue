<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-ledger">Painel</h1>
      <div class="flex gap-2 text-sm">
        <select v-model.number="mes" @change="carregar" class="border border-line rounded px-2 py-1 bg-white">
          <option v-for="m in 12" :key="m" :value="m">{{ nomeMes(m) }}</option>
        </select>
        <select v-model.number="ano" @change="carregar" class="border border-line rounded px-2 py-1 bg-white">
          <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </div>

    <p v-if="erro" class="text-sm text-rust mb-4">{{ erro }}</p>
    <p v-if="carregando" class="text-sm text-ink/60">Carregando...</p>

    <div v-else-if="dados" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="border border-line rounded bg-white p-4">
        <p class="text-xs uppercase text-ink/50 mb-1">Saldo atual</p>
        <p class="font-mono text-lg" :class="dados.saldo_atual >= 0 ? 'text-ledger' : 'text-rust'">
          {{ formatarMoeda(dados.saldo_atual) }}
        </p>
      </div>
      <div class="border border-line rounded bg-white p-4">
        <p class="text-xs uppercase text-ink/50 mb-1">Receitas ({{ dados.quantidade_receitas ?? '-' }})</p>
        <p class="font-mono text-lg text-ledger">{{ formatarMoeda(dados.total_receitas) }}</p>
      </div>
      <div class="border border-line rounded bg-white p-4">
        <p class="text-xs uppercase text-ink/50 mb-1">Despesas ({{ dados.quantidade_despesas ?? '-' }})</p>
        <p class="font-mono text-lg text-rust">{{ formatarMoeda(dados.total_despesas) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 class="text-sm font-semibold uppercase text-ink/60 mb-3">Gastos por categoria</h2>
        <ul v-if="gastosPorCategoria.length" class="divide-y divide-line border border-line rounded bg-white">
          <li v-for="g in gastosPorCategoria" :key="g.id_categoria ?? g.categoria" class="flex justify-between px-3 py-2 text-sm">
            <span>{{ g.categoria ?? g.nome_categoria }}</span>
            <span class="font-mono text-rust">{{ formatarMoeda(g.total ?? g.valor) }}</span>
          </li>
        </ul>
        <p v-else class="text-sm text-ink/50">Nenhum gasto no período.</p>
      </div>

      <div>
        <h2 class="text-sm font-semibold uppercase text-ink/60 mb-3">Últimos lançamentos</h2>
        <ul v-if="ultimosLancamentos.length" class="divide-y divide-line border border-line rounded bg-white">
          <li v-for="l in ultimosLancamentos" :key="l.id" class="flex justify-between px-3 py-2 text-sm">
            <span>{{ l.descricao }}</span>
            <span class="font-mono" :class="l.tipo_transacao === 'DESPESA' ? 'text-rust' : 'text-ledger'">
              {{ formatarMoeda(l.valor) }}
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-ink/50">Nenhum lançamento recente.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const hoje = new Date()
const mes = ref(hoje.getMonth() + 1)
const ano = ref(hoje.getFullYear())
const anos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1]

const dados = ref(null)
const gastosPorCategoria = ref([])
const carregando = ref(false)
const erro = ref('')

function nomeMes(m) {
  return new Date(2000, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long' })
}

function formatarMoeda(valor) {
  const n = Number(valor ?? 0)
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const [dashboardRes, gastosRes] = await Promise.all([
      api.get('/dashboard', { params: { mes: mes.value, ano: ano.value } }),
      api.get('/dashboard/gastos-por-categoria', { params: { mes: mes.value, ano: ano.value } })
    ])
    dados.value = dashboardRes.data
    gastosPorCategoria.value = gastosRes.data || []
    // NOTA: ajuste "ultimos_lancamentos" para o nome do campo do seu
    // DashboardResponse que traz a lista de últimos lançamentos.
    ultimosLancamentos.value = dashboardRes.data?.ultimos_lancamentos || []
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível carregar o painel.'
  } finally {
    carregando.value = false
  }
}

const ultimosLancamentos = ref([])

onMounted(carregar)
</script>
