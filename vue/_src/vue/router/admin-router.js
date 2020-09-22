import Vue from 'vue'
import Router from 'vue-router'

import dashboard from '../components/admin/dashboard.vue'
import profile from '../components/admin/profile.vue'
import account from '../components/admin/account.vue'
import terms from '../components/admin/terms.vue'
import privacy from '../components/admin/privacy.vue'
import event from '../components/admin/event.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/admin',
      component: dashboard
    },
    {
      path: '/admin/account',
      component: account
  },
    {
      path: '/admin/profile',
      component: profile
    },
    {
      path: '/admin/terms',
      component: terms
    },
    {
      path: '/admin/privacy',
      component: privacy
    },
    {
      path: '/admin/event',
      component: event,
    },
    {
      path: '/admin/event/:id/edit',
      component: event,
    },
  ]
});
