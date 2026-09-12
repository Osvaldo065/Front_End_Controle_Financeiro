// Estado de autenticação simples baseado em localStorage.
// Sem Vuex/Pinia de propósito, para manter o front enxuto.

const TOKEN_KEY = 'cf_token'
const USER_KEY = 'cf_user_id'

export function setAuth(token, userId) {
  localStorage.setItem(TOKEN_KEY, token)
  if (userId !== undefined && userId !== null) {
    localStorage.setItem(USER_KEY, userId)
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUserId() {
  return localStorage.getItem(USER_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
