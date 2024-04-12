import { useState } from "react";
import { Alert, Button, ButtonGroup, Form } from "react-bootstrap";
import { FormObject, useFormObject } from "react-form-object";
import styled from "styled-components";
import * as yup from "yup";
import { sleep } from "../util";
export const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: min-content min-content min-content min-content min-content;
  gap: 1em 1em;

  &.failed .valid-feedback,
  &.success .valid-feedback,
  &.valid .valid-feedback {
    display: block !important;
  }
  &.failed .invalid-feedback,
  &.success .invalid-feedback,
  &.invalid .invalid-feedback {
    display: block !important;
  }

  > .name {
    grid-area: 1 / 1 / 2 / 4;
  }
  > .lastname {
    grid-area: 1 / 4 / 2 / 7;
  }
  > .gender {
    grid-area: 2 / 1 / 3 / 3;
  }
  > .age {
    grid-area: 2 / 3 / 3 / 5;
  }
  > .email {
    grid-area: 2 / 5 / 3 / 7;
  }
  > .guardianName {
    grid-area: 3 / 1 / 4 / 5;
  }
  > .guardianPhone {
    grid-area: 3 / 5 / 4 / 7;
  }
  > .message {
    grid-area: 4 / 1 / 5 / 7;
  }
  > .actions {
    grid-area: 5 / 1 / 6 / 7;
  }
  > .debug {
    grid-area: 6 / 1 / 7 / 7;
    display: flex;
    > pre {
    }
  }
`;

const MessageResponse = () => {
  const { status, message } = useFormObject();
  return (
    message && (
      <Alert variant={message.type}>
        <b>
          {status} - {message.title}:{" "}
        </b>{" "}
        {message.description}
      </Alert>
    )
  );
};

const ITEM_STYLE = {
  valid: "is-valid",
  invalid: "is-invalid",
};

const FormInputText = ({ name, label, ...props }) => {
  const { getAttribute, setAttribute, feedback } = useFormObject();
  const onChange = (e) => setAttribute(name, e.target.value);
  const value = getAttribute(name) || "";
  const className = ITEM_STYLE[feedback[name]?.type];
  return (
    <Form.Group className={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        value={value}
        onChange={onChange}
        className={className}
      />
      <Form.Control.Feedback type={feedback[name]?.type}>
        {feedback[name]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

const FormSelectText = ({ name, label, options = [], children, ...props }) => {
  const { getAttribute, setAttribute, feedback } = useFormObject();
  const onChange = (e) => setAttribute(name, e.target.value);
  const value = getAttribute(name) || "";
  const className = ITEM_STYLE[feedback[name]?.type];
  return (
    <Form.Group className={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        {...props}
        value={value}
        onChange={onChange}
        className={className}
      >
        {options.map((it) => (
          <option key={it.value} value={it.value}>
            {it.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type={feedback[name]?.type}>
        {feedback[name]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

const initContact = {
  name: "Willyams",
  lastname: "Yujra",
  age: 16,
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

const ROOT_STYLE = {
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
  } = useFormObject();
  const enabledGuardian = data.age && data.age < 18;
  return (
    <FormLayout className={ROOT_STYLE[status]}>
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
    </FormLayout>
  );
};

export const ContactSimpleExample = () => {
  const [data, setData] = useState(initContact);
  const doOptions = async () => {
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

  const doValidate = async (Contact) => {
    try {
      const result = contactSchema.validateSync(Contact, { abortEarly: false });
      return {
        status: "valid",
        feedback: {
          name: {
            type: "valid",
            message: "It is valid!!!",
          },
        },
      };
    } catch (validationError) {
      const feedback = {};
      validationError.inner.forEach((error) => {
        const path = error.path;
        const errorMessage = error.message;
        feedback[path] = { type: "invalid", message: errorMessage };
      });
      return { status: "invalid", feedback };
    }
  };
  const doSubmit = async ({ data }) => {
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
        data={data}
        doOptions={doOptions}
        doSubmit={doSubmit}
        doValidate={doValidate}
      >
        <ContactForm />
      </FormObject>
      <pre>MAIN:{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
