export interface FormErrors {
    name?: string;
    phone?: string;
    title?: string;
    image?: string;
    submit?: string;
  }
  
  export interface GetRequestsParams {
  search?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

  export interface IRequest {
    _id?: string;
    id?: string;
    name: string;
    phone: string;
    title: string;
    image?: string;
    timestamp?: string;
  }
  
  export interface IMeta {
    totalCount: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }

  export interface ApiResponse<T> {
    data: T;
    meta?: IMeta;
  }
  
  