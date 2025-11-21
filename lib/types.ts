export interface FormErrors {
    name?: string;
    phone?: string;
    title?: string;
    image?: string;
    submit?: string;
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
  
  