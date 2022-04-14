export interface CRUD {
  getAll: (limit: number, page: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  getById: (id: string) => Promise<any>;
  patchById: (id: string, resource: any) => Promise<string>;
  putById: (id: string, resource: any) => Promise<string>;
  deleteById: (id: string) => Promise<any>;
}
