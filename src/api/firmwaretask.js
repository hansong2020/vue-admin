import request from '@/utils/request'

export function taskSearchApi(data) {
  return request({
    url: '/firmware/task/search',
    method: 'post',
    data
  })
}

 

export function taskCreateApi(data) {
  return request({
    url: '/firmware/task/create',
    method: 'post',
    data
  })
}

export function firmwareDeleteApi(id) {
  return request({
    url: '/firmware/task/delete',
    method: 'get',
    params: { id }
  })
}

export function taskUpgradeApi(data) {
  return request({
    url: '/firmware/task/upgrade',
    method: 'post',
    data
  })
}


export function taskDetailSearchApi(data) {
  return request({
    url: '/firmware/task/detail',
    method: 'post',
    data
  })
}

export function taskDeviceSearch(data) {
  return request({
    url: '/firmware/task/device',
    method: 'post',
    data
  })
}
