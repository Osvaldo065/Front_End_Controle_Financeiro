<template>
  <div class="max-w-md">
    <h1 class="text-xl font-semibold text-ledger mb-6">
      {{ id ? 'Editar lançamento' : 'Novo lançamento' }}
    </h1>

    <form @submit.prevent="salvar" class="space-y-4">
      <div>
        <label class="block text-sm mb-1" for="descricao">Descrição</label>
        <input id="descricao" v-model="form.descricao" type="text" required
          class="w-full border border-line rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ledger" />
      </div>

      <div>
        <label class="block text-sm mb-1" for="valor">Valor</label>
        <input id="valor" v-model.number="form.valor" type="number" step="0.01" min="0" required
          class="w-full border border-line rounded px-3 py-2 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-ledger" />
      </div>

      <div>
        <label class="block text-sm mb-1" for="data_lancamento">Data</label>
        <input id="data_lancamento" v-model="form.data_lancamento" type="date" required
          class="w-full border border-line rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ledger" />
      </div>

      <div>
        <label class="block text-sm mb-1" for="categoria">Categoria</label>
        <select id="categoria" v-model.number="form.id_categoria" required
          class="w-full border border-line rounded px-3 py-2 bg-white">
          <option disabled :value="null">Selecione...</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm mb-1" for="tipo">Tipo</label>
        <select id="tipo" v-model="form.tipo_transacao" required
          class="w-full border border-line rounded px-3 py-2 bg-white">
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </select>
      </div>

      <div>
        <label class="block text-sm mb-1" for="status">Status do pagamento</label>
        <select id="status" v-model="form.status_pagamento" required
          class="w-full border border-line rounded px-3 py-2 bg-white">
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
        </select>
      </div>

      <div>
        <label for="tipo_pagamento">Forma de pagamento</label>
        <select v-model="form.tipo_pagamento" required>
          <option disabled :value="null">Selecione...</option>
          <option value="PIX">PIX</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Boleto">Boleto</option>
          <option value="Transferência">Transferência</option>
        </select>
      </div>

      <p v-if="erro" class="text-sm text-rust">{{ erro }}</p>

      <div class="flex gap-2">
        <button type="submit" :disabled="salvando"
          class="bg-ledger text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-60">
          {{ salvando ? 'Salvando...' : 'Salvar' }}
        </button>
        <router-link to="/lancamentos" class="px-4 py-2 text-sm border border-line rounded">
          Cancelar
        </router-link>
      </div>
    </form>
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
