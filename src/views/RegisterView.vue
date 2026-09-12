<template>
  <div class="max-w-sm mx-auto mt-12">
    <h1 class="text-xl font-semibold text-ledger mb-6">Criar conta</h1>

    <form @submit.prevent="cadastrar" class="space-y-4">
      <div>
        <label class="block text-sm mb-1" for="nome">Nome</label>
        <input
          id="nome"
          v-model="nome"
          type="text"
          required
          class="w-full border border-line rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ledger"
        />
      </div>

      <div>
        <label class="block text-sm mb-1" for="email">E-mail</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full border border-line rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ledger"
        />
      </div>

      <div>
        <label class="block text-sm mb-1" for="senha">Senha</label>
        <input
          id="senha"
          v-model="senha"
          type="password"
          required
          class="w-full border border-line rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ledger"
        />
      </div>

      <p v-if="erro" class="text-sm text-rust">{{ erro }}</p>
      <p v-if="sucesso" class="text-sm text-ledger">Conta criada! Você já pode entrar.</p>

      <button
        type="submit"
        :disabled="carregando"
        class="w-full bg-ledger text-white rounded px-3 py-2 font-medium disabled:opacity-60"
      >
        {{ carregando ? 'Enviando...' : 'Criar conta' }}
      </button>
    </form>

    <p class="text-sm mt-4">
      Já tem conta?
      <router-link to="/login" class="text-ledger underline">Entrar</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const nome = ref('')
const email = ref('')
const senha = ref('')
const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)
const router = useRouter()

async function cadastrar() {
  erro.value = ''
  sucesso.value = false
  carregando.value = true
  try {
    // NOTA: ajuste os nomes dos campos (nome/email/senha) para bater
    // exatamente com o seu UsuarioCreate, se forem diferentes.
    await api.post('/usuarios', {
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })
    sucesso.value = true
    setTimeout(() => router.push({ name: 'login' }), 1200)
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível criar a conta.'
  } finally {
    carregando.value = false
  }
}
</script>
