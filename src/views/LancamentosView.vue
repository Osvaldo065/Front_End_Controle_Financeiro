<template>
  <div class="relative min-h-screen overflow-hidden">

    <!-- ========================================================= -->
    <!-- FUNDO -->
    <!-- ========================================================= -->
    <div class="fixed inset-0
             bg-gradient-to-br
             from-[hsl(146,28%,35%)]
             via-[hsl(146,30%,42%)]
             to-[hsl(146,38%,58%)]"></div>


    <!-- ========================================================= -->
    <!-- CONTEÚDO -->
    <!-- ========================================================= -->
    <div class="relative z-10
             min-h-screen
             px-4 py-5
             pt-[88px]
             sm:px-6 sm:py-6
             sm:pt-[96px]">

      <!-- ======================================================= -->
      <!-- CABEÇALHO -->
      <!-- ======================================================= -->
      <div class="max-w-6xl mx-auto mb-5
               flex flex-col
               sm:flex-row
               sm:items-center
               sm:justify-between
               gap-4">

        <div>
          <h1 class="text-xl sm:text-2xl
                   font-semibold
                   text-white">
            Lançamentos
          </h1>

          <p class="text-sm
                   text-white/75
                   mt-1">
            Consulte e gerencie seus lançamentos financeiros.
          </p>
        </div>


        <!-- Novo lançamento -->
        <router-link to="/lancamentos/novo" class="w-full sm:w-auto
                 inline-flex
                 items-center
                 justify-center
                 gap-2
                 px-4 py-2.5
                 rounded-xl
                 bg-white
                 text-[hsl(146,28%,35%)]
                 text-sm
                 font-semibold
                 shadow-md
                 transition-all
                 duration-200
                 hover:bg-white/90
                 hover:shadow-lg
                 hover:-translate-y-0.5
                 active:translate-y-0">
          <span class="text-lg leading-none">
            +
          </span>

          Novo lançamento
        </router-link>

      </div>


      <!-- ======================================================= -->
      <!-- FILTROS -->
      <!-- ======================================================= -->
      <div class="max-w-6xl mx-auto
               bg-white/95
               backdrop-blur-sm
               border border-white/30
               rounded-2xl
               shadow-lg
               p-4
               mb-5">

        <div class="grid
                 grid-cols-1
                 sm:grid-cols-3
                 gap-3">

          <!-- Mês -->
          <div>
            <label class="block
                     text-xs
                     font-medium
                     text-ink/60
                     uppercase
                     tracking-wide
                     mb-1.5">
              Mês
            </label>

            <select v-model.number="filtros.mes" @change="aplicarFiltros" class="w-full
                     border border-line
                     rounded-xl
                     px-3 py-2.5
                     bg-white
                     text-sm
                     text-ink
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]
                     transition">
              <option :value="null">
                Todos os meses
              </option>

              <option v-for="m in 12" :key="m" :value="m">
                {{ nomeMes(m) }}
              </option>
            </select>
          </div>


          <!-- Ano -->
          <div>
            <label class="block
                     text-xs
                     font-medium
                     text-ink/60
                     uppercase
                     tracking-wide
                     mb-1.5">
              Ano
            </label>

            <select v-model.number="filtros.ano" @change="aplicarFiltros" class="w-full
                     border border-line
                     rounded-xl
                     px-3 py-2.5
                     bg-white
                     text-sm
                     text-ink
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]
                     transition">
              <option :value="null">
                Todos os anos
              </option>

              <option v-for="a in anos" :key="a" :value="a">
                {{ a }}
              </option>
            </select>
          </div>


          <!-- Tipo -->
          <div>
            <label class="block
                     text-xs
                     font-medium
                     text-ink/60
                     uppercase
                     tracking-wide
                     mb-1.5">
              Tipo
            </label>

            <select v-model="filtros.tipo_transacao" @change="aplicarFiltros" class="w-full
                     border border-line
                     rounded-xl
                     px-3 py-2.5
                     bg-white
                     text-sm
                     text-ink
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]
                     transition">
              <option :value="null">
                Todos os tipos
              </option>

              <option value="Receita">
                Receita
              </option>

              <option value="Despesa">
                Despesa
              </option>
            </select>
          </div>

        </div>
      </div>


      <!-- ======================================================= -->
      <!-- ERRO -->
      <!-- ======================================================= -->
      <p v-if="erro" class="max-w-6xl mx-auto
               text-sm
               text-rust
               bg-white/95
               border border-red-100
               rounded-xl
               px-4 py-3
               mb-4">
        {{ erro }}
      </p>


      <!-- ======================================================= -->
      <!-- CARREGANDO -->
      <!-- ======================================================= -->
      <p v-if="carregando" class="text-sm
               text-white/80
               text-center
               py-10">
        Carregando...
      </p>


      <!-- ======================================================= -->
      <!-- RESULTADOS -->
      <!-- ======================================================= -->
      <div v-else class="max-w-6xl mx-auto">


        <!-- ===================================================== -->
        <!-- DESKTOP / TABLET -->
        <!-- ===================================================== -->
        <div class="hidden md:block
                 bg-white/95
                 backdrop-blur-sm
                 border border-white/30
                 rounded-2xl
                 shadow-lg
                 overflow-hidden">

          <div class="overflow-x-auto">

            <table class="w-full text-sm">

              <!-- Cabeçalho -->
              <thead class="bg-[hsl(146,28%,35%)]
                       text-white">
                <tr>

                  <th class="px-4 py-3
                           text-left
                           font-semibold">
                    Descrição
                  </th>

                  <th class="px-4 py-3
                           text-left
                           font-semibold">
                    Categoria
                  </th>

                  <th class="px-4 py-3
                           text-left
                           font-semibold">
                    Data
                  </th>

                  <th class="px-4 py-3
                           text-right
                           font-semibold">
                    Valor
                  </th>

                  <th class="px-4 py-3
                           text-right
                           font-semibold">
                    Ações
                  </th>

                </tr>
              </thead>


              <!-- Corpo -->
              <tbody class="divide-y
                       divide-line">

                <tr v-for="l in lancamentos" :key="l.id_lancamento" class="hover:bg-[hsl(146,28%,35%)]/5
                         transition-colors">

                  <!-- Descrição -->
                  <td class="px-4 py-3
                           text-ink
                           max-w-[280px]">
                    <span class="block truncate">
                      {{ l.descricao }}
                    </span>
                  </td>


                  <!-- Categoria -->
                  <td class="px-4 py-3
                           text-ink/80">
                    {{ l.categoria ?? '-' }}
                  </td>


                  <!-- Data -->
                  <td class="px-4 py-3
                           font-mono
                           text-ink/70
                           whitespace-nowrap">
                    {{ formatarData(l.data_lancamento) }}
                  </td>


                  <!-- Valor -->
                  <td class="px-4 py-3
                           text-right
                           font-mono
                           font-medium
                           whitespace-nowrap" :class="l.tipo_transacao === 'Despesa'
                            ? 'text-rust'
                            : 'text-[hsl(146,28%,35%)]'
                            ">
                    {{ formatarMoeda(l.valor) }}
                  </td>


                  <!-- Ações -->
                  <td class="px-4 py-3
                           text-right
                           whitespace-nowrap">

                    <router-link :to="`/lancamentos/${l.id_lancamento}/editar`" class="inline-flex
                             items-center
                             px-2.5 py-1.5
                             rounded-lg
                             text-xs
                             font-medium
                             text-[hsl(146,28%,35%)]
                             hover:bg-[hsl(146,28%,35%)]/10
                             transition-colors">
                      Editar
                    </router-link>


                    <button type="button" @click="remover(l.id_lancamento)" class="inline-flex
                             items-center
                             px-2.5 py-1.5
                             rounded-lg
                             text-xs
                             font-medium
                             text-rust
                             hover:bg-red-50
                             transition-colors
                             ml-1">
                      Excluir
                    </button>

                  </td>

                </tr>


                <!-- Nenhum lançamento -->
                <tr v-if="!lancamentos.length">

                  <td colspan="5" class="px-4 py-12
                           text-center
                           text-ink/50">

                    <div class="flex
                             flex-col
                             items-center
                             gap-2">

                      <span class="text-3xl
                               font-light
                               text-[hsl(146,28%,35%)]/40">
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


        <!-- ===================================================== -->
        <!-- MOBILE -->
        <!-- ===================================================== -->
        <div class="md:hidden
                 space-y-3">

          <!-- Card de lançamento -->
          <div v-for="l in lancamentos" :key="l.id_lancamento" class="bg-white/95
                   backdrop-blur-sm
                   border border-white/40
                   rounded-2xl
                   shadow-md
                   p-4">

            <!-- Cabeçalho do card -->
            <div class="flex
                     items-start
                     justify-between
                     gap-3">

              <!-- Descrição + categoria -->
              <div class="min-w-0
                       flex-1">

                <p class="text-base
                         font-semibold
                         text-ink
                         truncate">
                  {{ l.descricao }}
                </p>

                <p class="text-sm
                         text-ink/60
                         mt-1
                         truncate">
                  {{ l.categoria ?? '-' }}
                </p>

              </div>


              <!-- Valor -->
              <div class="shrink-0
                       text-right">

                <p class="text-base
                         font-semibold
                         font-mono" :class="l.tipo_transacao === 'Despesa'
                          ? 'text-rust'
                          : 'text-[hsl(146,28%,35%)]'
                          ">
                  {{ formatarMoeda(l.valor) }}
                </p>

              </div>

            </div>


            <!-- Separador -->
            <div class="border-t
                     border-line
                     my-3"></div>


            <!-- Informações -->
            <div class="grid
                     grid-cols-2
                     gap-x-4
                     gap-y-3">

              <!-- Data -->
              <div>
                <p class="text-[11px]
                         font-medium
                         uppercase
                         tracking-wide
                         text-ink/45">
                  Data
                </p>

                <p class="text-sm
                         text-ink
                         mt-0.5">
                  {{ formatarData(l.data_lancamento) }}
                </p>
              </div>


              <!-- Tipo -->
              <div>
                <p class="text-[11px]
                         font-medium
                         uppercase
                         tracking-wide
                         text-ink/45">
                  Tipo
                </p>

                <p class="text-sm
                         text-ink
                         mt-0.5">
                  {{ l.tipo_transacao ?? '-' }}
                </p>
              </div>


              <!-- Pagamento -->
              <div>
                <p class="text-[11px]
                         font-medium
                         uppercase
                         tracking-wide
                         text-ink/45">
                  Pagamento
                </p>

                <p class="text-sm
                         text-ink
                         mt-0.5">
                  {{ l.tipo_pagamento ?? '-' }}
                </p>
              </div>


              <!-- Status -->
              <div>
                <p class="text-[11px]
                         font-medium
                         uppercase
                         tracking-wide
                         text-ink/45">
                  Status
                </p>

                <p class="text-sm
                         text-ink
                         mt-0.5">
                  {{ l.status_pagamento ?? '-' }}
                </p>
              </div>

            </div>


            <!-- Ações -->
            <div class="grid
                     grid-cols-2
                     gap-2
                     mt-4">

              <router-link :to="`/lancamentos/${l.id_lancamento}/editar`" class="flex
                       items-center
                       justify-center
                       rounded-xl
                       border
                       border-[hsl(146,28%,35%)]/25
                       bg-[hsl(146,28%,35%)]/5
                       px-3 py-2.5
                       text-sm
                       font-medium
                       text-[hsl(146,28%,35%)]
                       transition
                       active:scale-[0.98]">
                Editar
              </router-link>


              <button type="button" @click="remover(l.id_lancamento)" class="flex
                       items-center
                       justify-center
                       rounded-xl
                       border
                       border-red-100
                       bg-red-50
                       px-3 py-2.5
                       text-sm
                       font-medium
                       text-rust
                       transition
                       active:scale-[0.98]">
                Excluir
              </button>

            </div>

          </div>


          <!-- Nenhum lançamento - Mobile -->
          <div v-if="!lancamentos.length" class="bg-white/95
                   backdrop-blur-sm
                   border border-white/40
                   rounded-2xl
                   shadow-md
                   px-4 py-12
                   text-center
                   text-ink/50">

            <div class="flex
                     flex-col
                     items-center
                     gap-2">

              <span class="text-3xl
                       font-light
                       text-[hsl(146,28%,35%)]/40">
                —
              </span>

              <span class="text-sm">
                Nenhum lançamento encontrado.
              </span>

            </div>

          </div>

        </div>


        <!-- ===================================================== -->
        <!-- PAGINAÇÃO -->
        <!-- ===================================================== -->
        <div class="mt-4
                 bg-white/95
                 backdrop-blur-sm
                 border border-white/30
                 rounded-2xl
                 shadow-md
                 px-3 py-3
                 sm:px-4 sm:py-3
                 flex
                 items-center
                 justify-between
                 gap-3
                 text-sm">

          <!-- Anterior -->
          <button :disabled="pagina <= 1" @click="mudarPagina(pagina - 1)" class="px-3 py-2
                   sm:px-4
                   border border-line
                   rounded-xl
                   text-ink
                   hover:bg-gray-50
                   transition
                   disabled:opacity-40
                   disabled:cursor-not-allowed
                   whitespace-nowrap">
            <span class="hidden sm:inline">
              Anterior
            </span>

            <span class="sm:hidden">
              ←
            </span>
          </button>


          <!-- Página -->
          <span class="font-medium
                   text-[hsl(146,28%,35%)]
                   whitespace-nowrap">
            Página {{ pagina }}
          </span>


          <!-- Próxima -->
          <button :disabled="lancamentos.length < tamanhoPagina" @click="mudarPagina(pagina + 1)" class="px-3 py-2
                   sm:px-4
                   border border-line
                   rounded-xl
                   text-ink
                   hover:bg-gray-50
                   transition
                   disabled:opacity-40
                   disabled:cursor-not-allowed
                   whitespace-nowrap">
            <span class="hidden sm:inline">
              Próxima
            </span>

            <span class="sm:hidden">
              →
            </span>
          </button>

        </div>

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
    lancamentos.value = Array.isArray(data)
      ? data
      : data.data?.dados || []
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível carregar os lançamentos.'
  } finally {
    carregando.value = false
  }
}

function aplicarFiltros() {
  pagina.value = 1
  carregar()
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
