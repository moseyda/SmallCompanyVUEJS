<template>
	<div class="page-wrap">
		<section class="glass panel">
			<p class="eyebrow">About SmallCompany</p>
			<h1>We design ambitious digital systems for teams that move fast.</h1>
			<p class="lead">
				Our approach combines strategy, design, engineering, and analytics in one integrated
				delivery model. The result is less friction, better products, and clearer momentum.
			</p>
		</section>

		<section class="grid-two">
			<article class="glass panel">
				<h2 class="section-title">How We Work</h2>
				<div class="card-list">
					<div class="card-item" v-for="pillar in pillars" :key="pillar.title">
						<h3>{{ pillar.title }}</h3>
						<p class="detail">{{ pillar.detail }}</p>
					</div>
				</div>
			</article>

			<article class="glass panel">
				<h2 class="section-title">Core Principles</h2>
				<ul class="principles">
					<li v-for="principle in principles" :key="principle">{{ principle }}</li>
				</ul>
			</article>
		</section>

		<section class="glass panel">
			<h2 class="section-title">Growth Timeline</h2>
			<div class="timeline">
				<article class="phase" v-for="phase in milestones" :key="phase.quarter">
					<p class="quarter">{{ phase.quarter }}</p>
					<h3>{{ phase.title }}</h3>
					<p>{{ phase.note }}</p>
				</article>
			</div>
		</section>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
const { milestones } = storeToRefs(workspaceStore)

onMounted(() => {
	workspaceStore.fetchMilestones()
})

const pillars = [
	{ title: 'Product-led planning', detail: 'Roadmaps aligned to measurable business outcomes and customer value.' },
	{ title: 'Integrated squads', detail: 'Designers, engineers, and strategists work in one shared delivery cadence.' },
	{ title: 'Continuous insight loops', detail: 'Telemetry and feedback directly shape every release decision.' }
]

const principles = [
	'Resolve complexity before scaling implementation.',
	'Design for velocity without sacrificing maintainability.',
	'Make product health visible to every stakeholder.',
	'Favor practical systems over trend-driven architecture.'
]
</script>

<style scoped>
.eyebrow {
	font-size: 0.8rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--ink-600);
	margin-bottom: 0.4rem;
}

h1 {
	font-size: clamp(1.6rem, 3.6vw, 2.8rem);
	margin-bottom: 0.8rem;
}

.detail {
	margin-top: 0.45rem;
	color: var(--ink-600);
}

.principles {
	list-style: none;
	display: grid;
	gap: 0.7rem;
}

.principles li {
	padding: 0.8rem;
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.74);
	border: 1px solid rgba(85, 111, 138, 0.2);
}

.timeline {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 0.8rem;
}

.phase {
	padding: 0.85rem;
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.8);
	border: 1px solid rgba(83, 109, 136, 0.24);
}

.quarter {
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.07em;
	text-transform: uppercase;
	color: var(--brand-teal);
}

.phase h3 {
	margin: 0.35rem 0;
}


@media (max-width: 960px) {
	.timeline {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 640px) {
	.timeline {
		grid-template-columns: 1fr;
	}
}
</style>
