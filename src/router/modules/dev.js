/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const devRouter = {
  path: '/dev',
  component: Layout,
  redirect: 'noredirect',
  name: 'dev',
  meta: {
    title: '设备管理',
    icon: 'dashboard'
  },
  children: [
    {
      path: 'product',
      component: () => import('@/views/product/index'),
      name: 'dev-product-index',
      meta: { title: '产品', icon: 'example' },
      activeMenu: '/dev/product',
      children: [

      ]
    },
    {
      path: 'product/info',
      component: () => import('@/views/product/info'),
      name: 'dev-product-info',
      meta: { title: '产品概要', icon: 'example' },
      hidden: true
    },
    {
      path: 'device',
      component: () => import('@/views/device/index'),
      name: 'dev-device-index',
      meta: { title: '设备', icon: 'eye' }
    },
    {
      path: 'gateway',
      component: () => import('@/views/gateway/index'),
      name: 'dev-gateway-index',
      meta: { title: '网关设备', icon: 'international' }
    },
    {
      path: '/device/detail',
      component: () => import('@/views/device/detail'),
      name: 'dev-device-detail',
      meta: { title: '设备详情', icon: 'eye' },
      hidden: true
    },
    {
      path: '/firmware/index',
      component: () => import('@/views/firmware/index'),
      name: 'dev-firmware-index',
      meta: { title: '固件升级', icon: 'guide' }
    },
    {
      path: '/firmware/info',
      component: () => import('@/views/firmware/info'),
      name: 'dev-firmware-info',
      meta: { title: '固件信息', icon: 'eye' },
      hidden: true
    },
  ]
}

export default devRouter
