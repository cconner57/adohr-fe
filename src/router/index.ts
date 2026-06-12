import { nextTick } from 'vue'
import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'

import { useMetrics } from '../composables/useMetrics'
import Home from '../pages/Home.vue'

const About = () => import('../pages/About.vue')
const Adopt = () => import('../pages/Adopt.vue')
const Donate = () => import('../pages/Donate.vue')
const Foster = () => import('../pages/Foster.vue')
const PetMedicalProfile = () => import('../pages/PetMedicalProfile.vue')
const NotFound = () => import('../pages/NotFound.vue')
const News = () => import('../pages/News.vue')
const PetAdoption = () => import('../pages/PetAdoption.vue')
const SurrenderPet = () => import('../pages/SurrenderPet.vue')
const Volunteer = () => import('../pages/Volunteer.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/about',
      component: About,
    },
    {
      path: '/pets/:slug/medical',
      component: PetMedicalProfile,
    },
    { path: '/adopt', name: 'adopt-list', component: Adopt },
    {
      path: '/adopt/:id',
      name: 'adopt-pet',
      component: Adopt,
      props: true,
    },
    {
      path: '/donate',
      component: Donate,
    },
    {
      path: '/volunteer',
      component: Volunteer,
    },
    {
      path: '/foster',
      component: Foster,
    },
    {
      path: '/surrender',
      component: SurrenderPet,
    },
    {
      path: '/news',
      component: News,
    },
    {
      path: '/pet-adoption/:id',
      component: PetAdoption,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

interface CustomViewTransitionDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startViewTransition: any
}

import { useUIStore } from '../stores/ui'

router.beforeEach(async () => {
  const uiStore = useUIStore()
  uiStore.startLoading()
})

router.beforeResolve((to, from, next) => {
  const doc = document as unknown as CustomViewTransitionDocument

  if (!doc.startViewTransition || from === START_LOCATION) {
    next()
    return
  }

  doc.startViewTransition(async () => {
    next()
    await nextTick()
  })
})

router.afterEach((to) => {
  const { submitMetric } = useMetrics()
  const uiStore = useUIStore()

  uiStore.stopLoading()
  submitMetric('page_view', { path: to.fullPath })
})

router.onError(() => {
  const uiStore = useUIStore()
  uiStore.stopLoading()
})

export default router
