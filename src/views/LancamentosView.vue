<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-ledger">Lançamentos</h1>
      <router-link
        to="/lancamentos/novo"
        class="bg-ledger text-white rounded px-3 py-2 text-sm font-medium"
      >
        + Novo lançamento
      </router-link>
    </div>

    <div class="flex flex-wrap gap-2 mb-4 text-sm">
      <select v-model.number="filtros.mes" @change="carregar" class="border border-line rounded px-2 py-1 bg-white">
        <option :value="null">Mês (todos)</option>
        <option v-for="m in 12" :key="m" :value="m">{{ nomeMes(m) }}</option>
      </select>
      <select v-model.number="filtros.ano" @change="carregar" class="border border-line rounded px-2 py-1 bg-white">
        <option :value="null">Ano (todos)</option>
        <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
      </select>
      <select v-model="filtros.tipo_transacao" @change="carregar" class="border border-line rounded px-2 py-1 bg-white">
        <option :value="null">Tipo (todos)</option>
        <option value="Receita">Receita</option>
        <option value="Despesa">Despesa</option>
      </select>
    </div>

    <p v-if="erro" class="text-sm text-rust mb-4">{{ erro }}</p>
    <p v-if="carregando" class="text-sm text-ink/60">Carregando...</p>

    <table v-else class="w-full text-sm border border-line rounded overflow-hidden bg-white">
      <thead class="bg-line/30 text-left">
        <tr>
          <th class="px-3 py-2">Descrição</th>
          <th class="px-3 py-2">Categoria</th>
          <th class="px-3 py-2">Data</th>
          <th class="px-3 py-2 text-right">Valor</th>
          <th class="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line">
        <tr v-for="l in lancamentos" :key="l.id_lancamento">
          <td class="px-3 py-2">{{ l.descricao }}</td>
          <td class="px-3 py-2">{{ l.id_categoria ?? l.nome_categoria ?? '-' }}</td>
          <td class="px-3 py-2 font-mono">{{ formatarData(l.data_lancamento) }}</td>
          <td
            class="px-3 py-2 text-right font-mono"
            :class="l.tipo_transacao === 'Despesa' ? 'text-rust' : 'text-ledger'"
          >
            {{ formatarMoeda(l.valor) }}
          </td>
          <td class="px-3 py-2 text-right whitespace-nowrap">
            <router-link :to="`/lancamentos/${l.id_lancamento}/editar`" class="text-ledger hover:underline mr-3">Editar</router-link>
            <button @click="remover(l.id_lancamento)" class="text-rust hover:underline">Excluir</button>
          </td>
        </tr>
        <tr v-if="!lancamentos.length">
          <td colspan="5" class="px-3 py-6 text-center text-ink/50">Nenhum lançamento encontrado.</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between items-center mt-4 text-sm">
      <button
        :disabled="pagina <= 1"
        @click="mudarPagina(pagina - 1)"
        class="px-3 py-1 border border-line rounded disabled:opacity-40"
      >
        Anterior
      </button>
      <span>Página {{ pagina }}</span>
      <button
        :disabled="lancamentos.length < tamanhoPagina"
        @click="mudarPagina(pagina + 1)"
        class="px-3 py-1 border border-line rounded disabled:opacity-40"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../services/api'

const hoje = new Date()
const anos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1]

const filtros = reactive({
  mes: null,
  ano: null,
  tipo_transacao: null
})

const lancamentos = ref([])
const pagina = ref(1)
const tamanhoPagina = 10
const carregando = ref(false)
const erro = ref('')

function nomeMes(m) {
  return new Date(2000, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long' })
}

function formatarMoeda(valor) {
  const n = Number(valor ?? 0)
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data) {
  if (!data) return '-'
  const d = new Date(data)
  return isNaN(d) ? data : d.toLocaleDateString('pt-BR')
}

async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const { data } = await api.get('/lancamentos', {
      params: {
        mes: filtros.mes,
        ano: filtros.ano,
        tipo_transacao: filtros.tipo_transacao,
        page: pagina.value,
        size: tamanhoPagina
      }
    })
    // NOTA: se a resposta paginada vier dentro de um envelope
    // (ex: { items: [...], total: N }), ajuste para data.items aqui.
    lancamentos.value = Array.isArray(data) ? data : data.items || []
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível carregar os lançamentos.'
  } finally {
    carregando.value = false
  }
}

function mudarPagina(novaPagina) {
  if (novaPagina < 1) return
  pagina.value = novaPagina
  carregar()
}

async function remover(id_lancamento) {
  if (!confirm('Excluir este lançamento?')) return
  try {
    await api.delete(`/lancamentos/${id_lancamento}`)
    carregar()
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível excluir o lançamento.'
  }
}

onMounted(carregar)
</script>
