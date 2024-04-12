import React, { ReactNode, useEffect } from "react";
import {
  IdentityFn,
  doChangeDefault,
  doNotifyDefault,
  doOptionsDefault,
  doReloadDefault,
  doResetDefault,
  doSubmitDefault,
  doValidateDefault,
} from "./FormDefault";
import {
  Feedback,
  FormState,
  Function,
  Message,
  Notify,
  OnNotify,
  OnReload,
  OnReset,
  OnSubmit,
  OnValidate,
  Options,
  Status,
} from "./FormModel";
import {
  FormObjectContext,
  FormObjectContextProps,
  GetAttribute,
  SetAttribute,
} from "./FormObjectContext";
import { useFormHandler, useSafeState } from "./hooks";
import { getRootAttribute, setRootAttribute } from "./util";

// Defined Methods
export type DoReset<T> = Function<{ data: T; prev: T }, void>;

export type DoChange<T> = Function<T, void>;

export type DoNotify<T> = Function<{ notify: Notify; data: T }, void>;

export type DoSubmit<T> = Function<
  { data: T; state: FormState },
  | void
  | Status
  | {
      status: Status;
      message: Message;
    }
>;

export type DoReload<T> = Function<T, void>;

export type DoOptions<T> = Function<
  T,
  {
    status: Status;
    options: Options;
  }
>;

export type DoValidate<T> = Function<
  T,
  {
    status: Status;
    feedback: Feedback;
  }
>;

// Defined Form Props

export type FormObjectProps<T> = {
  index: number;
  pk: string;
  name: string;
  data: T;
  doReset: DoReset<T>;
  doChange: DoChange<T>;
  doNotify: DoNotify<T>;
  doSubmit: DoSubmit<T>;
  doReload: DoReload<T>;
  doOptions: DoOptions<T>;
  doValidate: DoValidate<T>;
  deep: boolean;
  children: ReactNode;
  wrapper: React.FC<any>;
};

// Defined Form Provider

export const FormObject = <T extends {}>(
  // FormObjectProps
  {
    pk,
    name,
    index,
    data: submitData,
    doReset,
    doChange,
    doNotify,
    doSubmit,
    doReload,
    doOptions,
    doValidate,
    deep,
    children,
    wrapper: Wrapper,
  }: FormObjectProps<T>
) => {
  const [data, setData, resetData, cloneData] = useSafeState<T>(
    submitData,
    deep
  );
  const [formState, formHandler] = useFormHandler({
    status: "loading",
    options: {},
    feedback: {},
    message: false,
  });
  const { status, options, feedback, message } = formState;
  const {
    setStatus,
    setOptions,
    setFeedback,
    setMessage,
    setPartialInitState,
    setPartialState,
  } = formHandler;

  const setAttribute: SetAttribute = (attr, val) => {
    const newData = setRootAttribute(data, attr, val);
    setData(newData);
    doChange(newData);
  };

  const getAttribute: GetAttribute = (attr: any) => {
    return getRootAttribute(data, attr);
  };

  // On Actions
  const onReload: OnReload = async () => {
    setPartialInitState({ status: "loading" });
    const optionStatus = await doOptions(data);
    setPartialState(optionStatus);
    doReload(data);
  };

  const onReset: OnReset = async () => {
    const newData = resetData(submitData);
    setPartialInitState({ status: "reset", options });
    await doReset({ data: newData, prev: data });
  };

  const onSubmit: OnSubmit = async (force = false) => {
    setPartialInitState({ status: "ready", options });
    const newData = cloneData();
    const feedbackStatus = await doValidate(newData);
    setPartialState(feedbackStatus);
    if (feedbackStatus.status === "valid" || force === true) {
      const messageStatus = await doSubmit({ data: newData, state: formState });
      if (!messageStatus) {
        //Nothing
      } else if (typeof messageStatus === "string") {
        setStatus(messageStatus);
      } else {
        setPartialState(messageStatus);
      }
    }
  };

  const onValidate: OnValidate = async () => {
    setPartialInitState({ status: "ready", options });
    const newData = cloneData();
    const feedbackStatus = await doValidate(newData);
    setPartialState(feedbackStatus);
  };

  const onNotify: OnNotify = async (notify) => {
    const newData = cloneData();
    await doNotify({ notify, data: newData });
  };

  useEffect(() => {
    onReload();
  }, []);
  useEffect(() => {
    const newData = resetData(submitData);
    setData(newData);
  }, [submitData]);

  const contextValue: FormObjectContextProps<T> = {
    // Identify
    pk,
    name,
    index,

    // Data Handler
    data,
    setData,
    setAttribute,
    getAttribute,

    // Status Handler
    status,
    setStatus,
    options,
    setOptions,
    feedback,
    setFeedback,
    message,
    setMessage,

    // Allows Methods
    onReset,
    onReload,
    onNotify,
    onSubmit,
    onValidate,
  };

  return (
    <FormObjectContext.Provider value={contextValue}>
      <Wrapper>{children}</Wrapper>
    </FormObjectContext.Provider>
  );
};

FormObject.defaultProps = {
  pk: "id",
  name: "Default",
  index: 0,
  data: {},
  // Function Defaults
  doReset: doResetDefault,
  doNotify: doNotifyDefault,
  doChange: doChangeDefault,
  doSubmit: doSubmitDefault,
  doReload: doReloadDefault,
  doOptions: doOptionsDefault,
  doValidate: doValidateDefault,
  deep: false,
  wrapper: IdentityFn,
};
