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

<button class="menu-toggle" @click="toggleSidebar" :aria-expanded="isSidebarExpanded" :title="isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'" aria-label="Toggle sidebar">
<span class="material-icons">{{ isSidebarExpanded ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right' }}</span>
</button>

<nav class="menu">
<div class="menu-group" v-for="group in navGroups" :key="group.title">
<h3 v-if="isSidebarExpanded">{{ group.title }}</h3>
<router-link
v-for="item in group.items"
:key="item.path"
:to="item.path"
class="button"
:data-tooltip="item.label"
:aria-label="!isSidebarExpanded ? item.label : undefined"
@mouseenter="showTooltip($event, item.label)"
@mouseleave="hideTooltip"
@focus="showTooltip($event, item.label)"
@blur="hideTooltip"
@click="closeMobileMenu"
>
<span class="icon material-icons">{{ item.icon }}</span>
<span class="text" v-if="isSidebarExpanded">{{ item.label }}</span>
</router-link>
</div>
</nav>

<div class="sidebar-bottom">
<div class="sidebar-footer" v-if="isSidebarExpanded">
<p>v2.0 Modern</p>
<p>Real-time Workspace</p>
<p v-if="isAuthenticated">{{ currentUser?.name }}</p>
</div>

<div class="auth-controls">
<router-link
v-if="!isAuthenticated"
to="/login"
class="preferences-trigger auth-trigger"
@click="closeMobileMenu"
@mouseenter="showTooltip($event, 'Sign in')"
@mouseleave="hideTooltip"
@focus="showTooltip($event, 'Sign in')"
@blur="hideTooltip"
>
<span class="material-icons">login</span>
<span v-if="isSidebarExpanded">Sign in</span>
</router-link>

<button
v-else
type="button"
class="preferences-trigger auth-trigger"
@click="signOut"
@mouseenter="showTooltip($event, 'Sign out')"
@mouseleave="hideTooltip"
@focus="showTooltip($event, 'Sign out')"
@blur="hideTooltip"
>
<span class="material-icons">logout</span>
<span v-if="isSidebarExpanded">Sign out</span>
</button>
</div>

<div class="preferences">
<button class="preferences-trigger" type="button" aria-label="Open preferences">
<span class="material-icons">tune</span>
<span v-if="isSidebarExpanded">Preferences</span>
</button>

<div class="preferences-panel">
<p class="preferences-title">Theme</p>
<button
type="button"
class="theme-option"
:class="{ active: theme === 'light' }"
@click="setTheme('light')"
>
<span class="material-icons">light_mode</span>
<span>Light</span>
</button>
<button
type="button"
class="theme-option"
:class="{ active: theme === 'dark' }"
@click="setTheme('dark')"
>
<span class="material-icons">dark_mode</span>
<span>Dark</span>
</button>

<button
type="button"
class="theme-option"
:class="{ active: theme === 'system' }"
@click="setTheme('system')"
>
<span class="material-icons">settings_suggest</span>
<span>System</span>
</button>

<p class="preferences-title section-title">Density</p>
<button
type="button"
class="theme-option"
:class="{ active: density === 'comfortable' }"
@click="setDensity('comfortable')"
>
<span class="material-icons">view_stream</span>
<span>Comfortable</span>
</button>
<button
type="button"
class="theme-option"
:class="{ active: density === 'compact' }"
@click="setDensity('compact')"
>
<span class="material-icons">view_headline</span>
<span>Compact</span>
</button>

<p class="preferences-title section-title">Motion</p>
<button
type="button"
class="theme-option"
:class="{ active: motion === 'full' }"
@click="setMotion('full')"
>
<span class="material-icons">animation</span>
<span>Full motion</span>
</button>
<button
type="button"
class="theme-option"
:class="{ active: motion === 'reduced' }"
@click="setMotion('reduced')"
>
<span class="material-icons">motion_photos_off</span>
<span>Reduced motion</span>
</button>
</div>
</div>
</div>
</aside>

<transition name="sidebar-tooltip">
<div
v-if="isTooltipVisible"
class="sidebar-hover-tooltip"
:style="tooltipStyle"
>
{{ tooltipLabel }}
</div>
</transition>

<button class="mobile-trigger" @click="toggleMobileMenu" aria-label="Toggle menu">Menu</button>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import logoURL from '../assets/vue.svg'
import { useUiStore } from '../stores/ui'
import { useAuthStore } from '../stores/auth'

const navGroups = [
{
title: 'Workspace',
items: [
{ path: '/dashboard', label: 'Overview', icon: 'home' },
{ path: '/work', label: 'Work', icon: 'work_outline' },
{ path: '/services', label: 'Services', icon: 'construction' },
{ path: '/insights', label: 'Insights', icon: 'insights' },
{ path: '/vulnerabilities', label: 'Vulnerabilities', icon: 'security' }
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
const { isSidebarExpanded, isMobileMenuOpen, theme, density, motion } = storeToRefs(uiStore)
const { toggleSidebar, toggleMobileMenu, closeMobileMenu, setTheme, setDensity, setMotion } = uiStore
const authStore = useAuthStore()
const { currentUser, isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

const tooltipLabel = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)
const isTooltipVisible = ref(false)
const tooltipStyle = computed(() => ({
left: `${tooltipX.value}px`,
top: `${tooltipY.value}px`
}))

function canShowTooltip() {
return !isSidebarExpanded.value && window.matchMedia('(hover: hover)').matches
}

function updateTooltipPosition(event) {
const target = event.currentTarget
if (!target || typeof target.getBoundingClientRect !== 'function') {
return
}

const rect = target.getBoundingClientRect()
tooltipX.value = rect.right + 10
tooltipY.value = rect.top + rect.height / 2
}

function showTooltip(event, label) {
if (!canShowTooltip()) {
return
}

tooltipLabel.value = label
updateTooltipPosition(event)
isTooltipVisible.value = true
}

function hideTooltip() {
isTooltipVisible.value = false
}

async function signOut() {
await authStore.logout()
closeMobileMenu()
router.push('/login')
}
</script>

<style lang="scss" scoped>
.sidebar {
display: flex;
flex-direction: column;
position: sticky;
top: 0;
height: 100vh;
width: 84px;
overflow: visible;
padding: 1rem 0.85rem;
background: linear-gradient(180deg, var(--sidebar-bg-start), var(--sidebar-bg-end));
color: var(--sidebar-text);
border-right: 1px solid var(--sidebar-border);
transition: width 0.25s ease;
z-index: 100;

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
display: grid;
place-items: center;

img {
width: 1.7rem;
}
}

.brand-text {
.eyebrow {
font-size: 0.73rem;
color: var(--sidebar-muted);
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
top: 1.25rem;
right: -0.65rem;
z-index: 5;
display: grid;
place-items: center;
width: 22px;
height: 22px;
border: 1px solid var(--sidebar-toggle-border);
border-radius: 7px;
background: var(--sidebar-toggle-bg);
color: var(--sidebar-text);
padding: 0;
cursor: pointer;
box-shadow: 0 6px 14px rgba(3, 11, 20, 0.3);
transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

.material-icons {
font-size: 0.9rem;
line-height: 1;
}

&:hover {
border-color: var(--line-strong);
box-shadow: 0 8px 16px rgba(3, 11, 20, 0.36);
transform: translateX(1px);
}

&:focus-visible {
outline: 2px solid var(--brand-blue);
outline-offset: 2px;
}
}

.menu {
display: grid;
gap: 1rem;
overflow-y: auto;
overflow-x: hidden;
padding-right: 0;

.menu-group {
display: grid;
gap: 0.4rem;

h3 {
font-size: 0.74rem;
letter-spacing: 0.06em;
text-transform: uppercase;
color: var(--sidebar-muted);
margin-bottom: 0.2rem;
}
}

.button {
display: flex;
align-items: center;
width: 100%;
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
background: var(--sidebar-icon-bg);
color: var(--sidebar-text);
}

.text {
font-size: 0.95rem;
font-weight: 500;
}

&:hover {
background: var(--sidebar-icon-bg);
border-color: var(--line-soft);
}

&.router-link-exact-active {
background: linear-gradient(130deg, rgba(0, 167, 142, 0.32), rgba(92, 168, 255, 0.22));
border-color: rgba(145, 205, 255, 0.55);
}
}
}

.sidebar-bottom {
margin-top: auto;
display: grid;
gap: 0.6rem;
position: relative;
}

.auth-controls {
display: grid;
}

.sidebar-footer {
padding-top: 1rem;
font-size: 0.78rem;
color: var(--sidebar-footer);
display: grid;
gap: 0.22rem;
}

.preferences {
position: relative;

&:hover .preferences-panel,
&:focus-within .preferences-panel {
opacity: 1;
pointer-events: auto;
transform: translateY(0);
}
}

.preferences-trigger {
width: 100%;
display: inline-flex;
align-items: center;
gap: 0.5rem;
padding: 0.55rem 0.65rem;
border-radius: 10px;
border: 1px solid var(--line-soft);
background: var(--sidebar-icon-bg);
color: var(--sidebar-text);
font-size: 0.86rem;
font-weight: 600;
cursor: pointer;

.material-icons {
font-size: 1rem;
}

&:hover {
background: color-mix(in srgb, var(--sidebar-icon-bg) 78%, var(--surface-strong));
}
}

.preferences-panel {
position: absolute;
left: 0;
bottom: calc(100% + 0.55rem);
min-width: 205px;
padding: 0.65rem;
border-radius: 12px;
border: 1px solid var(--line-soft);
background: var(--sidebar-panel-bg);
box-shadow: 0 16px 30px rgba(2, 9, 17, 0.4);
opacity: 0;
pointer-events: none;
transform: translateY(6px);
transition: opacity 0.18s ease, transform 0.18s ease;
z-index: 8;
}

.preferences-title {
font-size: 0.76rem;
text-transform: uppercase;
letter-spacing: 0.06em;
color: var(--sidebar-panel-muted);
margin-bottom: 0.45rem;
}

.section-title {
margin-top: 0.65rem;
padding-top: 0.6rem;
border-top: 1px solid var(--line-soft);
}

.theme-option {
width: 100%;
display: flex;
align-items: center;
gap: 0.45rem;
padding: 0.48rem 0.5rem;
border: 1px solid transparent;
border-radius: 8px;
background: transparent;
color: var(--sidebar-panel-text);
cursor: pointer;

.material-icons {
font-size: 0.95rem;
}

&.active {
background: rgba(0, 167, 142, 0.22);
border-color: rgba(100, 203, 184, 0.52);
}

&:hover {
background: var(--sidebar-icon-bg);
}
}

.sidebar:not(.is-expanded) {
.menu .button {
justify-content: center;
padding: 0.55rem 0.35rem;
gap: 0;
}

.preferences-trigger {
justify-content: center;
padding-inline: 0.35rem;
}

.preferences-panel {
left: calc(100% + 0.5rem);
bottom: 0;
}
}

.mobile-trigger {
display: none;
}

.sidebar-hover-tooltip {
position: fixed;
transform: translateY(-50%);
padding: 0.36rem 0.62rem;
border-radius: 9px;
border: 1px solid color-mix(in srgb, var(--line-soft) 74%, white 26%);
background: color-mix(in srgb, var(--sidebar-panel-bg) 94%, black 6%);
color: var(--sidebar-panel-text);
box-shadow: 0 10px 22px rgba(2, 9, 17, 0.34);
font-size: 0.78rem;
font-weight: 600;
letter-spacing: 0.01em;
line-height: 1;
white-space: nowrap;
pointer-events: none;
z-index: 40;
}

.sidebar-tooltip-enter-active,
.sidebar-tooltip-leave-active {
transition: opacity 0.16s ease, transform 0.16s ease;
}

.sidebar-tooltip-enter-from,
.sidebar-tooltip-leave-to {
opacity: 0;
transform: translate(-8px, -50%) scale(0.98);
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
border: 1px solid var(--line-soft);
background: var(--surface-soft);
backdrop-filter: blur(8px);
color: var(--ink-950);
font-weight: 700;
}

.menu-toggle {
display: none;
}
}
</style>
