import { Dispatch, SetStateAction, createContext, useContext } from "react";
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
import { assertPath } from "./util";

// Provider Object

export type InitData<S> = S | (() => S);

export type SetData<S> = Dispatch<SetStateAction<S>>;

export type Path = (number | string)[];

export type Attribute = string | number | (Attribute | Attribute[])[];

export type SetAttribute = <R = any>(attr: Attribute, value: R) => void;

export type GetAttribute = <R = any>(attr: Attribute, value?: R) => R;

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

export const useFormValue = <T extends {}>(
  path: Attribute,
  //@ts-ignore
  _default: T = {}
) => {
  const basePath = assertPath(path);
  const { data, setData, setAttribute, getAttribute, ...others } =
    useFormObject<any>();
  const value: T = getAttribute(basePath, _default);
  const setValue = (value: T) => {
    setAttribute(basePath, value);
  };
  return {
    // Value Handler
    value,
    setValue,
    getAttribute: (path: Attribute, _default?: any) => {
      const newPath = assertPath([basePath, path]);
      return getAttribute(newPath, _default);
    },
    setAttribute: (path: Attribute, value: T) => {
      const newPath = assertPath([basePath, path]);
      return setAttribute(newPath, value);
    },
    // Others Handler
    ...others,
  };
};

export const useFormValueList = <T extends {}>(
  path: Attribute,
  _default: T[] = []
) => {
  const basePath = assertPath(path);
  const { pk, data, setData, setAttribute, getAttribute, ...others } =
    useFormObject<any>();
  const value: T[] = getAttribute(basePath, _default);
  const setValue = (value: T[]) => {
    setAttribute(basePath, value);
  };
  const size = value.length;
  return {
    // Value Handler
    pk,
    size,
    value,
    setValue,
    addItem: (item: T, index: number = -1) => {
      if (index === 0) {
        const newValue = [item, ...value];
        setValue(newValue);
      } else if (0 < index && index < value.length) {
        const newValue = value.flatMap((it, ix) => {
          return ix === index ? [item, it] : it;
        });
        setValue(newValue);
      } else {
        const newValue = [...value, item];
        setValue(newValue);
      }
    },
    getItem: (index: number): T => {
      return value[index];
    },
    setItem: (index: number, item: T) => {
      const newValue = value.map((it, ix) => {
        return ix === index ? item : it;
      });
      setValue(newValue);
    },
    removeItem: (item: T) => {
      const newValue = value.filter((it) => {
        return it !== item;
      });
      setValue(newValue);
    },
    removePk: (pkValue: any) => {
      const newValue = value.filter((it: any) => {
        return it[pk] !== pkValue;
      });
      setValue(newValue);
    },
    removeIndex: (index: number) => {
      const newValue = value.filter((it, ix) => {
        return ix !== index;
      });
      setValue(newValue);
    },
    getAttribute: (path: Attribute, _default?: any) => {
      const newPath = assertPath([basePath, path]);
      return getAttribute(newPath, _default);
    },
    setAttribute: (path: Attribute, value: any) => {
      const newPath = assertPath([basePath, path]);
      return setAttribute(newPath, value);
    },
    // Others Handler
    ...others,
  };
};
