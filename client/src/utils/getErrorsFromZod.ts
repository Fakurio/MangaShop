import { fromZodError } from "zod-validation-error";
import type { SafeParseReturnType } from "zod";

const getErrorsFromZod = <T extends Record<string, unknown>>(
  parsedObject: SafeParseReturnType<T, T>,
) => {
  const errors: Partial<Record<keyof T, string>> = {};

  if (!parsedObject.success) {
    fromZodError(parsedObject.error).details.forEach((error) => {
      const key = error.path.join("") as keyof T;
      errors[key] = error.message;
    });
    return errors;
  }

  return undefined;
};

export { getErrorsFromZod };
