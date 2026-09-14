<template>
  <div
    class="rounded-2xl p-4 sm:p-6 -m-4 sm:-m-6 min-h-screen
           bg-gradient-to-br
           from-[hsl(146,28%,35%)]
           via-[hsl(146,30%,42%)]
           to-[hsl(146,38%,58%)]"
  >

    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 class="text-xl font-semibold text-white">
        Painel
      </h1>

      <div class="flex gap-2 text-sm">
        <select
          v-model.number="mes"
          @change="carregar"
          class="border border-white/20 rounded-lg px-3 py-2
                 bg-white/90 text-ink
                 shadow-sm
                 focus:outline-none
                 focus:ring-2
                 focus:ring-white/40"
        >
          <option
            v-for="m in 12"
            :key="m"
            :value="m"
          >
            {{ nomeMes(m) }}
          </option>
        </select>

        <select
          v-model.number="ano"
          @change="carregar"
          class="border border-white/20 rounded-lg px-3 py-2
                 bg-white/90 text-ink
                 shadow-sm
                 focus:outline-none
                 focus:ring-2
                 focus:ring-white/40"
        >
          <option
            v-for="a in anos"
            :key="a"
            :value="a"
          >
            {{ a }}
          </option>
        </select>
      </div>
    </div>

    <!-- Erro -->
    <p
      v-if="erro"
      class="text-sm text-white bg-red-500/70 rounded-lg px-3 py-2 mb-4"
    >
      {{ erro }}
    </p>

    <!-- Carregando -->
    <p
      v-if="carregando"
      class="text-sm text-white/80 mb-4"
    >
      Carregando...
    </p>

    <!-- Cards financeiros -->
    <div
      v-else-if="dados"
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
    >

      <!-- SALDO -->
      <div
        class="relative overflow-hidden rounded-2xl p-5
               bg-gradient-to-br
               from-[hsl(146,28%,35%)]
               via-[hsl(146,31%,41%)]
               to-[hsl(146,36%,50%)]
               border border-white/20
               shadow-lg shadow-black/15
               transition-all duration-300
               hover:-translate-y-1
               hover:shadow-xl"
      >
        <!-- detalhe decorativo -->
        <div
          class="absolute -right-10 -top-10
                 w-32 h-32 rounded-full
                 bg-white/10"
        ></div>

        <div
          class="absolute -right-16 -bottom-16
                 w-36 h-36 rounded-full
                 bg-white/5"
        ></div>

        <div class="relative">
          <p class="text-white/75 text-xs uppercase tracking-wider mb-2">
            Saldo atual
          </p>

          <p
            class="font-mono text-2xl font-semibold"
            :class="
              dados.saldo_atual >= 0
                ? 'text-white'
                : 'text-red-100'
            "
          >
            {{ formatarMoeda(dados.saldo_atual) }}
          </p>
        </div>
      </div>

      <!-- RECEITAS -->
      <div
        class="relative overflow-hidden rounded-2xl p-5
               bg-gradient-to-br
               from-[hsl(146,28%,35%)]
               via-[hsl(146,33%,44%)]
               to-[hsl(146,40%,55%)]
               border border-white/20
               shadow-lg shadow-black/15
               transition-all duration-300
               hover:-translate-y-1
               hover:shadow-xl"
      >
        <div
          class="absolute -right-10 -top-10
                 w-32 h-32 rounded-full
                 bg-white/10"
        ></div>

        <div
          class="absolute -right-16 -bottom-16
                 w-36 h-36 rounded-full
                 bg-white/5"
        ></div>

        <div class="relative">
          <p class="text-white/75 text-xs uppercase tracking-wider mb-2">
            Receitas ({{ dados.quantidade_receitas ?? '-' }})
          </p>

          <p class="font-mono text-2xl font-semibold text-white">
            {{ formatarMoeda(dados.total_receitas) }}
          </p>
        </div>
      </div>

      <!-- DESPESAS -->
      <div
        class="relative overflow-hidden rounded-2xl p-5
               bg-gradient-to-br
               from-[hsl(146,28%,35%)]
               via-[hsl(146,30%,40%)]
               to-[hsl(146,35%,48%)]
               border border-white/20
               shadow-lg shadow-black/15
               transition-all duration-300
               hover:-translate-y-1
               hover:shadow-xl"
      >
        <div
          class="absolute -right-10 -top-10
                 w-32 h-32 rounded-full
                 bg-white/10"
        ></div>

        <div
          class="absolute -right-16 -bottom-16
                 w-36 h-36 rounded-full
                 bg-white/5"
        ></div>

        <div class="relative">
          <p class="text-white/75 text-xs uppercase tracking-wider mb-2">
            Despesas ({{ dados.quantidade_despesas ?? '-' }})
          </p>

          <p class="font-mono text-2xl font-semibold text-white">
            {{ formatarMoeda(dados.total_despesas) }}
          </p>
        </div>
      </div>

    </div>

    <!-- Áreas inferiores -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

      <!-- GASTOS POR CATEGORIA -->
      <div>
        <h2
          class="text-sm font-semibold uppercase
                 tracking-wide text-white/90 mb-3"
        >
          Gastos por categoria
        </h2>

        <ul
          v-if="gastosPorCategoria.length"
          class="divide-y divide-black/5
                 border border-white/30
                 rounded-2xl
                 bg-white/95
                 shadow-lg
                 overflow-hidden"
        >
          <li
            v-for="g in gastosPorCategoria"
            :key="g.id_categoria ?? g.categoria"
            class="flex justify-between items-center
                   px-4 py-3
                   text-sm
                   transition-colors
                   hover:bg-white"
          >
            <span class="text-ink font-medium">
              {{ g.categoria ?? g.nome_categoria }}
            </span>

            <span class="font-mono text-rust font-medium">
              {{ formatarMoeda(g.total ?? g.valor) }}
            </span>
          </li>
        </ul>

        <p
          v-else
          class="text-sm text-white/70"
        >
          Nenhum gasto no período.
        </p>
      </div>

      <!-- ÚLTIMOS LANÇAMENTOS -->
      <div>
        <h2
          class="text-sm font-semibold uppercase
                 tracking-wide text-white/90 mb-3"
        >
          Últimos lançamentos
        </h2>

        <ul
          v-if="ultimosLancamentos.length"
          class="divide-y divide-black/5
                 border border-white/30
                 rounded-2xl
                 bg-white/95
                 shadow-lg
                 overflow-hidden"
        >
          <li
            v-for="l in ultimosLancamentos"
            :key="l.id_lancamento"
            class="flex justify-between items-center
                   px-4 py-3
                   text-sm
                   transition-colors
                   hover:bg-white"
          >
            <span class="text-ink font-medium">
              {{ l.descricao }}
            </span>

            <span
              class="font-mono font-medium"
              :class="
                l.tipo_transacao === 'Despesa'
                  ? 'text-rust'
                  : 'text-ledger'
              "
            >
              {{ formatarMoeda(l.valor) }}
            </span>
          </li>
        </ul>

        <p
          v-else
          class="text-sm text-white/70"
        >
          Nenhum lançamento recente.
        </p>
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
