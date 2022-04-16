export interface CRUD {
  getAll: (limit: number, page: number, user?: any) => Promise<any>;
  create: (resource: any, user?: any) => Promise<any>;
  getById: (id: string, user?: any) => Promise<any>;
  patchById: (id: string, resource: any, user?: any) => Promise<string>;
  putById: (id: string, resource: any, user?: any) => Promise<string>;
  deleteById: (id: string, user?: any) => Promise<any>;
}
