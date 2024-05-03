import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import {
  DoChange,
  DoOptions,
  DoSubmit,
  DoValidate,
  Feedback,
  FormObject,
  useFormObject,
} from "react-form-object";
import * as yup from "yup";
import { sleep } from "../util";
import { FormInputText } from "./atom/formInputText";
import { FormSelectText } from "./atom/formSelectText";
import { MessageResponse } from "./atom/messageResponse";
import { ContactLayout } from "./layout/contactLayout";
type Contact = {
  name: string;
  lastname: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
};
const initContact: Contact = {
  name: "Willyams",
  lastname: "Yujra with Typescript",
  age: 0,
  gender: "",
  email: "yracnet@gmail.com",
  phone: "",
  guardianName: "",
  guardianPhone: "",
};

const contactSchema = yup.object().shape({
  name: yup.string().min(5).max(100).ensure().required(),
  lastname: yup.string().min(5).max(100).ensure().required(),
  age: yup.number().required().positive().integer().max(120).nullable(),
  gender: yup.string().required(),
  email: yup.string().email().required(),
  guardianName: yup.string().when("age", ([age], schema) => {
    return age < 18 ? schema.required() : schema.notRequired();
  }),
  guardianPhone: yup.string().when("age", ([age], schema) => {
    return age < 18 ? schema.required() : schema.notRequired();
  }),
});

const ROOT_STYLE: any = {
  valid: "was-validated",
  invalid: "was-validated",
  failed: "was-validated",
  success: "was-validated",
};

const ContactForm = () => {
  const {
    data,
    onSubmit,
    onReset,
    onReload,
    options,
    feedback,
    message,
    status,
  } = useFormObject<Contact>();
  const enabledGuardian = data.age && data.age < 18;
  return (
    <ContactLayout className={ROOT_STYLE[status]}>
      <FormInputText label="Name" name="name" required />
      <FormInputText label="Last Name" name="lastname" required />
      <FormInputText label="Gender" name="gender" required />
      <FormInputText label="Age" name="age" required />
      <FormInputText
        label="Guardian Name"
        name="guardianName"
        disabled={!enabledGuardian}
        required
      />
      <FormInputText
        label="Guardian Phone"
        name="guardianPhone"
        disabled={!enabledGuardian}
        required
      />
      <FormInputText label="Correo Electrónico" name="email" required />
      <FormSelectText
        label="Gender"
        name="gender"
        options={options.gender}
        required
      />
      <div className="message">
        <MessageResponse />
      </div>
      <div className="actions">
        <ButtonGroup>
          <Button variant="success" type="button" onClick={onReload}>
            Reload
          </Button>
          <Button variant="danger" type="button" onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" type="button" onClick={(e) => onSubmit()}>
            Submit
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={(e) => onSubmit(true)}
          >
            Force Submit
          </Button>
          <Button disabled variant="outline-secondary">
            {status}
          </Button>
        </ButtonGroup>
      </div>
      <div className="debug">
        <pre>Data:{JSON.stringify(data, null, 2)}</pre>
        <pre>Options:{JSON.stringify(options, null, 2)}</pre>
        <pre>Feedback:{JSON.stringify(feedback, null, 2)}</pre>
        <pre>Message:{JSON.stringify(message, null, 2)}</pre>
      </div>
    </ContactLayout>
  );
};

export const ContactSimpleTSExample = () => {
  const [data, setData] = useState(initContact);
  const doOptions: DoOptions<Contact> = async () => {
    await sleep(1000); // Simulate fetching options from a server
    return {
      status: "ready",
      options: {
        gender: [
          { value: "", label: `??? ${Date.now()}` },
          { value: "M", label: "Male" },
          { value: "F", label: "Female" },
        ],
      },
    };
  };
  const doValidate: DoValidate<Contact> = async (contact: Contact) => {
    try {
      contactSchema.validateSync(contact, { abortEarly: false });
      const data = contactSchema.cast(contact);
      return {
        status: "valid",
        data,
        feedback: {
          name: {
            type: "valid",
            message: "It is valid!!!",
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
  const doChange: DoChange<Contact> = async (data) => {
    const { status, feedback } = await doValidate(data);
    return { status, feedback, message: false };
  };
  const doSubmit: DoSubmit<Contact> = async ({ data }) => {
    setData(data);
    await sleep(1000); // Simulate submitting data to a server
    return {
      status: "failed",
      message: {
        type: "danger",
        title: "Invalid Service",
        description: "This service is invalid",
      },
    };
  };
  return (
    <div>
      <FormObject
        defaultData={() => data}
        doOptions={doOptions}
        doSubmit={doSubmit}
        doChange={doChange}
        doValidate={doValidate}
      >
        <ContactForm />
      </FormObject>
      <pre>MAIN:{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
