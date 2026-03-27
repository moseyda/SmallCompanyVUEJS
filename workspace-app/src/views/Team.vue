<template>
	<div class="page-wrap">
		<section class="glass panel">
			<h1>The Team Behind the Scale-Up</h1>
			<p class="lead">
				Multi-disciplinary specialists operating in tight loops to ship confident releases.
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
			<article class="card-item" v-for="member in filteredMembers" :key="member.name">
				<img class="avatar" :src="member.photo" :alt="member.name" />
				<p class="focus">{{ member.focus }}</p>
				<h2>{{ member.name }}</h2>
				<p class="role">{{ member.role }}</p>
				<p class="bio">{{ member.bio }}</p>
			</article>
		</section>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const filters = ['All', 'Engineering', 'Design', 'Strategy', 'Data', 'Operations']
const activeFilter = ref('All')
const workspaceStore = useWorkspaceStore()
const { teamMembers } = storeToRefs(workspaceStore)

onMounted(() => {
	workspaceStore.fetchTeamMembers()
})

const filteredMembers = computed(() => {
	if (activeFilter.value === 'All') {
		return teamMembers.value
	}

	return teamMembers.value.filter((member) => member.focus === activeFilter.value)
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

.avatar {
	width: 100%;
	height: 230px;
	object-fit: cover;
	border-radius: 12px;
	margin-bottom: 0.75rem;
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