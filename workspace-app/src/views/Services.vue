<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Service Models</h1>
      <p class="lead">Choose a delivery model based on your growth stage and team capacity.</p>
    </section>

    <section class="service-grid">
      <article class="card-item" v-for="service in services" :key="service.name">
        <h2>{{ service.name }}</h2>
        <p class="detail">{{ service.description }}</p>
        <ul class="list">
          <li v-for="bullet in service.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </article>
    </section>

    <section class="glass panel cta">
      <h2>Need a custom program?</h2>
      <p>We can blend these models into one roadmap tailored to your delivery constraints.</p>
      <router-link class="btn btn-primary" to="/contact">Request a discovery call</router-link>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
const { services } = storeToRefs(workspaceStore)

onMounted(() => {
  workspaceStore.fetchServices()
})
</script>

<style scoped>
h1 {
  font-size: clamp(1.6rem, 3.4vw, 2.7rem);
  margin-bottom: 0.7rem;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

h2 {
  font-size: 1.3rem;
}

.detail {
  margin-top: 0.55rem;
  color: var(--ink-600);
}

.list {
  margin-top: 0.8rem;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

.list li {
  padding: 0.55rem;
  border-radius: 10px;
  background: var(--surface-subtle);
  border: 1px solid var(--line-soft);
}

.cta {
  display: grid;
  gap: 0.7rem;
}

@media (max-width: 980px) {
  .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>
