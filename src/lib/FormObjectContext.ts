import { createContext, useContext } from "react";
import {
  Feedback,
  Message,
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

// Provider Object

export type SetData<T> = (data: T) => void;

export type Attribute = string | number | (number | string)[];

export type SetAttribute = (attr: Attribute, value: any) => void;

export type GetAttribute = (attr: Attribute) => any;

// Object Context
export type FormObjectContextProps<T> = {
  // Identify
  pk: string;
  name: string;
  index: number;

  // Data Handler
  data: T;
  setData: SetData<T>;
  setAttribute: SetAttribute;
  getAttribute: GetAttribute;

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
  onReset: OnReset;
  onSubmit: OnSubmit;
  onReload: OnReload;
  onNotify: OnNotify;
  onValidate: OnValidate;
};

const NOT_INSTANCE: any = "NOT_INSTANCE";

export const FormObjectContext =
  // @ts-ignore
  createContext<FormObjectContextProps>(NOT_INSTANCE);

export const useFormObject = <T extends {}>() => {
  const instance = useContext<FormObjectContextProps<T>>(FormObjectContext);
  if (instance === NOT_INSTANCE) {
    throw new Error("Required a FormObject");
  }
  return instance;
};
