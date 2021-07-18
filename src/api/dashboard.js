import request from '@/utils/request'

export function dashBoardIndexApi(timestamp) {
  return request({
    url: 'dashboard/index',
    method: 'get',
    params: { timestamp }
  })
}
