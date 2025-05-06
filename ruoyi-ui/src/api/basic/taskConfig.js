import request from '@/utils/request'

// 查询任务配置列表
export function listTaskConfig(query) {
  return request({
    url: '/basic/taskConfig/list',
    method: 'get',
    params: query
  })
}

// 查询任务配置详细
export function getTaskConfig(id) {
  return request({
    url: '/basic/taskConfig/' + id,
    method: 'get'
  })
}

// 新增任务配置
export function addTaskConfig(data) {
  return request({
    url: '/basic/taskConfig',
    method: 'post',
    data: data
  })
}

// 修改任务配置
export function updateTaskConfig(data) {
  return request({
    url: '/basic/taskConfig',
    method: 'put',
    data: data
  })
}

// 删除任务配置
export function delTaskConfig(id) {
  return request({
    url: '/basic/taskConfig/' + id,
    method: 'delete'
  })
}
