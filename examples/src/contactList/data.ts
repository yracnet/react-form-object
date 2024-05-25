import { DoValidate, Feedback } from "react-form-object";
import * as yup from "yup";

export type ContactItem = {
  id: string;
  name: string;
  email: string;
};

export const initContactItem: ContactItem = {
  id: "1",
  name: "",
  email: "",
};

export const initContactList = [{ ...initContactItem }];

const contactSchema = yup.object().shape({
  name: yup.string().ensure().required(),
  email: yup.string().email().required(),
});
const concatctoListSchema = yup.array().of(contactSchema);

export const validateContacto: DoValidate<ContactItem> = (contacto) => {
  try {
    const result = contactSchema.validateSync(contacto, {
      abortEarly: false,
    });
    console.log("Result:", result);
    return {
      status: "valid",
      feedback: {
        name: {
          type: "valid",
          message: "Es valido!!!",
        },
      },
    };
  } catch (validationError: any) {
    const feedback: Feedback = {};
    validationError.inner.forEach((error: any) => {
      const path = error.path;
      const errorMessage = error.message;
      feedback[path] = { type: "invalid", message: errorMessage };
    });
    return { status: "invalid", feedback };
  }
};

export const validateContactoList: DoValidate<ContactItem[]> = (
  contactoList
) => {
  try {
    const result = concatctoListSchema.validateSync(contactoList, {
      abortEarly: false,
    });
    console.log("Result:", result);
    return {
      status: "valid",
      feedback: {},
    };
  } catch (validationError: any) {
    const feedback: Feedback = {};
    validationError.inner.forEach((error: any) => {
      const path = error.path;
      const errorMessage = error.message;
      feedback[path] = { type: "invalid", message: errorMessage };
    });
    return { status: "invalid", feedback };
  }
};
