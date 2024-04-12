import { Feedback } from "./index";

export const parseYUMException = (ex: any) => {
  const feedback: Feedback = {};
  ex.inner.forEach((error: any) => {
    const path = error.path;
    const errorMessage = error.message;
    feedback[path] = { type: "invalid", message: errorMessage };
  });
  return { status: "invalid", feedback };
};
