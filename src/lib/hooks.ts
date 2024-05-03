import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Attribute, GetAttribute, SetAttribute } from "./FormObjectContext";
import { getRootAttribute, setRootAttribute } from "./util";

const createClone = <T>(value: T, deep: boolean = false): T => {
  if (value === undefined || value === null) return value;
  if (deep) {
    let newValue = JSON.stringify(value);
    newValue = JSON.parse(newValue);
    return <T>newValue;
  }
  return Array.isArray(value) ? <T>[...value] : <T>{ ...value };
};

export const useStateAttribute = <T>(
  [data, setData]: [T, Dispatch<SetStateAction<T>>],
  {
    deep = false,
    onChange = () => {},
  }: {
    deep: boolean;
    onChange: (data: T) => void;
  }
): //deep: boolean = false
[GetAttribute, SetAttribute] => {
  const getAttribute = (path: Attribute, value?: any) => {
    return getRootAttribute(data, path, value);
  };
  const setAttribute = (path: Attribute, value: any) => {
    setData((data) => {
      let newData = createClone(data, deep);
      newData = setRootAttribute(newData, path, value);
      onChange(newData);
      return newData;
    });
  };
  return [getAttribute, setAttribute];
};

export const useStateDelegate = <S>(
  initialState: S | (() => S),
  {
    delegate,
    setDelegate,
  }: {
    delegate?: S;
    setDelegate?: Dispatch<SetStateAction<S>>;
  }
): [S, Dispatch<SetStateAction<S>>] => {
  const [status, setStatus] = useState(
    delegate !== undefined ? delegate : initialState
  );

  useEffect(() => {
    if (delegate !== undefined) {
      setStatus(delegate);
    }
  }, [delegate]);

  useEffect(() => {
    if (setDelegate && delegate !== undefined) {
      setDelegate(status);
    }
  }, [status, setDelegate]);

  return [status, setStatus];
};
