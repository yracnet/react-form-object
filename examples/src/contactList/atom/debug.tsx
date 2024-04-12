import { useFormIterator, useFormObject } from "react-form-object";
import styled from "styled-components";
export const DebugLayout = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px dotted var(--bs-gray-200);
    gap: 5px;
    > pre {
      margin: 5px;
      flex-grow: 1;
    }
  }
`;

export const DegubData = () => {
  const { data, options, feedback, message, status } = useFormObject<any>();
  return (
    <DebugLayout className="debug">
      <b>Status: {status}</b>
      <div>
        <pre>Data:{JSON.stringify(data, null, 2)}</pre>
        <pre>Options:{JSON.stringify(options, null, 2)}</pre>
        <pre>Feedback:{JSON.stringify(feedback, null, 2)}</pre>
        <pre>Message:{JSON.stringify(message, null, 2)}</pre>
      </div>
    </DebugLayout>
  );
};

export const DegubList = () => {
  const { list, options, feedback, message, status } = useFormIterator<any>();
  return (
    <DebugLayout className="debug">
      <b>Status: {status}</b>
      <div>
        <pre>Data:{JSON.stringify(list, null, 2)}</pre>
        <pre>Options:{JSON.stringify(options, null, 2)}</pre>
        <pre>Feedback:{JSON.stringify(feedback, null, 2)}</pre>
        <pre>Message:{JSON.stringify(message, null, 2)}</pre>
      </div>
    </DebugLayout>
  );
};
