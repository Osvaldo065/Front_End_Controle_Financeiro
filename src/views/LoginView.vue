<template>
  <div class="max-w-sm mx-auto mt-12">
    <h1 class="text-xl font-semibold text-ledger mb-6">Faça seu Login!</h1>

    <form @submit.prevent="entrar" class="space-y-4">
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

      <button
        type="submit"
        :disabled="carregando"
        class="w-full bg-ledger text-white rounded px-3 py-2 font-medium disabled:opacity-60"
      >
        {{ carregando ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="text-sm mt-4">
      Não tem conta?
      <router-link to="/cadastro" class="text-ledger underline">Cadastre-se</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { setAuth } from '../stores/auth'

const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)
const router = useRouter()

async function entrar() {
  erro.value = ''
  carregando.value = true
  try {
    const { data } = await api.post('/login', {
      email: email.value,
      senha: senha.value
    })
    setAuth(data.access_token)
    router.push({ name: 'dashboard' })
  } catch (e) {
    erro.value = e.response?.data?.detail || 'Não foi possível entrar. Confira suas credenciais.'
  } finally {
    carregando.value = false
  }
}
</script>
