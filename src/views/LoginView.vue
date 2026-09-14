<template>
  <div
    class="min-h-screen
           flex items-center justify-center
           px-4 py-6
           bg-gradient-to-br
           from-[hsl(146,28%,35%)]
           via-[hsl(146,30%,42%)]
           to-[hsl(146,38%,58%)]"
  >

    <!-- Card de Login -->
    <div
      class="w-full max-w-md
             bg-white/95
             backdrop-blur-sm
             rounded-2xl
             shadow-2xl
             border border-white/30
             px-6 py-7
             sm:px-8 sm:py-8"
    >

      <!-- Logo / Coruja -->
      <div class="flex justify-center mb-3">
        <router-link
          to="/login"
          class="inline-flex items-center justify-center"
        >
          <img
            src="/LogoFinanceCoruja.svg"
            alt="Corujas Finance"
            class="w-[85px]
                   sm:w-[100px]
                   h-auto
                   object-contain
                   block
                   transition-transform
                   duration-200
                   hover:scale-105"
          />
        </router-link>
      </div>

      <!-- Título -->
      <div class="text-center mb-5">
        <h1
          class="text-xl sm:text-2xl
                 font-semibold
                 text-[hsl(146,28%,35%)]"
        >
          Faça seu Login!
        </h1>

        <p class="text-sm text-ink/55 mt-1.5">
          Acesse sua conta financeira
        </p>
      </div>

      <!-- Formulário -->
      <form
        @submit.prevent="entrar"
        class="space-y-4"
      >

        <!-- E-mail -->
        <div>
          <label
            class="block
                   text-sm font-medium
                   text-ink/80
                   mb-1"
            for="email"
          >
            E-mail
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="seu@email.com"
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

        <!-- Senha -->
        <div>
          <label
            class="block
                   text-sm font-medium
                   text-ink/80
                   mb-1"
            for="senha"
          >
            Senha
          </label>

          <input
            id="senha"
            v-model="senha"
            type="password"
            required
            autocomplete="current-password"
            placeholder="Digite sua senha"
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

        <!-- Erro -->
        <p
          v-if="erro"
          class="text-sm
                 text-rust
                 bg-red-50
                 border border-red-100
                 rounded-lg
                 px-3 py-2"
        >
          {{ erro }}
        </p>

        <!-- Botão -->
        <button
          type="submit"
          :disabled="carregando"
          class="w-full
                 inline-flex
                 items-center
                 justify-center
                 gap-2
                 rounded-lg
                 px-4 py-2.5
                 bg-[hsl(146,28%,35%)]
                 text-white
                 font-semibold
                 text-sm
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
            Entrando...
          </span>

          <span v-else>
            Entrar
          </span>
        </button>

      </form>

      <!-- Cadastro -->
      <div
        class="mt-5
               pt-4
               border-t border-line
               text-center"
      >
        <p class="text-sm text-ink/60">
          Não tem conta?

          <router-link
            to="/cadastro"
            class="font-semibold
                   text-[hsl(146,28%,35%)]
                   hover:underline
                   transition-colors"
          >
            Cadastre-se
          </router-link>
        </p>
      </div>

    </div>
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
