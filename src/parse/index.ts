import { Feedback } from "../lib/FormModel";

export const parseFeedback = (ex: any) => {
  const feedback: Feedback = {};
  // YUM
  if (ex.inner && Array.isArray(ex.inner)) {
    ex.inner.forEach((error: any) => {
      const path = error.path?.replace(/\[(\d+)\]/g, ".$1") || ".";
      const errorMessage = error.message || "Validation error";
      feedback[path] = { type: "invalid", message: errorMessage };
    });
  }
  // JOI
  else if (ex.details && Array.isArray(ex.details)) {
    ex.details.forEach((error: any) => {
      const path = error.path?.join(".").replace(/\[(\d+)\]/g, ".$1") || ".";
      const errorMessage = error.message || "Validation error";
      feedback[path] = { type: "invalid", message: errorMessage };
    });
  }
  // Ajv
  else if (ex.errors && Array.isArray(ex.errors)) {
    ex.errors.forEach((error: any) => {
      const path =
        error.instancePath?.slice(1)?.replace(/\[(\d+)\]/g, ".$1") || ".";
      const errorMessage = error.message || "Validation error";
      feedback[path] = { type: "invalid", message: errorMessage };
    });
  } else {
    throw new Error("Not support");
  }
  return feedback;
};
