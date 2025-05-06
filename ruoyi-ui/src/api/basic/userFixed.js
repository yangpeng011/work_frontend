import request from '@/utils/request'

// 查询固定单用户配置表列表
export function listUserFixed(query) {
  return request({
    url: '/basic/userFixed/list',
    method: 'get',
    params: query
  })
}

// 查询固定单用户配置表详细
export function getUserFixed(id) {
  return request({
    url: '/basic/userFixed/' + id,
    method: 'get'
  })
}

// 新增固定单用户配置表
export function addUserFixed(data) {
  return request({
    url: '/basic/userFixed',
    method: 'post',
    data: data
  })
}

// 修改固定单用户配置表
export function updateUserFixed(data) {
  return request({
    url: '/basic/userFixed',
    method: 'put',
    data: data
  })
}

// 删除固定单用户配置表
export function delUserFixed(id) {
  return request({
    url: '/basic/userFixed/' + id,
    method: 'delete'
  })
}
