<template>
  <div class="min-h-screen bg-paper text-ink font-sans">
    <NavBar v-if="isAuth" />
    <main class="max-w-4xl mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { isAuthenticated } from './stores/auth'

const route = useRoute()

const isAuth = computed(() => {
  const isPublicRoute = route.meta.public
  return isAuthenticated() && !isPublicRoute
})
</script>