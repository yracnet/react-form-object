import React, { ReactNode, useEffect } from "react";
import {
  IdentityFn,
  doChangeDefault,
  doLoadDefault,
  doNotifyDefault,
  doOptionsDefault,
  doResetDefault,
  doSubmitDefault,
  doValidateDefault,
} from "./FormDefault";
import {
  Feedback,
  Function1,
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
  InitData,
  SetData,
} from "./FormObjectContext";
import { useStateAttribute, useStateDelegate } from "./hooks";

// Defined Methods
export type DoReset<T> = Function1<
  { data: T; prev: T },
  | void
  | Status
  | {
      status: Status;
      feedback: Feedback;
      message: Message;
    }
>;

export type DoChange<T> = Function1<
  T,
  | void
  | Status
  | {
      status: Status;
      feedback: Feedback;
      message: Message;
    }
>;

export type DoNotify<T> = Function1<{ notify: Notify; data: T }, void>;

export type DoSubmit<T> = Function1<
  {
    data: T;
    status: Status;
    options: Options;
    feedback: Feedback;
    message: Message;
  },
  | void
  | Status
  | {
      status: Status;
      message: Message;
    }
>;

export type DoLoad<T> = Function1<
  T,
  void | {
    feedback: Feedback;
    message: Message;
  }
>;

export type DoOptions<T> = Function1<
  T,
  {
    status: Status;
    options: Options;
  }
>;

export type DoValidate<T> = Function1<
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
  setData: SetData<T>;
  defaultData: InitData<T>;

  status: Status;
  setStatus: SetData<Status>;
  defaultStatus: InitData<Status>;

  feedback: Feedback;
  setFeedback: SetData<Feedback>;
  defaultFeedback: InitData<Feedback>;

  message: Message;
  setMessage: SetData<Message>;
  defaultMessage: InitData<Message>;

  options: Options;
  setOptions: SetData<Options>;
  defaultOptions: InitData<Options>;

  doReset: DoReset<T>;
  doChange: DoChange<T>;
  doNotify: DoNotify<T>;
  doSubmit: DoSubmit<T>;
  doLoad: DoLoad<T>;
  doOptions: DoOptions<T>;
  doValidate: DoValidate<T>;

  deep: boolean;
  children: ReactNode;
  wrapper: React.FC<any>;
};

// Defined Form Provider

export const FormObject = <T extends {}>(
  // FormObjectProps
  props: FormObjectProps<T>
) => {
  const [data, setData] = useStateDelegate<T>(props.defaultData, {
    delegate: props.data,
    setDelegate: props.setData,
  });
  const [status, setStatus] = useStateDelegate<Status>(props.defaultStatus, {
    delegate: props.status,
    setDelegate: props.setStatus,
  });
  const [feedback, setFeedback] = useStateDelegate<Feedback>(
    props.defaultFeedback,
    {
      delegate: props.feedback,
      setDelegate: props.setFeedback,
    }
  );
  const [options, setOptions] = useStateDelegate<Options>(
    props.defaultOptions,
    {
      delegate: props.options,
      setDelegate: props.setOptions,
    }
  );
  const [message, setMessage] = useStateDelegate<Message>(
    props.defaultMessage,
    {
      delegate: props.message,
      setDelegate: props.setMessage,
    }
  );
  const {
    pk,
    name,
    index,
    doReset,
    doChange,
    doNotify,
    doSubmit,
    doLoad,
    doOptions,
    doValidate,
    deep,
    children,
    wrapper: Wrapper,
  } = props;
  const [getAttribute, setAttribute] = useStateAttribute([data, setData], {
    deep,
    onChange: async (data) => {
      const changeStatus = await doChange(data);
      if (changeStatus === undefined) {
        //Nothing
      } else if (typeof changeStatus === "string") {
        setStatus(changeStatus);
      } else {
        const { status, feedback, message } = changeStatus;
        setStatus(status);
        setFeedback(feedback);
        setMessage(message);
      }
    },
  });

  // On Actions
  const onReload: OnReload = async () => {
    setStatus("loading");
    const optionsStatus = await doOptions(data);
    if (optionsStatus === undefined) {
      //Nothing
    } else if (typeof optionsStatus === "string") {
      setStatus(optionsStatus);
    } else {
      const { status, options } = optionsStatus;
      setStatus(status);
      setOptions(options);
    }
    const load = await doLoad(data);
    if (load === undefined) {
      //Nothing
    } else {
      const { feedback, message } = load;
      setFeedback(feedback);
      setMessage(message);
    }
  };

  const onReset: OnReset = async () => {
    setStatus("reset");
    const refData = props.defaultData || props.data;
    if (refData instanceof Function) {
      const newData = refData();
      setData(newData);
      const resetStatus = await doReset({ data: newData, prev: data });
      if (resetStatus === undefined) {
        //Nothing
      } else if (typeof resetStatus === "string") {
        setStatus(resetStatus);
      } else {
        const { status, feedback, message } = resetStatus;
        setStatus(status);
        setFeedback(feedback);
        setMessage(message);
      }
    }
  };

  const onSubmit: OnSubmit = async (force = false) => {
    setStatus("ready");
    const { feedback, status } = await doValidate(data);
    setStatus(status);
    setFeedback(feedback);
    if (status === "valid" || force === true) {
      const messageStatus = await doSubmit({
        data,
        status,
        options,
        feedback,
        message,
      });
      if (!messageStatus) {
        //Nothing
      } else if (typeof messageStatus === "string") {
        setStatus(messageStatus);
      } else {
        const { status, message } = messageStatus;
        setStatus(status);
        setMessage(message);
      }
    }
  };

  const onValidate: OnValidate = async () => {
    setStatus("ready");
    const { feedback, status } = await doValidate(data);
    setStatus(status);
    setFeedback(feedback);
  };

  const onNotify: OnNotify = async (notify) => {
    await doNotify({ notify, data });
  };

  useEffect(() => {
    onReload();
  }, []);

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
  // State Handlers
  data: undefined,
  setData: undefined,
  defaultData: () => {
    return {};
  },
  status: undefined,
  setStatus: undefined,
  defaultStatus: () => {
    return "loading";
  },
  options: undefined,
  setOptions: undefined,
  defaultOptions: () => {
    return {};
  },
  message: undefined,
  setMessage: undefined,
  defaultMessage: () => {
    return false;
  },
  feedback: undefined,
  setFeedback: undefined,
  defaultFeedback: () => {
    return {};
  },
  // Function Defaults
  doReset: doResetDefault,
  doNotify: doNotifyDefault,
  doChange: doChangeDefault,
  doSubmit: doSubmitDefault,
  doLoad: doLoadDefault,
  doOptions: doOptionsDefault,
  doValidate: doValidateDefault,
  deep: false,
  wrapper: IdentityFn,
};
