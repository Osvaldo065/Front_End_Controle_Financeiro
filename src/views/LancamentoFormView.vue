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
             px-4
             py-6
             pt-[88px]
             sm:px-6
             sm:pt-[96px]"
    >

      <!-- Cabeçalho -->
      <div class="max-w-2xl mx-auto mb-6">
        <h1 class="text-xl sm:text-2xl font-semibold text-white">
          {{ editando ? 'Editar lançamento' : 'Novo lançamento' }}
        </h1>

        <p class="text-sm text-white/70 mt-1">
          {{ editando
            ? 'Atualize as informações do lançamento.'
            : 'Registre uma nova movimentação financeira.'
          }}
        </p>
      </div>

      <!-- Card -->
      <div
        class="max-w-2xl mx-auto
               bg-white/95
               backdrop-blur-sm
               border border-white/30
               rounded-2xl
               shadow-2xl
               px-5 py-6
               sm:px-8 sm:py-8"
      >

        <form
          @submit.prevent="salvar"
          class="space-y-5"
        >

          <!-- Descrição -->
          <div>
            <label
              for="descricao"
              class="block
                     text-sm
                     font-medium
                     text-ink/80
                     mb-1.5"
            >
              Descrição
            </label>

            <input
              id="descricao"
              v-model="form.descricao"
              type="text"
              required
              placeholder="Ex.: Mercado, salário, aluguel..."
              class="w-full
                     border border-line
                     rounded-lg
                     px-3.5 py-2.5
                     bg-white
                     text-ink
                     placeholder:text-ink/35
                     transition-all duration-200
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]/30
                     focus:border-[hsl(146,28%,35%)]"
            />
          </div>

          <!-- Valor -->
          <div>
            <label
              for="valor"
              class="block
                     text-sm
                     font-medium
                     text-ink/80
                     mb-1.5"
            >
              Valor
            </label>

            <input
              id="valor"
              v-model.number="form.valor"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0,00"
              class="w-full
                     border border-line
                     rounded-lg
                     px-3.5 py-2.5
                     bg-white
                     text-ink
                     placeholder:text-ink/35
                     font-mono
                     transition-all duration-200
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]/30
                     focus:border-[hsl(146,28%,35%)]"
            />
          </div>

          <!-- Data e Categoria -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Data -->
            <div>
              <label
                for="data_lancamento"
                class="block
                       text-sm
                       font-medium
                       text-ink/80
                       mb-1.5"
              >
                Data
              </label>

              <input
                id="data_lancamento"
                v-model="form.data_lancamento"
                type="date"
                required
                class="w-full
                       border border-line
                       rounded-lg
                       px-3.5 py-2.5
                       bg-white
                       text-ink
                       transition-all duration-200
                       focus:outline-none
                       focus:ring-2
                       focus:ring-[hsl(146,28%,35%)]/30
                       focus:border-[hsl(146,28%,35%)]"
              />
            </div>

            <!-- Categoria -->
            <div>
              <label
                for="categoria"
                class="block
                       text-sm
                       font-medium
                       text-ink/80
                       mb-1.5"
              >
                Categoria
              </label>

              <select
                id="categoria"
                v-model.number="form.id_categoria"
                required
                class="w-full
                       border border-line
                       rounded-lg
                       px-3.5 py-2.5
                       bg-white
                       text-ink
                       transition-all duration-200
                       focus:outline-none
                       focus:ring-2
                       focus:ring-[hsl(146,28%,35%)]/30
                       focus:border-[hsl(146,28%,35%)]"
              >
                <option :value="null">
                  Selecione uma categoria
                </option>

                <option
                  v-for="c in categorias"
                  :key="c.id_categoria"
                  :value="c.id_categoria"
                >
                  {{ c.nome }}
                </option>
              </select>
            </div>

          </div>

          <!-- Tipo e Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Tipo -->
            <div>
              <label
                for="tipo_transacao"
                class="block
                       text-sm
                       font-medium
                       text-ink/80
                       mb-1.5"
              >
                Tipo de transação
              </label>

              <select
                id="tipo_transacao"
                v-model="form.tipo_transacao"
                required
                class="w-full
                       border border-line
                       rounded-lg
                       px-3.5 py-2.5
                       bg-white
                       text-ink
                       transition-all duration-200
                       focus:outline-none
                       focus:ring-2
                       focus:ring-[hsl(146,28%,35%)]/30
                       focus:border-[hsl(146,28%,35%)]"
              >
                <option value="Receita">
                  Receita
                </option>

                <option value="Despesa">
                  Despesa
                </option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label
                for="status_pagamento"
                class="block
                       text-sm
                       font-medium
                       text-ink/80
                       mb-1.5"
              >
                Status do pagamento
              </label>

              <select
                id="status_pagamento"
                v-model="form.status_pagamento"
                required
                class="w-full
                       border border-line
                       rounded-lg
                       px-3.5 py-2.5
                       bg-white
                       text-ink
                       transition-all duration-200
                       focus:outline-none
                       focus:ring-2
                       focus:ring-[hsl(146,28%,35%)]/30
                       focus:border-[hsl(146,28%,35%)]"
              >
                <option value="Pago">
                  Pago
                </option>

                <option value="Pendente">
                  Pendente
                </option>

                <option value="Cancelado">
                  Cancelado
                </option>
              </select>
            </div>

          </div>

          <!-- Tipo de pagamento -->
          <div>
            <label
              for="tipo_pagamento"
              class="block
                     text-sm
                     font-medium
                     text-ink/80
                     mb-1.5"
            >
              Tipo de pagamento
            </label>

            <select
              id="tipo_pagamento"
              v-model="form.tipo_pagamento"
              required
              class="w-full
                     border border-line
                     rounded-lg
                     px-3.5 py-2.5
                     bg-white
                     text-ink
                     transition-all duration-200
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]/30
                     focus:border-[hsl(146,28%,35%)]"
            >
              <option :value="null">
                Selecione o tipo de pagamento
              </option>

              <option value="PIX">
                PIX
              </option>

              <option value="Dinheiro">
                Dinheiro
              </option>

              <option value="Cartão de Crédito">
                Cartão de Crédito
              </option>

              <option value="Cartão de Débito">
                Cartão de Débito
              </option>

              <option value="Boleto">
                Boleto
              </option>

              <option value="Transferência">
                Transferência
              </option>
            </select>
          </div>

          <!-- Erro -->
          <p
            v-if="erro"
            class="text-sm
                   text-rust
                   bg-red-50
                   border border-red-100
                   rounded-lg
                   px-3 py-2.5"
          >
            {{ erro }}
          </p>

          <!-- Ações -->
          <div
            class="flex flex-col-reverse
                   sm:flex-row
                   sm:justify-end
                   gap-3
                   pt-2"
          >

            <router-link
              to="/lancamentos"
              class="w-full sm:w-auto
                     inline-flex
                     items-center
                     justify-center
                     px-5 py-2.5
                     rounded-lg
                     border border-line
                     bg-white
                     text-ink/70
                     text-sm
                     font-medium
                     transition-all duration-200
                     hover:bg-gray-50
                     hover:text-ink"
            >
              Cancelar
            </router-link>

            <button
              type="submit"
              :disabled="carregando"
              class="w-full sm:w-auto
                     inline-flex
                     items-center
                     justify-center
                     gap-2
                     px-5 py-2.5
                     rounded-lg
                     bg-[hsl(146,28%,35%)]
                     text-white
                     text-sm
                     font-semibold
                     shadow-md
                     transition-all duration-200
                     hover:bg-[hsl(146,28%,30%)]
                     hover:shadow-lg
                     hover:-translate-y-0.5
                     active:translate-y-0
                     disabled:opacity-60
                     disabled:cursor-not-allowed
                     disabled:hover:translate-y-0
                     disabled:hover:shadow-md"
            >
              <span v-if="carregando">
                Salvando...
              </span>

              <span v-else>
                {{ editando ? 'Salvar alterações' : 'Salvar lançamento' }}
              </span>
            </button>

          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const props = defineProps({
  id: { type: [String, Number], default: null }
})

const router = useRouter()
const categorias = ref([])
const erro = ref('')
const salvando = ref(false)

// NOTA: estes campos seguem os nomes usados nas rotas do backend
// (LancamentoCreate/LancamentoUpdate). Ajuste-os aqui caso os nomes
// reais do schema sejam diferentes.
const form = reactive({
  descricao: '',
  valor: null,
  data_lancamento: '',
  id_categoria: null,
  tipo_transacao: 'Despesa',
  status_pagamento: 'Pago',
  tipo_pagamento: null
})

async function carregarCategorias() {
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data
  } catch (e) {
    erro.value = 'Não foi possível carregar as categorias.'
  }
}

async function carregarLancamento() {
  if (!props.id) return

  try {
    const { data } = await api.get(`/lancamentos/${props.id}`)

    Object.assign(form, {
      ...data,
      tipo_transacao: data.tipo_transacao,
      status_pagamento: data.status_pagamento,
      tipo_pagamento: data.tipo_pagamento,
      data_lancamento: data.data_lancamento,
    })
  } catch (e) {
    erro.value = 'Não foi possível carregar o lançamento.'
  }
}

async function salvar() {
  erro.value = ''
  salvando.value = true
  try {
    if (props.id) {
      await api.put(`/lancamentos/${props.id}`, form)
    } else {
      await api.post('/lancamentos', form)
    }
    router.push({ name: 'lancamentos' })
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível salvar o lançamento.'
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  await carregarCategorias()
  await carregarLancamento()
})
</script>
