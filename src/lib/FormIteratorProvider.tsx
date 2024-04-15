import React, { ReactNode, useEffect } from "react";
import {
  IdentityFn,
  doChangeDefault,
  doCreateDefault,
  doNotifyDefault,
  doOptionsDefault,
  doReloadDefault,
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
  FormState,
  Function,
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
import { FormObject } from "./FormObjectProvider";
import { useFormHandler, useSafeState } from "./hooks";
// Defined Methods
// List
export type DoResetList<T> = Function<{ list: T[]; prev: T[] }, void>;

export type DoChangeList<T> = Function<T[], void>;

export type DoNotifyList<T> = Function<{ notify: Notify; list: T[] }, void>;

export type DoSubmitList<T> = Function<
  { list: T[]; state: FormState },
  | void
  | Status
  | {
      status: Status;
      message: Message;
    }
>;

export type DoReloadList<T> = Function<T[], void>;

export type DoOptionsList<T> = Function<
  T[],
  {
    status: Status;
    options: Options;
  }
>;

export type DoValidateList<T> = Function<
  T[],
  {
    status: Status;
    feedback: Feedback;
  }
>;

// Item

export type DoSubmitItem<T> = Function<
  { item: T; list: T[]; state: FormState; itemState: FormState },
  | void
  | Status
  | {
      status: Status;
      message: Message;
    }
>;

export type DoChangeItem<T> = Function<{ item: T; list: T[] }, void>;

export type DoResetItem<T> = Function<{ item: T; prev: T; list: T[] }, void>;

export type DoReloadItem<T> = Function<{ item: T; list: T[] }, void>;

export type DoValidateItem<T> = Function<
  { item: T; list: T[] },
  {
    status: Status;
    feedback: Feedback;
  }
>;

export type DoOptionsItem<T> = Function<
  { item: T; list: T[] },
  {
    status: Status;
    options: Options;
  }
>;

export type DoNotifyItem<T> = Function<
  { notify: Notify; item: T; list: T[] },
  void
>;

export type DoCreateItem<T> = Function<{ list: T[]; index: number }, T>;

// Defined Form Props

export type FormIteratorProps<T> = {
  name: string;
  pk: string;
  list: T[];
  doReset: DoResetList<T>;
  doChange: DoChangeList<T>;
  doNotify: DoNotifyList<T>;
  doSubmit: DoSubmitList<T>;
  doReload: DoReloadList<T>;
  doOptions: DoOptionsList<T>;
  doValidate: DoValidateList<T>;
  deep: boolean;
  wrapper: React.FC<any>;
  doResetItem: DoResetItem<T>;
  doCreateItem: DoCreateItem<T>;
  doChangeItem: DoChangeItem<T>;
  doSubmitItem: DoSubmitItem<T>;
  doReloadItem: DoReloadItem<T>;
  doNotifyItem: DoNotifyItem<T>;
  doOptionsItem: DoOptionsItem<T>;
  doValidateItem: DoValidateItem<T>;
  wrapperItem: React.FC<any>;
  children: ReactNode;
};

// Defined Form Provider

export const FormIterator = <T extends {}>(
  // FormIteratorProps
  {
    name,
    pk,
    list: submitList = [],
    doReset,
    doChange,
    doNotify,
    doSubmit,
    doReload,
    doOptions,
    doValidate,
    deep,
    wrapper: Wrapper,
    doResetItem,
    doReloadItem,
    doNotifyItem,
    doCreateItem,
    doChangeItem,
    doSubmitItem,
    doOptionsItem,
    doValidateItem,
    wrapperItem: WrapperItem,
    children,
  }: FormIteratorProps<T>
) => {
  const [list, setList, resetList, cloneList] = useSafeState(submitList, deep);
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

  const addItem: AddItem<T> = (newItem) => {
    const newList = [...list, newItem];
    setList(newList);
    doChange(newList);
  };
  const setItem: SetItem<T> = (index, newItem) => {
    const newList = list.map((item, index1) => {
      return index1 === index ? newItem : item;
    });
    setList(newList);
    doChange(newList);
  };
  const getItem: GetItem<T> = (index) => {
    return list[index];
  };
  const popItem: PopItem<T> = (index) => {
    const newList = list.filter((item, index1) => {
      return index1 !== index;
    });
    setList(newList);
    return list[index];
  };
  const onAppend: OnAppend = async (index = -1) => {
    const newItem = await doCreateItem({ list, index });
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
    setList(newList);
    doChange(newList);
  };
  // On Actions
  const onReloadList: OnReload = async () => {
    setPartialInitState({ status: "loading" });
    const optionStatus = await doOptions(list);
    setPartialState(optionStatus);
    doReload(list);
  };

  const onResetList: OnReset = async () => {
    const newList = resetList(submitList);
    setPartialInitState({ status: "reset", options });
    await doReset({ list: newList, prev: list });
  };

  const onSubmitList: OnSubmit = async (force = false) => {
    setPartialInitState({ status: "ready", options });
    const newList = cloneList();
    const feedbackStatus = await doValidate(newList);
    setPartialState(feedbackStatus);
    if (feedbackStatus.status === "valid" || force === true) {
      const messageStatus = await doSubmit({ list: newList, state: formState });
      if (!messageStatus) {
        //Nothing
      } else if (typeof messageStatus === "string") {
        setStatus(messageStatus);
      } else {
        setPartialState(messageStatus);
      }
    }
  };

  const onValidateList: OnValidate = async () => {
    setPartialInitState({ status: "ready", options });
    const newList = cloneList();
    const feedbackStatus = await doValidate(newList);
    setPartialState(feedbackStatus);
  };

  const onNotifyList: OnNotify = async (notify) => {
    const newList = cloneList();
    await doNotify({ notify, list: newList });
  };

  useEffect(() => {
    onReloadList();
  }, []);
  useEffect(() => {
    const newList = resetList(submitList);
    setList(newList);
  }, [submitList]);

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
              doReload={(item) => doReloadItem({ item, list })}
              doChange={(item) => doChangeItem({ item, list })}
              doSubmit={({ data: item, state: itemState }) =>
                doSubmitItem({
                  item,
                  list,
                  state: formState,
                  itemState,
                })
              }
              doValidate={(item) => doValidateItem({ item, list })}
              doOptions={(item) => doOptionsItem({ item, list })}
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
  name: "Default",
  index: 0,
  pk: "id",
  list: [],

  // Function Defaults
  doReset: doResetDefault,
  doNotify: doNotifyDefault,
  doChange: doChangeDefault,
  doSubmit: doSubmitDefault,
  doReload: doReloadDefault,
  doOptions: doOptionsDefault,
  doValidate: doValidateDefault,

  doResetItem: doResetDefault,
  doNotifyItem: doNotifyDefault,
  doCreateItem: doCreateDefault,
  doSubmitItem: doSubmitDefault,
  doChangeItem: doChangeDefault,
  doReloadItem: doReloadDefault,
  doOptionsItem: doOptionsDefault,
  doValidateItem: doValidateDefault,

  deep: false,
  wrapper: IdentityFn,
  wrapperItem: IdentityFn,
};
