<template>
	<div class="page-wrap">
		<section class="glass panel">
			<h1>Let’s Build the Next Release Together</h1>
			<p class="lead">
				Share your goals, current bottlenecks, and timeline. We usually respond within one business day.
			</p>
		</section>

		<section class="contact-layout">
			<article class="glass panel">
				<h2 class="section-title">Project Enquiry</h2>
				<form class="field-stack" @submit.prevent="submitForm">
					<label class="field-label" for="name">Name</label>
					<input class="input-field" id="name" type="text" v-model="form.name" required />

					<label class="field-label" for="email">Work Email</label>
					<input class="input-field" id="email" type="email" v-model="form.email" required />

					<label class="field-label" for="scope">Project Scope</label>
					<select class="select-field" id="scope" v-model="form.scope">
						<option>Product Build</option>
						<option>Modernisation</option>
						<option>Data and Insights</option>
						<option>Team Extension</option>
					</select>

					<label class="field-label" for="message">What are you trying to unlock?</label>
					<textarea class="textarea-field" id="message" v-model="form.message" required></textarea>

					<button class="btn btn-primary" type="submit">Send Brief</button>
				</form>
			</article>

			<article class="glass panel info-stack">
				<h2 class="section-title">Studios</h2>
				<div class="card-list">
					<div class="card-item" v-for="office in offices" :key="office.city">
						<h3>{{ office.city }}</h3>
						<p>{{ office.address }}</p>
						<p class="muted">{{ office.focus }}</p>
					</div>
				</div>
				<div class="meta">
					<p><strong>Email:</strong> hello@smallcompany.io</p>
					<p><strong>Phone:</strong> +1 (415) 555-0138</p>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
const { offices } = storeToRefs(workspaceStore)

const form = reactive({
	name: '',
	email: '',
	scope: 'Product Build',
	message: ''
})

onMounted(() => {
	workspaceStore.fetchOffices()
})

const submitForm = async () => {
	try {
		await workspaceStore.submitInquiry(form)
		alert(`Thanks ${form.name}, we received your brief and will follow up shortly.`)
		form.name = ''
		form.email = ''
		form.scope = 'Product Build'
		form.message = ''
	} catch {
		alert('Unable to submit enquiry at the moment. Please try again.')
	}
}
</script>

<style scoped>
h1 {
	font-size: clamp(1.7rem, 3.8vw, 2.8rem);
	margin-bottom: 0.7rem;
}

.contact-layout {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: 0.9rem;
}

.info-stack {
	align-self: start;
}

.muted {
	margin-top: 0.25rem;
	color: var(--ink-600);
}

.meta {
	margin-top: 0.9rem;
	display: grid;
	gap: 0.35rem;
}

@media (max-width: 768px) {
	.contact-layout {
		grid-template-columns: 1fr;
	}
}
</style>
