<template>
	<main id="contact-page">
		<section class="hero">
			<h1>Contact Us</h1>
			<p>We’d love to hear from you! Reach out to us using the form below or visit our office.</p>
		</section>

		<section class="contact-content">
			<div class="form-section">
				<h2>Get in Touch</h2>
				<form @submit.prevent="submitForm">
					<div class="input-group">
						<label for="name">Name</label>
						<input type="text" id="name" v-model="form.name" required />
					</div>

					<div class="input-group">
						<label for="email">Email</label>
						<input type="email" id="email" v-model="form.email" required />
					</div>

					<div class="input-group">
						<label for="message">Message</label>
						<textarea id="message" v-model="form.message" required></textarea>
					</div>

					<button type="submit">Send Message</button>
				</form>
			</div>

			<div class="info-section">
				<h2>Contact Information</h2>
				<p><strong>Email:</strong> contact@yourcompany.com</p>
				<p><strong>Phone:</strong> +1 234 567 890</p>
				<p><strong>Address:</strong> 123 Vue Street, Web City, CodeLand</p>

				<div class="map">
					<iframe
						width="100%"
						height="275"
						style="border:0; border-radius: 10px;"
						loading="lazy"
						allowfullscreen
						referrerpolicy="no-referrer-when-downgrade"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d369.1188693597663!2d-0.11931967150985479!3d51.51090668236304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ca37f60e13%3A0xc7563fe433ad32a4!2s87%20Savoy%20St%2C%20London%20WC2R%200AG!5e0!3m2!1sar!2suk!4v1738883786198!5m2!1sar!2suk">
					</iframe>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
	name: '',
	email: '',
	message: ''
});

const submitForm = () => {
	alert(`Thank you, ${form.name}! Your message has been sent.`);
	form.name = '';
	form.email = '';
	form.message = '';
};
</script>

<style scoped>
#contact-page {
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

.contact-content {
	display: flex;
	gap: 3rem;
	justify-content: center;
	align-items: flex-start;
	max-width: 1100px;
	width: 100%;
	flex-wrap: wrap;
}

.form-section {
	flex: 1;
    min-height: 500px;
	background: white;
	padding: 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-group {
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
}

label {
	font-size: 1.1rem;
	margin-bottom: 0.5rem;
}

input, textarea {
	width: 100%;
	padding: 0.8rem;
	border: 1px solid #ccc;
	border-radius: 8px;
	font-size: 1rem;
}

textarea {
	height: 120px;
	resize: none;
}

button {
	width: 100%;
	padding: 0.8rem;
	background: var(--primary);
	color: white;
	font-size: 1.2rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.3s;
}

button:hover {
	background: var(--primary-dark);
}

.info-section {
	flex: 1;
    min-height: 500px;
	background: var(--light-grey);
	padding: 2rem;
	border-radius: 12px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	text-align: left;
}

.info-section h2 {
	margin-bottom: 1rem;
}

.info-section p {
	margin-bottom: 0.5rem;
}

.map {
	margin-top: 1rem;
}

@media (max-width: 768px) {
	.contact-content {
		flex-direction: column;
		align-items: center;
	}

	.form-section, .info-section {
		width: 100%;
		text-align: center;
	}
}
</style>
