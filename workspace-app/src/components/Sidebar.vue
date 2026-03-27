<template>
	<aside :class="['sidebar', { 'is-expanded': isSidebarExpanded, 'is-mobile-open': isMobileMenuOpen }]">
		<div class="brand">
			<div class="brand-icon">
				<img :src="logoURL" alt="Vue" />
			</div>
			<div class="brand-text" v-if="isSidebarExpanded">
				<p class="eyebrow">SmallCompany</p>
				<h2>Launch Console</h2>
			</div>
		</div>

		<button class="menu-toggle" @click="toggleSidebar" :aria-expanded="isSidebarExpanded" aria-label="Toggle sidebar">
			<span class="material-icons" :class="{ 'is-expanded': isSidebarExpanded }">keyboard_double_arrow_right</span>
		</button>

		<nav class="menu">
			<div class="menu-group" v-for="group in navGroups" :key="group.title">
				<h3 v-if="isSidebarExpanded">{{ group.title }}</h3>
				<router-link
					v-for="item in group.items"
					:key="item.path"
					:to="item.path"
					class="button"
					@click="closeMobileMenu"
				>
					<span class="icon material-icons">{{ item.icon }}</span>
					<span class="text" v-if="isSidebarExpanded">{{ item.label }}</span>
				</router-link>
			</div>
		</nav>

		<div class="sidebar-footer" v-if="isSidebarExpanded">
			<p>v2.0 Modern</p>
			<p>Realtime Workspace</p>
		</div>
	</aside>

	<button class="mobile-trigger" @click="toggleMobileMenu" aria-label="Toggle menu">Menu</button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import logoURL from '../assets/vue.svg'
import { useUiStore } from '../stores/ui'

const navGroups = [
	{
		title: 'Workspace',
		items: [
			{ path: '/', label: 'Overview', icon: 'home' },
			{ path: '/work', label: 'Work', icon: 'work_outline' },
			{ path: '/services', label: 'Services', icon: 'construction' },
			{ path: '/insights', label: 'Insights', icon: 'insights' }
		]
	},
	{
		title: 'Company',
		items: [
			{ path: '/about', label: 'About', icon: 'description' },
			{ path: '/team', label: 'Team', icon: 'groups' },
			{ path: '/contact', label: 'Contact', icon: 'mail_outline' },
			{ path: '/settings', label: 'Settings', icon: 'settings' }
		]
	}
]

const uiStore = useUiStore()
const { isSidebarExpanded, isMobileMenuOpen } = storeToRefs(uiStore)
const { toggleSidebar, toggleMobileMenu, closeMobileMenu } = uiStore
</script>

<style lang="scss" scoped>
.sidebar {
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 0;
	height: 100vh;
	width: 84px;
	overflow: hidden;
	padding: 1rem 0.85rem;
	background: linear-gradient(180deg, rgba(9, 24, 39, 0.97), rgba(11, 30, 46, 0.95));
	color: #e9f2ff;
	border-right: 1px solid rgba(143, 178, 214, 0.2);
	transition: width 0.25s ease;

	&.is-expanded {
		width: var(--sidebar-width);
	}

	&.is-mobile-open {
		transform: translateX(0);
	}
}

.brand {
	display: flex;
	align-items: center;
	gap: 0.65rem;
	margin-bottom: 1rem;
}

.brand-icon {
	min-width: 46px;
	width: 46px;
	height: 46px;
	border-radius: 14px;
	background: linear-gradient(140deg, rgba(15, 191, 165, 0.95), rgba(94, 168, 255, 0.9));
	display: grid;
	place-items: center;

	img {
		width: 1.5rem;
	}
}

.brand-text {
	.eyebrow {
		font-size: 0.73rem;
		color: #9bb0cc;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
	}
}

.menu-toggle {
	position: absolute;
	top: 1.2rem;
	right: -0.85rem;
	z-index: 5;
	display: grid;
	place-items: center;
	width: 34px;
	height: 42px;
	border: 1px solid rgba(140, 175, 214, 0.3);
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.06);
	color: #d6e6fd;
	padding: 0;
	cursor: pointer;
	transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

	.material-icons {
		font-size: 1.35rem;
		line-height: 1;
		transition: transform 0.22s ease;

		&.is-expanded {
			transform: rotate(180deg);
		}
	}

	&:hover {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(167, 203, 242, 0.5);
		transform: translateX(2px);
	}
}

.menu {
	display: grid;
	gap: 1rem;
	overflow: auto;
	padding-right: 0.2rem;

	.menu-group {
		display: grid;
		gap: 0.4rem;

		h3 {
			font-size: 0.74rem;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: #87a1bf;
			margin-bottom: 0.2rem;
		}
	}

	.button {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.6rem;
		border-radius: 12px;
		border: 1px solid transparent;
		transition: background-color 0.22s ease, border-color 0.22s ease;

		.icon {
			width: 34px;
			height: 34px;
			border-radius: 10px;
			display: grid;
			place-items: center;
			font-size: 1.15rem;
			background: rgba(255, 255, 255, 0.08);
			color: #e7f4ff;
		}

		.text {
			font-size: 0.95rem;
			font-weight: 500;
		}

		&:hover {
			background: rgba(255, 255, 255, 0.08);
			border-color: rgba(167, 203, 242, 0.3);
		}

		&.router-link-exact-active {
			background: linear-gradient(130deg, rgba(0, 167, 142, 0.32), rgba(92, 168, 255, 0.22));
			border-color: rgba(145, 205, 255, 0.55);
		}
	}
}

.sidebar-footer {
	margin-top: auto;
	padding-top: 1rem;
	font-size: 0.78rem;
	color: #a7bad3;
	display: grid;
	gap: 0.22rem;
}

.mobile-trigger {
	display: none;
}


@media (max-width: 860px) {
	.sidebar {
		position: fixed;
		z-index: 25;
		transform: translateX(-102%);
		width: var(--sidebar-width);
		box-shadow: var(--shadow-strong);
	}

	.mobile-trigger {
		display: inline-flex;
		position: fixed;
		top: 0.9rem;
		left: 0.9rem;
		z-index: 35;
		padding: 0.55rem 0.85rem;
		border-radius: 999px;
		border: 1px solid rgba(86, 118, 151, 0.35);
		background: rgba(255, 255, 255, 0.82);
		backdrop-filter: blur(8px);
		color: var(--ink-950);
		font-weight: 700;
	}

	.menu-toggle {
		display: none;
	}
}
</style>