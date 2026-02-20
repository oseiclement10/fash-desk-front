import type { PaginatedResponse, UpdateProps } from "@/@types/common";
import {
  deleteHelper,
  fileResponsePost,
  getHelper,
  postHelper,
  postWithFile,
  updateHelper
} from "./apiService";
import { removeEmptyValues } from "@/utils/remove-emtpy-values";

export class CrudService<T> {

  protected path: string = "";

  constructor(path: string,) {
    this.path = path;
  }

  getPath = () => this.path;

  getData(params?: Record<string, any>, extraPath?: string): Promise<T> {
    const path = extraPath ? `${this.path}/${extraPath}` : this.path;
    return getHelper<T>(path, removeEmptyValues(params));
  }

  getRaw<B>(params?: Record<string, any>, secondaryPath?: string): Promise<B> {
    return getHelper<B>(secondaryPath ? `${this.path}/${secondaryPath}` : this.path, removeEmptyValues(params));
  }

  getPaginatedData(params?: Record<string, any>, secondaryPath?: string, replace?: boolean): Promise<PaginatedResponse<T>> {
    const path = secondaryPath ? replace ? secondaryPath : `${this.path}/${secondaryPath}` : this.path;
    return getHelper<PaginatedResponse<T>>(path, removeEmptyValues(params));
  }

  getDetails(id: number, params?: Record<string, any>, extraPath?: string): Promise<T> {
    const path = extraPath ? `${this.path}/${extraPath}` : this.path;
    return getHelper<T>(`${path}/${id}`, removeEmptyValues(params));
  }

  getPaginatedDetails(id: number): Promise<PaginatedResponse<T>> {
    return getHelper<PaginatedResponse<T>>(`${this.path}/${id}`);
  }

  getActive(params?: Record<string, any>): Promise<PaginatedResponse<T>> {
    return getHelper<PaginatedResponse<T>>(`${this.path}/active`, removeEmptyValues(params));
  }

  getWithPath(secondaryPath: string, params?: Record<string, any>): Promise<T> {
    return getHelper<T>(`${this.path}/${secondaryPath}`, removeEmptyValues(params));
  }

  // mutators

  addNewItem<B = T>(data: object, extraPath?: string): Promise<B | T[]> {
    const path = extraPath ? `${this.path}/${extraPath}` : this.path;
    return postHelper(path, data);
  }

  updateItem({ id, data, extraPath }: UpdateProps): Promise<T> {
    const path = extraPath ? `${this.path}/${extraPath}` : this.path;
    return updateHelper(path, id.toString(), data, !!extraPath);
  }

  deleteItem(id: string | number, secondaryPath?: string): Promise<string> {
    return deleteHelper(`${this.path}${secondaryPath ? `/${secondaryPath}` : ""}`, id.toString());
  }



  addNewItemWithFile(data: object, extraPath?: string) {
    return postWithFile(extraPath ? `${this.path}/${extraPath}` : this.path, data);
  }

  updateItemWithFile({ id, data, extraPath }: UpdateProps) {
    const path = extraPath ? `${this.path}/${extraPath}` : `${this.path}/${id}`;
    return postWithFile(path, data);
  }

  fileResponsePost(path: string, data: unknown) {
    return fileResponsePost(path ? `${this.path}/${path}` : this.path, data);
  }




}
