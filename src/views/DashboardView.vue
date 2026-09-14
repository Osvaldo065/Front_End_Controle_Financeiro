<template>
  <div class="relative min-h-screen overflow-hidden">

    <!-- Fundo -->
    <div
      class="fixed inset-0
             bg-gradient-to-br
             from-[hsl(146,28%,35%)]
             via-[hsl(146,30%,42%)]
             to-[hsl(146,38%,58%)]"
    ></div>

    <!-- Conteúdo -->
    <div
      class="relative z-10
             min-h-screen
             p-4
             pt-[88px]
             sm:p-6
             sm:pt-[96px]"
    >

      <!-- Cabeçalho -->
      <div
        class="max-w-6xl mx-auto mb-6
               flex flex-col sm:flex-row
               sm:items-center
               sm:justify-between
               gap-4"
      >
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-white">
            Painel
          </h1>

          <p class="text-sm text-white/70 mt-1">
            Visão geral das suas finanças.
          </p>
        </div>

        <!-- Filtros -->
        <div class="flex gap-2 text-sm">

          <select
            v-model.number="mes"
            @change="carregar"
            class="border border-white/30
                   rounded-lg
                   px-3 py-2
                   bg-white/95
                   text-ink
                   shadow-sm
                   focus:outline-none
                   focus:ring-2
                   focus:ring-white/50"
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
            class="border border-white/30
                   rounded-lg
                   px-3 py-2
                   bg-white/95
                   text-ink
                   shadow-sm
                   focus:outline-none
                   focus:ring-2
                   focus:ring-white/50"
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
        class="max-w-6xl mx-auto
               text-sm
               text-rust
               bg-white/95
               border border-red-100
               rounded-lg
               px-4 py-3
               mb-4"
      >
        {{ erro }}
      </p>

      <!-- Carregando -->
      <p
        v-if="carregando"
        class="text-sm
               text-white/80
               text-center
               py-8"
      >
        Carregando...
      </p>

      <!-- Dashboard -->
      <div
        v-else-if="dados"
        class="max-w-6xl mx-auto"
      >

        <!-- Cards financeiros -->
        <div
          class="grid
                 grid-cols-1
                 sm:grid-cols-3
                 gap-4
                 mb-8"
        >

          <!-- Saldo -->
          <div
            class="rounded-2xl
                   p-5
                   bg-white/95
                   backdrop-blur-sm
                   border border-white/30
                   shadow-lg"
          >
            <p
              class="text-xs
                     uppercase
                     tracking-wide
                     font-semibold
                     text-ink/50
                     mb-2"
            >
              Saldo atual
            </p>

            <p
              class="font-mono
                     text-xl
                     font-semibold"
              :class="
                dados.saldo_atual >= 0
                  ? 'text-[hsl(146,28%,35%)]'
                  : 'text-rust'
              "
            >
              {{ formatarMoeda(dados.saldo_atual) }}
            </p>
          </div>

          <!-- Receitas -->
          <div
            class="rounded-2xl
                   p-5
                   bg-white/95
                   backdrop-blur-sm
                   border border-white/30
                   shadow-lg"
          >
            <p
              class="text-xs
                     uppercase
                     tracking-wide
                     font-semibold
                     text-ink/50
                     mb-2"
            >
              Receitas
              ({{ dados.quantidade_receitas ?? '-' }})
            </p>

            <p
              class="font-mono
                     text-xl
                     font-semibold
                     text-[hsl(146,28%,35%)]"
            >
              {{ formatarMoeda(dados.total_receitas) }}
            </p>
          </div>

          <!-- Despesas -->
          <div
            class="rounded-2xl
                   p-5
                   bg-white/95
                   backdrop-blur-sm
                   border border-white/30
                   shadow-lg"
          >
            <p
              class="text-xs
                     uppercase
                     tracking-wide
                     font-semibold
                     text-ink/50
                     mb-2"
            >
              Despesas
              ({{ dados.quantidade_despesas ?? '-' }})
            </p>

            <p
              class="font-mono
                     text-xl
                     font-semibold
                     text-rust"
            >
              {{ formatarMoeda(dados.total_despesas) }}
            </p>
          </div>

        </div>

        <!-- Informações -->
        <div
          class="grid
                 grid-cols-1
                 md:grid-cols-2
                 gap-6
                 lg:gap-8"
        >

          <!-- Gastos por categoria -->
          <div>
            <h2
              class="text-sm
                     font-semibold
                     uppercase
                     tracking-wide
                     text-white/90
                     mb-3"
            >
              Gastos por categoria
            </h2>

            <ul
              v-if="gastosPorCategoria.length"
              class="divide-y
                     divide-line
                     border border-white/30
                     rounded-2xl
                     bg-white/95
                     backdrop-blur-sm
                     shadow-lg
                     overflow-hidden"
            >
              <li
                v-for="g in gastosPorCategoria"
                :key="g.id_categoria ?? g.categoria"
                class="flex
                       justify-between
                       items-center
                       gap-4
                       px-4
                       py-3
                       text-sm
                       hover:bg-[hsl(146,28%,35%)]/5
                       transition-colors"
              >
                <span class="text-ink">
                  {{ g.categoria ?? g.nome_categoria }}
                </span>

                <span
                  class="font-mono
                         font-medium
                         text-rust
                         whitespace-nowrap"
                >
                  {{ formatarMoeda(g.total ?? g.valor) }}
                </span>
              </li>
            </ul>

            <div
              v-else
              class="rounded-2xl
                     bg-white/95
                     border border-white/30
                     shadow-lg
                     px-4 py-8
                     text-center"
            >
              <p class="text-sm text-ink/50">
                Nenhum gasto no período.
              </p>
            </div>
          </div>

          <!-- Últimos lançamentos -->
          <div>
            <h2
              class="text-sm
                     font-semibold
                     uppercase
                     tracking-wide
                     text-white/90
                     mb-3"
            >
              Últimos lançamentos
            </h2>

            <ul
              v-if="ultimosLancamentos.length"
              class="divide-y
                     divide-line
                     border border-white/30
                     rounded-2xl
                     bg-white/95
                     backdrop-blur-sm
                     shadow-lg
                     overflow-hidden"
            >
              <li
                v-for="l in ultimosLancamentos"
                :key="l.id_lancamento"
                class="flex
                       justify-between
                       items-center
                       gap-4
                       px-4
                       py-3
                       text-sm
                       hover:bg-[hsl(146,28%,35%)]/5
                       transition-colors"
              >
                <span
                  class="text-ink
                         truncate"
                >
                  {{ l.descricao }}
                </span>

                <span
                  class="font-mono
                         font-medium
                         whitespace-nowrap"
                  :class="
                    l.tipo_transacao === 'Despesa'
                      ? 'text-rust'
                      : 'text-[hsl(146,28%,35%)]'
                  "
                >
                  {{ formatarMoeda(l.valor) }}
                </span>
              </li>
            </ul>

            <div
              v-else
              class="rounded-2xl
                     bg-white/95
                     border border-white/30
                     shadow-lg
                     px-4 py-8
                     text-center"
            >
              <p class="text-sm text-ink/50">
                Nenhum lançamento recente.
              </p>
            </div>
          </div>

        </div>

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
