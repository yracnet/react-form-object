import React, { ReactNode, useEffect } from "react";
import {
  IdentityFn,
  doChangeDefault,
  doCreateDefault,
  doLoadDefault,
  doNotifyDefault,
  doOptionsDefault,
  doResetDefault,
  doSubmitDefault,
  doValidateDefault,
} from "./FormDefault";
import {
  AddItem,
  FormIteratorContext,
  FormIteratorContextProps,
  GetItem,
  PopItem,
  SetItem,
} from "./FormIteratorContext";
import {
  Feedback,
  Function1,
  Message,
  Notify,
  OnAppend,
  OnNotify,
  OnReload,
  OnReset,
  OnSubmit,
  OnValidate,
  Options,
  Status,
} from "./FormModel";
import { InitData, SetData } from "./FormObjectContext";
import { FormObject } from "./FormObjectProvider";
import { useStateDelegate } from "./hooks";
// Defined Methods
// List
export type DoResetList<T> = Function1<
  { list: T[]; prev: T[] },
  | void
  | Status
  | {
      status: Status;
      feedback: Feedback;
      message: Message;
    }
>;

export type DoChangeList<T> = Function1<
  T[],
  | void
  | Status
  | {
      status: Status;
      feedback: Feedback;
      message: Message;
    }
>;

export type DoNotifyList<T> = Function1<{ notify: Notify; list: T[] }, void>;

export type DoSubmitList<T> = Function1<
  {
    list: T[];
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

export type DoLoadList<T> = Function1<
  T[],
  void | {
    feedback: Feedback;
    message: Message;
  }
>;

export type DoOptionsList<T> = Function1<
  T[],
  {
    status: Status;
    options: Options;
  }
>;

export type DoValidateList<T> = Function1<
  T[],
  {
    status: Status;
    feedback: Feedback;
  }
>;

// Item

export type DoResetItem<T> = Function1<
  { item: T; prev: T; list: T[] },
  | void
  | Status
  | {
      status: Status;
      feedback: Feedback;
      message: Message;
    }
>;

export type DoChangeItem<T> = Function1<
  { item: T; list: T[] },
  | void
  | Status
  | {
      status: Status;
      feedback: Feedback;
      message: Message;
    }
>;

export type DoNotifyItem<T> = Function1<
  { notify: Notify; item: T; list: T[] },
  void
>;

export type DoSubmitItem<T> = Function1<
  {
    item: T;
    list: T[];
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

export type DoLoadItem<T> = Function1<
  { item: T; list: T[] },
  void | {
    feedback: Feedback;
    message: Message;
  }
>;

export type DoOptionsItem<T> = Function1<
  { item: T; list: T[] },
  {
    status: Status;
    options: Options;
  }
>;

export type DoValidateItem<T> = Function1<
  { item: T; list: T[] },
  {
    status: Status;
    feedback: Feedback;
  }
>;

export type DoCreateItem<T> = Function1<{ list: T[]; index: number }, T>;

// Defined Form Props

export type FormIteratorProps<T> = {
  name: string;
  pk: string;

  list: T[];
  setList: SetData<T[]>;
  defaultList: InitData<T[]>;

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

  doReset: DoResetList<T>;
  doChange: DoChangeList<T>;
  doNotify: DoNotifyList<T>;
  doSubmit: DoSubmitList<T>;
  doLoad: DoLoadList<T>;
  doOptions: DoOptionsList<T>;
  doValidate: DoValidateList<T>;
  deep: boolean;
  wrapper: React.FC<any>;
  doResetItem: DoResetItem<T>;
  doCreateItem: DoCreateItem<T>;
  doChangeItem: DoChangeItem<T>;
  doSubmitItem: DoSubmitItem<T>;
  doLoadItem: DoLoadItem<T>;
  doOptionsItem: DoOptionsItem<T>;
  doNotifyItem: DoNotifyItem<T>;
  doValidateItem: DoValidateItem<T>;
  wrapperItem: React.FC<any>;
  children: ReactNode;
};

// Defined Form Provider

export const FormIterator = <T extends {}>(
  // FormIteratorProps
  props: FormIteratorProps<T>
) => {
  const {
    name,
    pk,
    doReset,
    doChange,
    doNotify,
    doSubmit,
    doLoad,
    doOptions,
    doValidate,
    deep,
    wrapper: Wrapper,
    doResetItem,
    doLoadItem,
    doOptionsItem,
    doNotifyItem,
    doCreateItem,
    doChangeItem,
    doSubmitItem,
    doValidateItem,
    wrapperItem: WrapperItem,
    children,
  } = props;
  const [list, setList] = useStateDelegate<T[]>(props.defaultList, {
    delegate: props.list,
    setDelegate: props.setList,
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

  const doChangeList = async (list: T[]) => {
    const changeStatus = await doChange(list);
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
  };

  const addItem: AddItem<T> = (newItem) => {
    setList((list) => {
      const newList = [...list, newItem];
      doChange(newList);
      return newList;
    });
  };
  const setItem: SetItem<T> = (index, newItem) => {
    setList((list) => {
      const newList = list.map((item, index1) => {
        return index1 === index ? newItem : item;
      });
      doChangeList(newList);
      return newList;
    });
  };
  const getItem: GetItem<T> = (index) => {
    return list[index];
  };
  const popItem: PopItem<T> = (index) => {
    setList((list) => {
      const newList = list.filter((_, index1) => {
        return index1 !== index;
      });
      doChangeList(newList);
      return newList;
    });
    return list[index];
  };
  const onAppend: OnAppend = async (index = -1) => {
    const newItem = await doCreateItem({ list, index });
    setList((list) => {
      const newList =
        index === -1 ||
        index === null ||
        index === undefined ||
        typeof index !== "number"
          ? [...list, newItem]
          : index === 0
          ? [newItem, ...list]
          : list.flatMap((item, index1) => {
              return index1 === index ? [newItem, item] : [item];
            });
      doChangeList(newList);
      return newList;
    });
  };
  // On Actions
  const onReloadList: OnReload = async () => {
    setStatus("loading");
    const optionsStatus = await doOptions(list);
    if (optionsStatus === undefined) {
      //Nothing
    } else if (typeof optionsStatus === "string") {
      setStatus(optionsStatus);
    } else {
      const { status, options } = optionsStatus;
      setStatus(status);
      setOptions(options);
    }
    const load = await doLoad(list);
    if (load === undefined) {
      //Nothing
    } else {
      const { feedback, message } = load;
      setFeedback(feedback);
      setMessage(message);
    }
  };

  const onResetList: OnReset = async () => {
    const refList = props.defaultList || props.list;
    if (refList instanceof Function) {
      const newList = refList();
      setList(newList);
      const resetStatus = await doReset({ list: newList, prev: list });
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

  const onSubmitList: OnSubmit = async (force = false) => {
    setStatus("ready");
    const { status, feedback } = await doValidate(list);
    setStatus(status);
    setFeedback(feedback);
    if (status === "valid" || force === true) {
      const messageStatus = await doSubmit({
        list,
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

  const onValidateList: OnValidate = async () => {
    setStatus("ready");
    const { status, feedback } = await doValidate(list);
    setStatus(status);
    setFeedback(feedback);
  };

  const onNotifyList: OnNotify = async (notify) => {
    await doNotify({ notify, list });
  };

  useEffect(() => {
    onReloadList();
  }, []);

  const size = list.length;

  const contextValue: FormIteratorContextProps<T> = {
    // Identify
    pk,
    name,

    // Data Handler
    size,
    list,
    setList,
    addItem,
    setItem,
    getItem,
    popItem,

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
    onAppend,
    onResetList,
    onReloadList,
    onNotifyList,
    onSubmitList,
    onValidateList,
  };

  return (
    <FormIteratorContext.Provider value={contextValue}>
      <Wrapper>
        {list.map((data, index) => {
          //@ts-ignore
          const key = data[pk] || index;
          return (
            <FormObject
              index={index}
              key={key}
              name={name}
              data={data}
              doReset={({ data: item, prev }) =>
                doResetItem({ item, prev, list })
              }
              doNotify={({ data: item, notify }) =>
                doNotifyItem({ item, notify, list })
              }
              doLoad={(item) => doLoadItem({ item, list })}
              doOptions={(item) => doOptionsItem({ item, list })}
              doChange={(item) => doChangeItem({ item, list })}
              doSubmit={({ data: item, feedback, message, options, status }) =>
                doSubmitItem({
                  item,
                  list,
                  feedback,
                  message,
                  options,
                  status,
                })
              }
              doValidate={(item) => doValidateItem({ item, list })}
              deep={deep}
              wrapper={WrapperItem}
            >
              {children}
            </FormObject>
          );
        })}
      </Wrapper>
    </FormIteratorContext.Provider>
  );
};

FormIterator.defaultProps = {
  pk: "id",
  name: "Default",
  index: 0,
  // State Handlers
  list: undefined,
  setList: undefined,
  defaultList: () => {
    return [];
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

  doResetItem: doResetDefault,
  doNotifyItem: doNotifyDefault,
  doCreateItem: doCreateDefault,
  doSubmitItem: doSubmitDefault,
  doChangeItem: doChangeDefault,
  doLoadItem: doLoadDefault,
  doOptionsItem: doOptionsDefault,
  doValidateItem: doValidateDefault,

  deep: false,
  wrapper: IdentityFn,
  wrapperItem: IdentityFn,
};
