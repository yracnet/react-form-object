import { Form } from "react-bootstrap";
import { useFormObject } from "react-form-object";

const ITEM_STYLE: any = {
  valid: "is-valid",
  invalid: "is-invalid",
};

export const FormSelectText = ({
  name,
  label,
  options = [],
  children,
  ...props
}: any) => {
  const { getAttribute, setAttribute, feedback } = useFormObject();
  const onChange = (e: any) => setAttribute(name, e.target.value);
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
        {options.map((it: any) => (
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
