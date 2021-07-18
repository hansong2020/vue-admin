/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const openRouter = {
  path: '/open',
  component: Layout,
  redirect: 'noredirect',
  name: 'open',
  meta: {
    title: '开放平台',
    icon: 'peoples'
  },
  children: [
    {
      path: 'app',
      component: () => import('@/views/openauth/index'),
      name: 'open-app',
      meta: { title: '第三方授权', icon: 'people' },
      activeMenu: '/open/app',
      children: [

      ]
    }
  ]
}

export default openRouter
