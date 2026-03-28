<template>
  <div class="page-wrap">
    <section class="glass panel login-panel">
      <h1>Sign in to continue</h1>
      <p class="lead">Settings and privileged actions require an authenticated account.</p>

      <form class="field-stack" @submit.prevent="submitLogin">
        <label class="field-label" for="email">Email</label>
        <input
          id="email"
          class="input-field"
          type="email"
          v-model.trim="form.email"
          autocomplete="email"
          required
        />

        <label class="field-label" for="password">Password</label>
        <input
          id="password"
          class="input-field"
          type="password"
          v-model="form.password"
          autocomplete="current-password"
          required
        />

        <button class="btn btn-primary" type="submit" :disabled="isLoading">Sign in</button>
      </form>

      <p v-if="error" class="status error">{{ error }}</p>

      <div class="hint">
        <p><strong>Demo credentials</strong></p>
        <p>Admin: lead@smallcompany.io / Passw0rd!</p>
        <p>Editor: editor@smallcompany.io / Passw0rd!</p>
        <p>Viewer: viewer@smallcompany.io / Passw0rd!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

const form = reactive({
  email: 'lead@smallcompany.io',
  password: 'Passw0rd!'
})

const submitLogin = async () => {
  try {
    await authStore.login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(redirect)
  } catch {
    // Errors are handled via store state for user feedback.
  }
}
</script>

<style scoped>
h1 {
  font-size: clamp(1.6rem, 3.4vw, 2.5rem);
  margin-bottom: 0.65rem;
}

.login-panel {
  max-width: 540px;
  margin: 0 auto;
  display: grid;
  gap: 0.85rem;
}

.status {
  font-weight: 650;
  color: var(--danger-600);
}

.hint {
  border: 1px dashed var(--line-soft);
  border-radius: 12px;
  padding: 0.75rem;
  background: var(--surface-subtle);
  color: var(--ink-800);
  display: grid;
  gap: 0.18rem;
  font-size: 0.9rem;
}
</style>
