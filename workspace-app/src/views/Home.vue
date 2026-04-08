<template>
	<div class="page-wrap">
		<section class="glass panel hero">
			<div>
				<p class="eyebrow">Code Quality & Security Scanner</p>
				<h1>Automated scanning for vulnerabilities, code quality, and compliance.</h1>
				<p class="lead">
					VulnLaunch monitors your codebase 24/7, detecting security issues and quality problems before they reach production. 
					Integrate with your CI/CD pipeline for automated protection.
				</p>
				<div class="hero-actions">
					<router-link class="btn btn-primary" to="/work">View Scan Results</router-link>
					<router-link class="btn btn-secondary" to="/services">Manage Rulesets</router-link>
				</div>
			</div>
			<div class="badge-row">
				<span class="badge">OWASP Scanning</span>
				<span class="badge">Real-time Detection</span>
				<span class="badge">Auto Remediation</span>
				<span class="badge">Compliance Ready</span>
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
				<h2 class="section-title">Critical Scan Results</h2>
				<div class="card-list">
					<div class="card-item" v-for="project in projects.slice(0, 3)" :key="project.name">
						<h3>{{ project.name }}</h3>
						<p class="detail">{{ project.summary }}</p>
						<p class="tag" :class="project.risk_level.toLowerCase()">
							{{ project.risk_level }} Risk • {{ project.issues }} Issues
						</p>
					</div>
				</div>
			</article>

			<article class="glass panel">
				<h2 class="section-title">Security Initiatives</h2>
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

.tag.critical {
	color: #dc2626;
}

.tag.high {
	color: #ea580c;
}

.tag.medium {
	color: #d97706;
}

.tag.low {
	color: #16a34a;
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
