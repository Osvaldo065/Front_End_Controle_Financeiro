<template>
  <div
    class="min-h-screen -m-4 sm:-m-6 p-4 sm:p-6
           bg-gradient-to-br
           from-[hsl(146,28%,35%)]
           via-[hsl(146,30%,42%)]
           to-[hsl(146,38%,58%)]"
  >

    <!-- Cabeçalho -->
    <div class="max-w-2xl mx-auto mb-6">
      <h1 class="text-xl sm:text-2xl font-semibold text-white">
        {{ id ? 'Editar lançamento' : 'Novo lançamento' }}
      </h1>

      <p class="text-sm text-white/70 mt-1">
        {{ id
          ? 'Atualize as informações do lançamento.'
          : 'Preencha os dados para registrar um novo lançamento.'
        }}
      </p>
    </div>

    <!-- Card do formulário -->
    <div
      class="max-w-2xl mx-auto
             bg-white/95
             backdrop-blur-sm
             rounded-2xl
             border border-white/30
             shadow-xl
             overflow-hidden"
    >

      <form
        @submit.prevent="salvar"
        class="p-5 sm:p-6 space-y-5"
      >

        <!-- Descrição -->
        <div>
          <label
            class="block text-sm font-medium text-ink mb-1.5"
            for="descricao"
          >
            Descrição
          </label>

          <input
            id="descricao"
            v-model="form.descricao"
            type="text"
            required
            class="w-full border border-line rounded-lg
                   px-3 py-2.5
                   bg-white
                   text-ink
                   transition
                   focus:outline-none
                   focus:ring-2
                   focus:ring-[hsl(146,28%,35%)]
                   focus:border-[hsl(146,28%,35%)]"
          />
        </div>

        <!-- Valor e Data -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label
              class="block text-sm font-medium text-ink mb-1.5"
              for="valor"
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
              class="w-full border border-line rounded-lg
                     px-3 py-2.5
                     bg-white
                     font-mono
                     text-ink
                     transition
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-ink mb-1.5"
              for="data_lancamento"
            >
              Data
            </label>

            <input
              id="data_lancamento"
              v-model="form.data_lancamento"
              type="date"
              required
              class="w-full border border-line rounded-lg
                     px-3 py-2.5
                     bg-white
                     text-ink
                     transition
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            />
          </div>

        </div>

        <!-- Categoria -->
        <div>
          <label
            class="block text-sm font-medium text-ink mb-1.5"
            for="categoria"
          >
            Categoria
          </label>

          <select
            id="categoria"
            v-model.number="form.id_categoria"
            required
            class="w-full border border-line rounded-lg
                   px-3 py-2.5
                   bg-white
                   text-ink
                   transition
                   focus:outline-none
                   focus:ring-2
                   focus:ring-[hsl(146,28%,35%)]
                   focus:border-[hsl(146,28%,35%)]"
          >
            <option disabled :value="null">
              Selecione...
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

        <!-- Tipo e Status -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label
              class="block text-sm font-medium text-ink mb-1.5"
              for="tipo"
            >
              Tipo
            </label>

            <select
              id="tipo"
              v-model="form.tipo_transacao"
              required
              class="w-full border border-line rounded-lg
                     px-3 py-2.5
                     bg-white
                     text-ink
                     transition
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            >
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-ink mb-1.5"
              for="status"
            >
              Status do pagamento
            </label>

            <select
              id="status"
              v-model="form.status_pagamento"
              required
              class="w-full border border-line rounded-lg
                     px-3 py-2.5
                     bg-white
                     text-ink
                     transition
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[hsl(146,28%,35%)]
                     focus:border-[hsl(146,28%,35%)]"
            >
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>

        </div>

        <!-- Forma de pagamento -->
        <div>
          <label
            class="block text-sm font-medium text-ink mb-1.5"
            for="tipo_pagamento"
          >
            Forma de pagamento
          </label>

          <select
            id="tipo_pagamento"
            v-model="form.tipo_pagamento"
            required
            class="w-full border border-line rounded-lg
                   px-3 py-2.5
                   bg-white
                   text-ink
                   transition
                   focus:outline-none
                   focus:ring-2
                   focus:ring-[hsl(146,28%,35%)]
                   focus:border-[hsl(146,28%,35%)]"
          >
            <option disabled :value="null">
              Selecione...
            </option>

            <option value="PIX">PIX</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de Crédito">
              Cartão de Crédito
            </option>
            <option value="Cartão de Débito">
              Cartão de Débito
            </option>
            <option value="Boleto">Boleto</option>
            <option value="Transferência">
              Transferência
            </option>
          </select>
        </div>

        <!-- Mensagem de erro -->
        <p
          v-if="erro"
          class="text-sm text-rust
                 bg-red-50
                 border border-red-100
                 rounded-lg
                 px-3 py-2"
        >
          {{ erro }}
        </p>

        <!-- Botões -->
        <div
          class="flex flex-col-reverse sm:flex-row
                 sm:justify-end
                 gap-3
                 pt-4
                 border-t border-line"
        >

          <router-link
            to="/lancamentos"
            class="w-full sm:w-auto
                   inline-flex items-center justify-center
                   px-5 py-2.5
                   text-sm font-medium
                   text-ink
                   border border-line
                   rounded-lg
                   bg-white
                   transition-all duration-200
                   hover:bg-gray-50"
          >
            Cancelar
          </router-link>

          <button
            type="submit"
            :disabled="salvando"
            class="w-full sm:w-auto
                   inline-flex items-center justify-center
                   px-5 py-2.5
                   text-sm font-medium
                   text-white
                   rounded-lg
                   bg-[hsl(146,28%,35%)]
                   shadow-sm
                   transition-all duration-200
                   hover:bg-[hsl(146,28%,30%)]
                   hover:shadow-md
                   disabled:opacity-60
                   disabled:cursor-not-allowed"
          >
            {{ salvando ? 'Salvando...' : 'Salvar lançamento' }}
          </button>

        </div>

      </form>
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
