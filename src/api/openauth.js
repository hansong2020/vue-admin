import request from '@/utils/request'

export function appListApi(data) {
  return request({
    url: '/open/auth/list',
    method: 'post',
    data
  })
}
export function appDeleteApi(id) {
  return request({
    url: '/open/auth/delete',
    method: 'get',
    params: { id }
  })
}

export function appSecretApi(key) {
  return request({
    url: '/open/auth/secret',
    method: 'get',
    params: { key }
  })
}

export function openAuthAddApi(data) {
  return request({
    url: '/open/auth/add',
    method: 'post',
    data
  })
}

