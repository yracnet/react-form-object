import { Form } from "react-bootstrap";
import { useFormObject } from "react-form-object";

const ITEM_STYLE: any = {
  valid: "is-valid",
  invalid: "is-invalid",
};

export const FormInputText = ({ name, label, ...props }: any) => {
  name = Array.isArray(name) ? name : [name];
  const key = name.join(".");
  const { getAttribute, setAttribute, feedback } = useFormObject();
  const onChange = (e: any) => setAttribute(name, e.target.value);
  const value = getAttribute(name) || "";
  const className = ITEM_STYLE[feedback[name]?.type];
  return (
    <Form.Group className={name.join("_")}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        value={value}
        onChange={onChange}
        className={className}
      />
      <Form.Control.Feedback type={feedback[key]?.type}>
        {feedback[key]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
