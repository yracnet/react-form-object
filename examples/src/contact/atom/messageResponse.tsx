import { Alert } from "react-bootstrap";
import { useFormObject } from "react-form-object";

export const MessageResponse = () => {
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
