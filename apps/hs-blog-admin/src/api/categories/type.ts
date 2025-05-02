export interface CategoryReq {
  name: string;
  description?: string;
}

export interface UpdateCategoryReq {
  name?: string;
  description?: string;
}
