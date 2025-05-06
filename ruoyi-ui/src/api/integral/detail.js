import request from '@/utils/request'

// 查询用户积分明细列表
export function listUser(query) {
  return request({
    url: '/integral/detail/list',
    method: 'get',
    params: query
  })
}

// 查询用户积分明细详细
export function getUser(id) {
  return request({
    url: '/integral/detail/' + id,
    method: 'get'
  })
}

// 新增用户积分明细
export function addUser(data) {
  return request({
    url: '/integral/detail',
    method: 'post',
    data: data
  })
}

// 修改用户积分明细
export function updateUser(data) {
  return request({
    url: '/integral/detail',
    method: 'put',
    data: data
  })
}

// 删除用户积分明细
export function delUser(id) {
  return request({
    url: '/integral/detail/' + id,
    method: 'delete'
  })
}
