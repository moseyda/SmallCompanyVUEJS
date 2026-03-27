<template>
	<div class="page-wrap">
		<section class="glass panel hero">
			<div>
				<p class="eyebrow">Digital Product Studio</p>
				<h1>Building standout products with speed, craft, and clarity.</h1>
				<p class="lead">
					SmallCompany now runs as a full launch console: delivery visibility, pipeline health,
					service operations, and strategic planning in one workspace.
				</p>
				<div class="hero-actions">
					<router-link class="btn btn-primary" to="/work">Explore Workstream</router-link>
					<router-link class="btn btn-secondary" to="/services">View Service Models</router-link>
				</div>
			</div>
			<div class="badge-row">
				<span class="badge">Vue 3 + Vite</span>
				<span class="badge">Modular Routing</span>
				<span class="badge">Data-Driven Views</span>
				<span class="badge">Responsive Layouts</span>
			</div>
		</section>

		<section class="kpi-grid">
			<article class="kpi-card" v-for="kpi in kpis" :key="kpi.label">
				<p class="kpi-label">{{ kpi.label }}</p>
				<h2 class="kpi-value">{{ kpi.value }}</h2>
				<p class="kpi-trend">{{ kpi.trend }}</p>
			</article>
			<p v-if="isLoading" class="status-line">Loading overview...</p>
			<p v-if="error" class="status-line error">{{ error }}</p>
		</section>

		<section class="grid-two">
			<article class="glass panel">
				<h2 class="section-title">Priority Project Signals</h2>
				<div class="card-list">
					<div class="card-item" v-for="project in projects.slice(0, 3)" :key="project.name">
						<h3>{{ project.name }}</h3>
						<p class="detail">{{ project.summary }}</p>
						<p class="tag">{{ project.status }} • {{ project.sector }}</p>
					</div>
				</div>
			</article>

			<article class="glass panel">
				<h2 class="section-title">Current Expansion Focus</h2>
				<div class="card-list">
					<div class="card-item" v-for="initiative in initiatives" :key="initiative.title">
						<h3>{{ initiative.title }}</h3>
						<p class="detail">{{ initiative.note }}</p>
					</div>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
const { kpis, projects, initiatives, isLoading, error } = storeToRefs(workspaceStore)

onMounted(() => {
	workspaceStore.fetchOverview()
})
</script>

<style scoped>
.hero {
	display: grid;
	grid-template-columns: 2.1fr 1fr;
	gap: 1rem;
}

.eyebrow {
	font-size: 0.8rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ink-600);
	margin-bottom: 0.4rem;
}

h1 {
	font-size: clamp(1.7rem, 4vw, 3.1rem);
	margin-bottom: 0.8rem;
}

.hero-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.7rem;
	margin-top: 1rem;
}

.detail {
	margin-top: 0.45rem;
	color: var(--ink-600);
}

.tag {
	margin-top: 0.5rem;
	font-size: 0.82rem;
	color: var(--ink-800);
	font-weight: 650;
}

.status-line {
	grid-column: 1 / -1;
	font-weight: 600;
	color: var(--ink-800);
}

.status-line.error {
	color: var(--danger-600);
}

@media (max-width: 930px) {
	.hero {
		grid-template-columns: 1fr;
	}
}
</style>
