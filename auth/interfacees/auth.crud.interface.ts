export interface AuthCRUD {
  getAll: (limit: number, page: number, userId: string) => Promise<any>;
  create: (userId: string, resource: any) => Promise<any>;
  getById: (id: string) => Promise<any>;
  patchById: (id: string, resource: any) => Promise<string>;
  putById: (id: string, resource: any) => Promise<string>;
  deleteById: (id: string) => Promise<any>;
}
