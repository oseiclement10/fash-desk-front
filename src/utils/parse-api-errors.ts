import type { RequestError, FieldsErros, ImportValidationError } from "@/@types/error";

export const parseApiError = (err: RequestError): string => {
  switch (err.request?.status) {
    case 422:
      return err.response.data.errors ? handleValidationError(err.response.data.errors, err.response.data?.message) : err.response.data.message;
    default:
      return err.response?.data?.message ?? err.message;
  }
};


const handleValidationError = (errors: any, message: string) => {

  if (message == "Validation failed for some rows.") {
    return handleImportValidationErrors(errors);
  }
  return parseFieldErrors(errors);
}


const handleImportValidationErrors = (errors: ImportValidationError[]) => {
 
  const errorMessages: string[] = [];
  errors.forEach((error) => {
    errorMessages.push(`Row ${error.row}: ${getRowError(error.errors)}`);
  });
  return errorMessages.join("\n ");

}

const getRowError = (err: ImportValidationError["errors"]) => {
  return Object.values(err).join(",");
}

const parseFieldErrors = (errFields: FieldsErros[]): string => {
  const fields = Object.values(errFields);
  return fields.join(",");
};
