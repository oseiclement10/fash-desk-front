import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

export interface FieldsErros {
  [key: string]: string;
}



export type ImportValidationError = {
  row: number;
  errors: Record<string, string[]>;
}

interface CustomResponseData {
  message: string;
  error: string;
  errors: FieldsErros[];
}

interface CustomAxiosResponse<T = CustomResponseData> extends AxiosResponse<T> {
  data: T;
}

export interface RequestError extends AxiosError<CustomResponseData> {
  response: CustomAxiosResponse;
}

export type FetchDataErrorProps = {
  errMsg: string;
  description?: string;
  errHandler: () => void;
}