/**
 * 创建分类
 * @param params
 */
export async function createCategory(params?: any) {
  return await request.post<any>('/category', params)
}

/**
 * 获取所有分类
 */
export async function getAllCategories(params?: any) {
  return await request.get<any>('/category', params)
}

/**
 * 获取指定分类
 * @param id
 */
export async function getCategory(id: number) {
  return await request.get<any>(`/category/${id}`)
}

/**
 * 更新分类
 * @param params
 */
export async function updateCategory(params?: any) {
  return await request.put<any>('/category', params)
}

/**
 * 删除分类
 */
export async function deleteCategory(params: { ids: number[] }) {
  return await request.delete<null>('/category', params)
}

/**
 * 获取分类下的文章
 * @param id
 */
export async function getCategoryArticles(id: number) {
  return await request.get<any>(`/categories/${id}/articles`)
}
