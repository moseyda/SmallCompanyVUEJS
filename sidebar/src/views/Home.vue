<template>
	<main id="home-page">
		<section class="hero">
			<h1>Welcome to My Vue.js App</h1>
			<p>Building modern web apps has never been this exciting!</p>
			<button @click="learnMore">Get Started</button>
		</section>

		<section class="features">
			<div class="card">
				<span class="material-icons">bolt</span>
				<h2>Fast</h2>
				<p>Lightning-fast performance with Vue 3.</p>
			</div>
			<div class="card">
				<span class="material-icons">palette</span>
				<h2>Modern UI</h2>
				<p>Designed with a clean and beautiful interface.</p>
			</div>
			<div class="card">
				<span class="material-icons">devices</span>
				<h2>Responsive</h2>
				<p>Works seamlessly on all devices.</p>
			</div>
		</section>
	</main>
</template>

<script setup>
const learnMore = () => {
	alert("Welcome to Vue.js! Let's build something great!");
};
</script>

<style scoped>
#home-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 4rem 2rem;
	color: var(--dark);
}

.hero {
	margin-bottom: 3rem;
}

h1 {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
}

p {
	font-size: 1.2rem;
	color: var(--grey);
}

button {
	margin-top: 1rem;
	background-color: var(--primary);
	color: white;
	padding: 0.8rem 1.5rem;
	border-radius: 8px;
	font-size: 1rem;
	transition: 0.3s;
}

button:hover {
	background-color: var(--primary-alt);
}

.features {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	flex-wrap: wrap;
	margin-top: 2rem;
}

.card {
	background: white;
	padding: 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	max-width: 300px;
	text-align: center;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	cursor: pointer;
}

.card:hover {
	transform: scale(1.1);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card span {
	font-size: 3rem;
	color: var(--primary);
	margin-bottom: 1rem;
}
</style>
