<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="fixed inset-0 bg-gradient-to-br from-[hsl(146,28%,35%)] via-[hsl(146,30%,42%)] to-[hsl(146,38%,58%)]"></div>

    <div class="relative z-10 min-h-screen px-4 py-5 pt-[88px] sm:px-6 sm:py-6 sm:pt-[96px]">
      <div class="max-w-6xl mx-auto mb-6">
        <h1 class="text-xl sm:text-2xl font-semibold text-white">Análise detalhada</h1>
        <p class="mt-1 text-sm text-white/75">Acompanhe a distribuição dos seus gastos por categoria.</p>
      </div>

      <p v-if="erro" class="max-w-6xl mx-auto mb-4 rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm text-rust">
        {{ erro }}
      </p>

      <div v-if="carregando" class="py-10 text-center text-sm text-white/80">Carregando análise...</div>

      <template v-else>
        <section class="max-w-6xl mx-auto mb-8">
          <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Gastos por categoria</h2>

          <div v-if="gastosPorCategoria.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="gasto in gastosPorCategoria" :key="gasto.chave" class="rounded-2xl border border-white/30 bg-white/95 p-5 shadow-lg backdrop-blur-sm">
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm font-medium text-ink">{{ gasto.nome }}</p>
                <span class="rounded-full bg-[hsl(146,28%,35%)]/10 px-2.5 py-1 text-xs font-semibold text-[hsl(146,28%,35%)]">
                  {{ formatarPercentual(gasto.percentual) }}
                </span>
              </div>
              <p class="mt-4 font-mono text-xl font-semibold text-rust">{{ formatarMoeda(gasto.valor) }}</p>
              <div class="mt-4 h-2 overflow-hidden rounded-full bg-[hsl(146,28%,35%)]/10">
                <div class="h-full rounded-full bg-[hsl(146,28%,35%)] transition-all" :style="{ width: `${Math.min(gasto.percentual, 100)}%` }"></div>
              </div>
            </article>
          </div>

          <div v-else class="rounded-2xl border border-white/30 bg-white/95 px-4 py-10 text-center text-sm text-ink/50 shadow-lg">
            Nenhum gasto por categoria encontrado.
          </div>
        </section>

        <section class="max-w-6xl mx-auto">
          <div class="mb-3 flex items-center justify-between gap-4">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-white/90">Seus lançamentos</h2>
            <router-link to="/lancamentos/novo" class="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[hsl(146,28%,35%)] shadow-sm transition hover:bg-white/90">
              Novo lançamento
            </router-link>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-white/30 bg-white/95 shadow-lg backdrop-blur-sm">
            <table class="w-full min-w-[680px] text-sm">
              <thead class="bg-[hsl(146,28%,35%)] text-white">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold">Descrição</th>
                  <th class="px-4 py-3 text-left font-semibold">Categoria</th>
                  <th class="px-4 py-3 text-left font-semibold">Data</th>
                  <th class="px-4 py-3 text-left font-semibold">Tipo</th>
                  <th class="px-4 py-3 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                <tr v-for="lancamento in lancamentos" :key="lancamento.id_lancamento" class="transition-colors hover:bg-[hsl(146,28%,35%)]/5">
                  <td class="max-w-[260px] px-4 py-3 text-ink"><span class="block truncate">{{ lancamento.descricao ?? '-' }}</span></td>
                  <td class="px-4 py-3 text-ink/80">{{ lancamento.categoria ?? lancamento.nome_categoria ?? '-' }}</td>
                  <td class="whitespace-nowrap px-4 py-3 font-mono text-ink/70">{{ formatarData(lancamento.data_lancamento) }}</td>
                  <td class="px-4 py-3 text-ink/80">{{ lancamento.tipo_transacao ?? '-' }}</td>
                  <td class="whitespace-nowrap px-4 py-3 text-right font-mono font-medium" :class="lancamento.tipo_transacao === 'Despesa' ? 'text-rust' : 'text-[hsl(146,28%,35%)]'">
                    {{ formatarMoeda(lancamento.valor) }}
                  </td>
                </tr>
                <tr v-if="!lancamentos.length">
                  <td colspan="5" class="px-4 py-12 text-center text-ink/50">Nenhum lançamento encontrado.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/api'
import { getUserId } from '../stores/auth'

const gastos = ref([])
const lancamentos = ref([])
const carregando = ref(false)
const erro = ref('')

const gastosPorCategoria = computed(() => {
  const total = gastos.value.reduce((soma, gasto) => soma + Number(gasto.total ?? gasto.valor ?? gasto.valor_total ?? 0), 0)

  return gastos.value.map((gasto, indice) => {
    const valor = Number(gasto.total ?? gasto.valor ?? gasto.valor_total ?? 0)
    const percentualInformado = gasto.percentual ?? gasto.porcentagem
    return {
      chave: gasto.id_categoria ?? gasto.categoria ?? gasto.nome_categoria ?? indice,
      nome: gasto.categoria ?? gasto.nome_categoria ?? 'Sem categoria',
      valor,
      percentual: percentualInformado !== undefined && percentualInformado !== null
        ? Number(percentualInformado)
        : total ? (valor / total) * 100 : 0
    }
  })
})

function formatarMoeda(valor) {
  return Number(valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarPercentual(valor) {
  return `${Number(valor ?? 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

function formatarData(data) {
  if (!data) return '-'
  const dataFormatada = new Date(data)
  return Number.isNaN(dataFormatada.getTime()) ? data : dataFormatada.toLocaleDateString('pt-BR')
}

function extrairLista(resposta) {
  if (Array.isArray(resposta)) return resposta
  return resposta?.items ?? resposta?.data?.dados ?? resposta?.data ?? resposta?.dados ?? []
}

async function carregar() {
  carregando.value = true
  erro.value = ''
  const idUsuario = getUserId()

  try {
    const [gastosResposta, lancamentosResposta] = await Promise.all([
      api.get('/obter_gastos_por_categoria', { params: { id_usuario: idUsuario } }),
      api.get('/lancamentos', { params: { id_usuario: idUsuario } })
    ])

    gastos.value = extrairLista(gastosResposta.data)
    lancamentos.value = extrairLista(lancamentosResposta.data)
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível carregar a análise detalhada.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)
</script>
