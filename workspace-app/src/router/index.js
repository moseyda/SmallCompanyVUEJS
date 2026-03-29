import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '../stores/auth'

export const routes = [
    {
        path: '/',
        name: 'landing',
        component: () => import('../views/Landing.vue'),
        meta: { title: 'ScannerHub', publicOnly: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Home,
        meta: { title: 'Dashboard', requiresAuth: true }
    },
    {
        path: '/work',
        name: 'work',
        component: () => import('../views/Work.vue'),
        meta: { title: 'Work', requiresAuth: true }
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('../views/Services.vue'),
        meta: { title: 'Services', requiresAuth: true }
    },
    {
        path: '/insights',
        name: 'insights',
        component: () => import('../views/Insights.vue'),
        meta: { title: 'Insights', requiresAuth: true }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue'),
        meta: { title: 'About', requiresAuth: true }
    },
    {
        path: '/team',
        name: 'team',
        component: () => import('../views/Team.vue'),
        meta: { title: 'Team', requiresAuth: true }
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/Contact.vue'),
        meta: { title: 'Contact', requiresAuth: true }
    },
    {
        path: '/vulnerabilities/:id',
        name: 'vulnerability-detail',
        component: () => import('../views/VulnerabilityDetail.vue'),
        meta: { title: 'Vulnerability Details', requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: { title: 'Sign In', publicOnly: true }
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/Setting.vue'),
        meta: { title: 'Settings', requiresAuth: true, requiredPermission: 'settings:read' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export function installAuthGuard(router, pinia) {
    router.beforeEach((to) => {
        const authStore = useAuthStore(pinia)

        // Unauthenticated users trying to access protected routes go to login
        if (to.meta.requiresAuth && !authStore.isAuthenticated) {
            return {
                path: '/login',
                query: { redirect: to.fullPath }
            }
        }

        // Check permission requirements
        if (to.meta.requiredPermission && !authStore.hasPermission(to.meta.requiredPermission)) {
            return '/dashboard'
        }

        // Authenticated users trying to access public-only routes (landing, login) redirect to dashboard
        if (to.meta.publicOnly && authStore.isAuthenticated) {
            const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard'
            return redirect
        }

        return true
    })
}

router.afterEach((to) => {
    document.title = `${to.meta.title || 'ScannerHub'} | ScannerHub`
})

export default router