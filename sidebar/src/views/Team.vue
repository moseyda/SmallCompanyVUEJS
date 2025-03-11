<template>
	<main id="team-page">
		<h1>Meet the Team</h1>
		<p>Our amazing team of passionate developers and designers.</p>

		<section class="team-cards">
			<div class="card" v-for="(member, index) in teamMembers" :key="index">
				<img :src="member.photo" :alt="member.name" class="team-photo" />
				<div class="card-content">
					<h3>{{ member.name }}</h3>
					<p class="role">{{ member.role }}</p>
					<p>{{ member.summary }}</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
const teamMembers = [
	{
		name: "Mark Johnson",
		role: "Frontend Developer",
		summary: "Mark is a passionate frontend developer with a focus on UX and performance.",
		photo: "src/assets/mark.jpg"
	},
	{
		name: "Bob Smith",
		role: "Backend Developer",
		summary: "Bob specialises in server-side technologies and database management.",
		photo: "src/assets/person2.jpg"
	},
	{
		name: "Charlie Brown",
		role: "Designer",
		summary: "Charlie brings the vision to life with stunning UI/UX designs.",
		photo: "src/assets/person3.jpg"
	},
	{
		name: "Alice White",
		role: "Project Manager",
		summary: "Alice ensures smooth project execution and team collaboration.",
		photo: "src/assets/person4.jpg"
	},
	{
		name: "Dan Green",
		role: "Developer",
		summary: "Dan excels in full-stack development with a focus on modern JavaScript frameworks.",
		photo: "src/assets/person5.jpg"
	},
	{
		name: "Frank Miller",
		role: "QA Engineer",
		summary: "Frank ensures quality by testing and improving the functionality of our apps.",
		photo: "src/assets/person6.jpg"
	},
	{
		name: "Joseph Lee",
		role: "Marketing",
		summary: "Joseph handles the marketing side, ensuring the world knows about our products.",
		photo: "src/assets/person7.jpg"
	},
	{
		name: "Harry Adams",
		role: "Support Specialist",
		summary: "Harry provides customer support and helps with troubleshooting.",
		photo: "src/assets/person8.jpg"
	}
];
</script>

<style scoped>
#team-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 4rem 2rem;
	color: var(--dark);
}

h1 {
	font-size: 2.5rem;
	margin-bottom: 1rem;
}

p {
	font-size: 1.2rem;
	color: var(--grey);
	margin-bottom: 2rem;
}

.team-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 2rem;
	width: 100%;
	max-width: 1200px;
}

.card {
	background-color: white;
	border-radius: 10px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	text-align: center;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	cursor: pointer;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.team-photo {
	width: 100%;
	height: 200px;
	object-fit: cover;
	border-bottom: 1px solid #eee;
}

.card-content {
	padding: 1.5rem;
}

h3 {
	font-size: 1.5rem;
	margin: 1rem 0;
}

.role {
	font-size: 1.1rem;
	color: var(--primary);
	margin-bottom: 1rem;
}

p {
	font-size: 1rem;
	color: var(--grey);
}

@media (max-width: 1024px) {
	.team-cards {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 768px) {
	.team-cards {
		grid-template-columns: 1fr;
	}
}
</style>