import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

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
        path: '/settings',
        name: 'settings',
        component: () => import('../views/Setting.vue'),
        meta: { title: 'Settings' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to) => {
    document.title = `${to.meta.title || 'SmallCompany'} | SmallCompany`
})

export default router