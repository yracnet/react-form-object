import { Form } from "react-bootstrap";
import { assertPath, useFormObject } from "react-form-object";

export const FormInputText = ({ name, className, label, ...props }: any) => {
  name = assertPath(name);
  const key = name.join(".");
  const { getAttribute, setAttribute, feedback } = useFormObject();
  const onChange = (e: any) => setAttribute(name, e.target.value);
  const value = getAttribute(name, "");
  className = [name.join("_"), className].join(" ");
  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        value={value}
        onChange={onChange}
        isValid={feedback[name]?.type === "valid"}
        isInvalid={feedback[name]?.type === "invalid"}
      />
      <Form.Control.Feedback type={feedback[key]?.type}>
        {feedback[key]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
