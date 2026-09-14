<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearAuth } from '../stores/auth'

const route = useRoute()
const router = useRouter()

const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function sair() {
  clearAuth()
  closeMobileMenu()
  router.push({ name: 'login' })
}
</script>

<template>
  <!-- =========================================================
       NAVBAR
  ========================================================== -->
  <header
    class="fixed top-0 left-0 w-full
           bg-paper
           border-b border-line
           shadow-sm
           z-50"
  >
    <div
      class="max-w-6xl
             mx-auto
             px-4
             sm:px-6
             lg:px-8"
    >

      <!-- Barra principal -->
      <div
        class="flex
               items-center
               justify-between
               gap-6
               h-16
               sm:h-[72px]"
      >

        <!-- =====================================================
             LOGO + NOME
        ====================================================== -->
        <div
          class="flex
                 items-center
                 gap-5
                 min-w-0
                 shrink"
        >

          <!-- Logo -->
          <router-link
            to="/dashboard"
            class="flex
                   items-center
                   shrink-0"
            @click="closeMobileMenu"
          >
            <img
              src="/LogoCorujao.svg"
              alt="Corujas Finance"
              class="w-[180px]
                     sm:w-[210px]
                     md:w-[240px]
                     h-auto
                     object-contain
                     block"
            />
          </router-link>

          <!-- Nome da aplicação -->
          <span
            class="hidden
                   lg:block
                   font-semibold
                   text-ledger
                   tracking-tight
                   text-base
                   whitespace-nowrap"
          >
            Controle Financeiro
          </span>

        </div>


        <!-- =====================================================
             MENU DESKTOP
        ====================================================== -->
        <nav
          class="hidden
                 sm:flex
                 items-center
                 gap-6
                 lg:gap-8
                 shrink-0"
        >

          <!-- Painel -->
          <router-link
            to="/dashboard"
            class="text-sm
                   text-text
                   no-underline
                   border-b-2
                   border-transparent
                   transition-colors
                   duration-300
                   hover:text-ledger
                   hover:border-ledger
                   pb-1"
            :class="{
              'text-ledger font-medium border-ledger':
                route.name === 'dashboard'
            }"
          >
            Painel
          </router-link>


          <!-- Lançamentos -->
          <router-link
            to="/lancamentos"
            class="text-sm
                   text-text
                   no-underline
                   border-b-2
                   border-transparent
                   transition-colors
                   duration-300
                   hover:text-ledger
                   hover:border-ledger
                   pb-1"
            :class="{
              'text-ledger font-medium border-ledger':
                route.name &&
                route.name.toString().startsWith('lancamento')
            }"
          >
            Lançamentos
          </router-link>


          <!-- Sair -->
          <button
            @click="sair"
            type="button"
            class="text-sm
                   text-rust
                   border-b-2
                   border-transparent
                   transition-colors
                   duration-300
                   hover:border-rust
                   pb-1"
          >
            Sair
          </button>

        </nav>


        <!-- =====================================================
             BOTÃO MENU MOBILE
        ====================================================== -->
        <button
          @click="toggleMobileMenu"
          type="button"
          class="sm:hidden
                 inline-flex
                 items-center
                 justify-center
                 p-2
                 rounded-md
                 text-ledger
                 hover:bg-black/5
                 transition-colors
                 shrink-0"
        >

          <span class="sr-only">
            Abrir menu
          </span>


          <!-- Ícone hambúrguer -->
          <svg
            v-if="!mobileMenuOpen"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>


          <!-- Ícone fechar -->
          <svg
            v-else
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

        </button>

      </div>
    </div>


    <!-- =========================================================
         FUNDO ESCURO DO MENU MOBILE
    ========================================================== -->
    <transition name="fade">

      <div
        v-if="mobileMenuOpen"
        class="fixed
               inset-0
               bg-black/40
               z-40
               sm:hidden"
        @click="closeMobileMenu"
      ></div>

    </transition>


    <!-- =========================================================
         MENU LATERAL MOBILE
    ========================================================== -->
    <transition name="slide-right">

      <aside
        v-if="mobileMenuOpen"
        class="fixed
               top-0
               right-0
               h-full
               w-72
               max-w-[85vw]
               bg-paper
               shadow-xl
               z-50
               p-6
               flex
               flex-col"
      >

        <!-- =====================================================
             CABEÇALHO DO MENU MOBILE
        ====================================================== -->
        <div
          class="flex
                 items-center
                 justify-between
                 gap-4
                 mb-8"
        >

          <!-- Logo -->
          <router-link
            to="/dashboard"
            @click="closeMobileMenu"
            class="shrink-0"
          >
            <img
              src="/LogoCorujao.svg"
              alt="Corujas Finance"
              class="w-[190px]
                     h-auto
                     object-contain
                     block"
            />
          </router-link>


          <!-- Botão fechar -->
          <button
            @click="closeMobileMenu"
            type="button"
            class="p-2
                   rounded-md
                   text-rust
                   hover:bg-black/5
                   transition-colors
                   shrink-0"
          >

            <span class="sr-only">
              Fechar menu
            </span>

            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

          </button>

        </div>


        <!-- =====================================================
             LINKS MOBILE
        ====================================================== -->
        <nav
          class="flex
                 flex-col
                 gap-2"
        >

          <!-- Painel -->
          <router-link
            to="/dashboard"
            @click="closeMobileMenu"
            class="px-3
                   py-3
                   rounded-md
                   text-sm
                   transition-colors
                   hover:bg-black/5
                   hover:text-ledger"
            :class="{
              'text-ledger font-medium bg-black/5':
                route.name === 'dashboard'
            }"
          >
            Painel
          </router-link>


          <!-- Lançamentos -->
          <router-link
            to="/lancamentos"
            @click="closeMobileMenu"
            class="px-3
                   py-3
                   rounded-md
                   text-sm
                   transition-colors
                   hover:bg-black/5
                   hover:text-ledger"
            :class="{
              'text-ledger font-medium bg-black/5':
                route.name &&
                route.name.toString().startsWith('lancamento')
            }"
          >
            Lançamentos
          </router-link>


          <!-- Sair -->
          <button
            @click="sair"
            type="button"
            class="mt-2
                   px-3
                   py-3
                   rounded-md
                   text-left
                   text-sm
                   text-rust
                   transition-colors
                   hover:bg-black/5"
          >
            Sair
          </button>

        </nav>

      </aside>

    </transition>

  </header>
</template>


<style scoped>
/* ============================================================
   MENU LATERAL
============================================================ */

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}


/* ============================================================
   FUNDO ESCURO
============================================================ */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>