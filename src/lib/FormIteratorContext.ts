import { createContext, useContext } from "react";
import {
  Feedback,
  Message,
  OnAppend,
  OnNotify,
  OnReload,
  OnReset,
  OnSubmit,
  OnValidate,
  Options,
  SetFeedback,
  SetMessage,
  SetOptions,
  SetStatus,
  Status,
} from "./FormModel";

// Provider List

export type SetList<T> = (list: T[]) => void;

export type AddItem<T> = (item: T, index?: number) => void;

export type SetItem<T> = (index: number, item: T) => void;

export type GetItem<T> = (index: number) => T;

export type PopItem<T> = (index: number) => T;

// List Context
export type FormIteratorContextProps<T = any> = {
  // Identify
  pk: string;
  name: string;

  // List Handler
  size: number;
  list: T[];
  setList: SetList<T>;
  addItem: AddItem<T>;
  setItem: SetItem<T>;
  getItem: GetItem<T>;
  popItem: PopItem<T>;

  // Status Handler
  status: Status;
  setStatus: SetStatus;
  feedback: Feedback;
  setFeedback: SetFeedback;
  options: Options;
  setOptions: SetOptions;
  message: Message;
  setMessage: SetMessage;

  // Allows Methods
  onAppend: OnAppend;
  onResetList: OnReset;
  onSubmitList: OnSubmit;
  onReloadList: OnReload;
  onNotifyList: OnNotify;
  onValidateList: OnValidate;
};

const NOT_INSTANCE: any = "NOT_INSTANCE";

export const FormIteratorContext =
  // @ts-ignore
  createContext<FormIteratorContextProps>(NOT_INSTANCE);

export const useFormIterator = <T extends {}>() => {
  const instance = useContext<FormIteratorContextProps<T>>(FormIteratorContext);
  if (instance === NOT_INSTANCE) {
    throw new Error("Required a FormIterator");
  }
  return instance;
};
