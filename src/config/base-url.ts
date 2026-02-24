import { isProduction } from "./env";

export const BASE_URL = isProduction ?
   import.meta.env.VITE_REACT_APP_PROD_BASE_URL
  : import.meta.env.VITE_REACT_APP_TEST_BASE_URL;