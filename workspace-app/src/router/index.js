import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '../stores/auth'

export const routes = [
    {
        path: '/',
        name: 'overview',
        component: Home,
        meta: { title: 'Overview' }
    },
    {
        path: '/work',
        name: 'work',
        component: () => import('../views/Work.vue'),
        meta: { title: 'Work' }
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('../views/Services.vue'),
        meta: { title: 'Services' }
    },
    {
        path: '/insights',
        name: 'insights',
        component: () => import('../views/Insights.vue'),
        meta: { title: 'Insights' }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue'),
        meta: { title: 'About' }
    },
    {
        path: '/team',
        name: 'team',
        component: () => import('../views/Team.vue'),
        meta: { title: 'Team' }
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/Contact.vue'),
        meta: { title: 'Contact' }
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
        meta: { title: 'Settings', requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export function installAuthGuard(router, pinia) {
    router.beforeEach((to) => {
        const authStore = useAuthStore(pinia)

        if (to.meta.requiresAuth && !authStore.isAuthenticated) {
            return {
                path: '/login',
                query: { redirect: to.fullPath }
            }
        }

        if (to.meta.publicOnly && authStore.isAuthenticated) {
            const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
            return redirect
        }

        return true
    })
}

router.afterEach((to) => {
    document.title = `${to.meta.title || 'SmallCompany'} | SmallCompany`
})

export default router