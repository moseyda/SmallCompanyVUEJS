<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Scanning Rulesets</h1>
      <p class="lead">Configure and manage security and quality scanning rules for your projects.</p>
    </section>

    <section class="service-grid">
      <article class="card-item" v-for="ruleset in rulesets" :key="ruleset.name">
        <div class="card-header">
          <h2>{{ ruleset.name }}</h2>
          <span class="badge" :class="ruleset.enabled ? 'active' : 'inactive'">
            {{ ruleset.enabled ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <p class="detail">{{ ruleset.description }}</p>
        <div class="ruleset-info">
          <div class="info-item">
            <span class="label">Rules:</span>
            <span class="value">{{ ruleset.rules_count }}</span>
          </div>
          <div class="info-item">
            <span class="label">Updated:</span>
            <span class="value">{{ ruleset.last_updated }}</span>
          </div>
        </div>
        <button class="btn btn-small">Configure</button>
      </article>
    </section>

    <section class="glass panel cta">
      <h2>Want to create a custom ruleset?</h2>
      <p>Build custom scanning rules tailored to your organization's standards and compliance requirements.</p>
      <button class="btn btn-primary">Create New Ruleset</button>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
const { rulesets } = storeToRefs(workspaceStore)

onMounted(() => {
  workspaceStore.fetchRulesets()
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

h2 {
  font-size: 1.3rem;
}

.badge {
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.detail {
  margin-top: 0.55rem;
  color: var(--ink-600);
}

.ruleset-info {
  margin: 0.8rem 0;
  display: grid;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.55rem;
  border-radius: 10px;
  background: var(--surface-subtle);
  border: 1px solid var(--line-soft);
}

.info-item .label {
  font-weight: 600;
  color: var(--ink-600);
}

.info-item .value {
  font-weight: 700;
  color: var(--ink-800);
}

.btn-small {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  background: var(--surface-soft);
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-small:hover {
  background: var(--line-soft);
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
