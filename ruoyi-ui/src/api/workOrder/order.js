import request from '@/utils/request'

// 查询工单列表
export function listWorkOrder(query) {
  return request({
    url: '/workOrder/list',
    method: 'get',
    params: query
  })
}

// 查询工单详细
export function getWorkOrder(id) {
  return request({
    url: '/workOrder/' + id,
    method: 'get'
  })
}

// 新增工单
export function addWorkOrder(data) {
  return request({
    url: '/workOrder/add',
    method: 'post',
    data: data
  })
}

// 修改工单
export function updateWorkOrder(data) {
  return request({
    url: '/workOrder/update',
    method: 'put',
    data: data
  })
}

// 删除工单
export function delWorkOrder(id) {
  return request({
    url: '/workOrder/' + id,
    method: 'delete'
  })
}


export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
  }


// 查询我的工单列表
export function myListWorkOrder(query) {
  return request({
    url: '/workOrder/myList',
    method: 'get',
    params: query
  })
}

// 审核工单
export function auditWorkOrder(data) {
  return request({
    url: '/workOrder/audit',
    method: 'put',
    data: data
  })
}

// 抢单
export function grabOrder(data) {
  return request({
    url: '/workOrder/grabOrder',
    method: 'put',
    data: data
  })
}

// 查询抢单列表
export function poolList(query) {
  return request({
    url: '/workOrder/poolList',
    method: 'get',
    params: query
  })
}

export function generateFixedOrders(data) {
  return request({
    url: '/workOrder/generateFixedOrders',
    method: 'post',
    data: data
  })
}
