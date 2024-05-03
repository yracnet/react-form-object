export const IdentityFn: React.FC<any> = ({ children }) => {
  return children;
};

export const doValidateDefault = () => {
  return { status: "valid", feedback: {} };
};

export const doLoadDefault = () => {};

export const doOptionsDefault = () => {
  return { status: "ready", options: {} };
};

export const doChangeDefault = () => {};

export const doSubmitDefault = () => {
  return { status: "success", message: false };
};

export const doCreateDefault = () => {
  return { id: 1 };
};

export const doResetDefault = () => {};

export const doNotifyDefault = () => {};

export const setDataDefault = () => {};

export const setListDefault = () => {};
