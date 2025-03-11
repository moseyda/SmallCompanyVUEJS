<template>
	<main id="about-page">
		<section class="hero">
			<h1>About Us</h1>
			<p>We are passionate about building modern web applications with Vue.js.</p>
		</section>

		<section class="about-content">
			<div class="text">
				<h2>Who We Are</h2>
				<p>
					We are a team of developers, designers, and thinkers who love creating 
					beautiful, functional, and high-performance web applications.
				</p>
				<p>
					Our goal is to make web development fun, efficient, and accessible to everyone. 
					Using the latest technologies, we strive to build user-friendly experiences 
					that stand out.
				</p>
			</div>
			<div class="image">
				<img src="../assets/about-image.jpg" alt="Team working together">
			</div>
		</section>

		<section class="mission">
			<h2>Our Mission</h2>
			<p>
				To empower developers and businesses by providing high-quality, scalable, 
				and intuitive web solutions using Vue.js and modern technologies.
			</p>
		</section>
	</main>
</template>

<style scoped>
#about-page {
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
	font-size: 2.8rem;
	margin-bottom: 0.5rem;
}

p {
	font-size: 1.2rem;
	color: var(--grey);
	max-width: 800px;
	margin: 0 auto;
}

.about-content {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	margin-top: 3rem;
	flex-wrap: wrap;
	max-width: 1100px;
}

.text {
	flex: 1;
	text-align: left;
}

.text h2 {
	font-size: 2rem;
	margin-bottom: 1rem;
}

.text p {
	margin-bottom: 1rem;
}

.image {
	flex: 1;
	display: flex;
	justify-content: center;
}

.image img {
	max-width: 100%;
	height: auto;
	border-radius: 12px;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.mission {
	margin-top: 4rem;
	background: var(--primary);
	color: white;
	padding: 3rem;
	width: 100%;
	max-width: 900px;
	border-radius: 12px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.mission h2 {
	margin-bottom: 1rem;
	font-size: 2rem;
}

.mission p {
	font-size: 1.2rem;
	color: white;
}

@media (max-width: 768px) {
	.about-content {
		flex-direction: column;
		text-align: center;
	}

	.text {
		text-align: center;
	}
}
</style>
