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
            Lançamentos
          </h1>

          <p class="text-sm text-white/70 mt-1">
            Consulte e gerencie seus lançamentos financeiros.
          </p>
        </div>

        <!-- Novo lançamento -->
        <router-link
          to="/lancamentos/novo"
          class="w-full sm:w-auto
                 inline-flex items-center justify-center
                 gap-2
                 px-4 py-2.5
                 rounded-lg
                 bg-white
                 text-[hsl(146,28%,35%)]
                 text-sm font-semibold
                 shadow-md
                 transition-all duration-200
                 hover:bg-white/90
                 hover:shadow-lg
                 hover:-translate-y-0.5
                 active:translate-y-0"
        >
          <span class="text-lg leading-none">+</span>
          Novo lançamento
        </router-link>
      </div>

      <!-- Filtros -->
      <div
        class="max-w-6xl mx-auto
               bg-white/95
               backdrop-blur-sm
               border border-white/30
               rounded-2xl
               shadow-lg
               p-4
               mb-5"
      >
        <div class="flex flex-col sm:flex-row gap-3">

          <!-- Mês -->
          <div class="flex-1">
            <label
              class="block text-xs font-medium text-ink/60 uppercase mb-1.5"
            >
              Mês
            </label>

            <select
              v-model.number="filtros.mes"
              @change="carregar"
              class="w-full
                     border border-line
                     rounded-lg
                     px-3 py-2.5
                     bg-white
                     text-sm text-ink
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            >
              <option :value="null">Todos os meses</option>

              <option
                v-for="m in 12"
                :key="m"
                :value="m"
              >
                {{ nomeMes(m) }}
              </option>
            </select>
          </div>

          <!-- Ano -->
          <div class="flex-1">
            <label
              class="block text-xs font-medium text-ink/60 uppercase mb-1.5"
            >
              Ano
            </label>

            <select
              v-model.number="filtros.ano"
              @change="carregar"
              class="w-full
                     border border-line
                     rounded-lg
                     px-3 py-2.5
                     bg-white
                     text-sm text-ink
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            >
              <option :value="null">Todos os anos</option>

              <option
                v-for="a in anos"
                :key="a"
                :value="a"
              >
                {{ a }}
              </option>
            </select>
          </div>

          <!-- Tipo -->
          <div class="flex-1">
            <label
              class="block text-xs font-medium text-ink/60 uppercase mb-1.5"
            >
              Tipo
            </label>

            <select
              v-model="filtros.tipo_transacao"
              @change="carregar"
              class="w-full
                     border border-line
                     rounded-lg
                     px-3 py-2.5
                     bg-white
                     text-sm text-ink
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            >
              <option :value="null">Todos os tipos</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Erro -->
      <p
        v-if="erro"
        class="max-w-6xl mx-auto
               text-sm text-rust
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
        class="text-sm text-white/80 text-center py-8"
      >
        Carregando...
      </p>

      <!-- Tabela -->
      <div
        v-else
        class="max-w-6xl mx-auto
               bg-white/95
               backdrop-blur-sm
               border border-white/30
               rounded-2xl
               shadow-lg
               overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px] text-sm">

            <thead
              class="bg-[hsl(146,28%,35%)]
                     text-white"
            >
              <tr>
                <th class="px-4 py-3 text-left font-semibold">
                  Descrição
                </th>

                <th class="px-4 py-3 text-left font-semibold">
                  Categoria
                </th>

                <th class="px-4 py-3 text-left font-semibold">
                  Data
                </th>

                <th class="px-4 py-3 text-right font-semibold">
                  Valor
                </th>

                <th class="px-4 py-3 text-right font-semibold">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-line">

              <tr
                v-for="l in lancamentos"
                :key="l.id_lancamento"
                class="hover:bg-[hsl(146,28%,35%)]/5
                       transition-colors"
              >
                <td class="px-4 py-3 text-ink">
                  {{ l.descricao }}
                </td>

                <td class="px-4 py-3 text-ink/80">
                  {{ l.categoria ?? '-' }}
                </td>

                <td class="px-4 py-3 font-mono text-ink/70">
                  {{ formatarData(l.data_lancamento) }}
                </td>

                <td
                  class="px-4 py-3
                         text-right
                         font-mono
                         font-medium"
                  :class="
                    l.tipo_transacao === 'Despesa'
                      ? 'text-rust'
                      : 'text-[hsl(146,28%,35%)]'
                  "
                >
                  {{ formatarMoeda(l.valor) }}
                </td>

                <td
                  class="px-4 py-3
                         text-right
                         whitespace-nowrap"
                >
                  <router-link
                    :to="`/lancamentos/${l.id_lancamento}/editar`"
                    class="inline-flex items-center
                           px-2.5 py-1.5
                           rounded-md
                           text-xs font-medium
                           text-[hsl(146,28%,35%)]
                           hover:bg-[hsl(146,28%,35%)]/10
                           transition-colors"
                  >
                    Editar
                  </router-link>

                  <button
                    @click="remover(l.id_lancamento)"
                    type="button"
                    class="inline-flex items-center
                           px-2.5 py-1.5
                           rounded-md
                           text-xs font-medium
                           text-rust
                           hover:bg-red-50
                           transition-colors
                           ml-1"
                  >
                    Excluir
                  </button>
                </td>
              </tr>

              <!-- Nenhum lançamento -->
              <tr v-if="!lancamentos.length">
                <td
                  colspan="5"
                  class="px-4 py-10
                         text-center
                         text-ink/50"
                >
                  <div
                    class="flex flex-col
                           items-center
                           gap-2"
                  >
                    <span
                      class="text-2xl
                             text-[hsl(146,28%,35%)]/40"
                    >
                      —
                    </span>

                    <span>
                      Nenhum lançamento encontrado.
                    </span>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginação -->
      <div
        class="max-w-6xl mx-auto
               mt-5
               bg-white/95
               backdrop-blur-sm
               border border-white/30
               rounded-xl
               shadow-md
               px-4 py-3
               flex items-center
               justify-between
               text-sm"
      >
        <button
          :disabled="pagina <= 1"
          @click="mudarPagina(pagina - 1)"
          class="px-4 py-2
                 border border-line
                 rounded-lg
                 text-ink
                 hover:bg-gray-50
                 transition
                 disabled:opacity-40
                 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <span
          class="font-medium
                 text-[hsl(146,28%,35%)]"
        >
          Página {{ pagina }}
        </span>

        <button
          :disabled="lancamentos.length < tamanhoPagina"
          @click="mudarPagina(pagina + 1)"
          class="px-4 py-2
                 border border-line
                 rounded-lg
                 text-ink
                 hover:bg-gray-50
                 transition
                 disabled:opacity-40
                 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>

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
    lancamentos.value = Array.isArray(data) ? data : data.dados || []
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
