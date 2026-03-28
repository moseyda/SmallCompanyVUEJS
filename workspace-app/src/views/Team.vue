<template>
	<div class="page-wrap">
		<section class="glass panel">
			<h1>Projects Under Scan</h1>
			<p class="lead">
				Monitor and manage all scanned projects. View recent scan results and security status.
			</p>
			<div class="filter-row">
				<button
					v-for="option in filters"
					:key="option"
					class="btn"
					:class="activeFilter === option ? 'btn-primary' : 'btn-secondary'"
					@click="activeFilter = option"
				>
					{{ option }}
				</button>
			</div>
		</section>

		<section class="team-grid">
			<article class="card-item" v-for="project in filteredProjects" :key="project.name">
				<div class="project-header">
					<span class="status-badge" :class="project.risk_level.toLowerCase()">
						{{ project.risk_level }}
					</span>
					<span class="issue-count">{{ project.issues }} Issues</span>
				</div>
				<h2>{{ project.name }}</h2>
				<p class="role">{{ project.status }}</p>
				<p class="bio">{{ project.summary }}</p>
				<div class="project-meta">
					<span class="meta-item">Last scan: {{ project.last_scan }}</span>
				</div>
				<button class="btn btn-small">View Scan Details</button>
			</article>
		</section>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const filters = ['All', 'Critical', 'High', 'Medium', 'Low']
const activeFilter = ref('All')
const workspaceStore = useWorkspaceStore()
const { projects } = storeToRefs(workspaceStore)

onMounted(() => {
	workspaceStore.fetchProjects()
})

const filteredProjects = computed(() => {
	if (activeFilter.value === 'All') {
		return projects.value
	}

	return projects.value.filter((project) => project.risk_level === activeFilter.value)
})
</script>

<style scoped>
h1 {
	font-size: clamp(1.6rem, 3.4vw, 2.7rem);
	margin-bottom: 0.6rem;
}

.filter-row {
	margin-top: 1rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
}

.team-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.9rem;
}

.project-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.status-badge {
	padding: 0.3rem 0.6rem;
	border-radius: 6px;
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
}

.status-badge.critical {
	background-color: #fecaca;
	color: #7f1d1d;
}

.status-badge.high {
	background-color: #fed7aa;
	color: #92400e;
}

.status-badge.medium {
	background-color: #fde047;
	color: #713f12;
}

.status-badge.low {
	background-color: #dcfce7;
	color: #166534;
}

.issue-count {
	padding: 0.3rem 0.6rem;
	font-size: 0.85rem;
	font-weight: 600;
	background: var(--surface-subtle);
	border-radius: 6px;
}

h2 {
	font-size: 1.3rem;
	margin-bottom: 0.3rem;
}

.role {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--ink-600);
	margin-bottom: 0.5rem;
}

.bio {
	font-size: 0.9rem;
	color: var(--ink-600);
	margin-bottom: 0.8rem;
	line-height: 1.4;
}

.project-meta {
	margin-bottom: 0.8rem;
	font-size: 0.85rem;
	color: var(--ink-600);
}

.meta-item {
	display: block;
	padding: 0.4rem;
	background: var(--surface-subtle);
	border-radius: 6px;
}

.btn-small {
	width: 100%;
	padding: 0.6rem;
	background: var(--surface-soft);
	border: 1px solid var(--line-soft);
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.2s;
	font-size: 0.9rem;
}

.btn-small:hover {
	background: var(--line-soft);
}

@media (max-width: 980px) {
	.team-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 640px) {
	.team-grid {
		grid-template-columns: 1fr;
	}
}
	border: 1px solid var(--line-soft);
}

.focus {
	width: fit-content;
	padding: 0.2rem 0.5rem;
	border-radius: 999px;
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	background: color-mix(in srgb, var(--brand-teal) 18%, transparent);
	color: var(--brand-teal);
}

h2 {
	font-size: 1.25rem;
	margin-top: 0.7rem;
}

.role {
	margin-top: 0.35rem;
	font-weight: 650;
	color: var(--ink-800);
}

.bio {
	margin-top: 0.5rem;
	color: var(--ink-600);
}

@media (max-width: 1024px) {
	.team-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 768px) {
	.team-grid {
		grid-template-columns: 1fr;
	}
}
</style>