import { useRef, useState } from "react";
import {
  Feedback,
  FormHandler,
  FormState,
  Message,
  Options,
  Status,
} from "./FormModel";

const createClone = <T>(value: T, deep: boolean = false): T => {
  if (value === undefined || value === null) return value;
  if (deep) {
    let newValue = JSON.stringify(value);
    newValue = JSON.parse(newValue);
    return <T>newValue;
  }
  return Array.isArray(value) ? <T>[...value] : <T>{ ...value };
};

type SafeState<T> = { data: T };

export const useSafeState = <T>(
  init: T,
  deep: boolean
): [T, (data: T) => void, (data?: T) => T, () => T] => {
  const initData = (): SafeState<T> => {
    const data = createClone(init, deep);
    return { data };
  };
  const [{ data }, setState] = useState(initData);

  const setData = (data: T) => {
    setState({ data });
  };
  const resetData = (initData = init) => {
    const data = createClone(initData, deep);
    setState({ data });
    return data;
  };
  const cloneData = (): T => {
    return createClone(data, deep);
  };
  return [data, setData, resetData, cloneData];
};

export const useSafeRef = <T>(
  init: T,
  deep: boolean
): [T, (data: T) => void, (data: T) => T, () => T] => {
  const ref = useRef<T>(init);
  const [, setFlag] = useState(false);

  const setData = (data: T) => {
    ref.current = data;
    setFlag((prevFlag) => !prevFlag);
  };
  const resetData = (newDate: T = init) => {
    ref.current = createClone(newDate, deep);
    setFlag((prevFlag) => !prevFlag);
    return ref.current;
  };
  const cloneData = (): T => {
    return createClone(ref.current, deep);
  };
  return [ref.current, setData, resetData, cloneData];
};

export const useFormHandler = (
  initState: FormState
): [FormState, FormHandler] => {
  const [state, setState] = useState(initState);
  const { status, options, feedback, message } = state;
  return [
    state,
    {
      setStatus: (status: Status) => {
        setState({ status, options, feedback, message });
      },
      setOptions: (options: Options) => {
        setState({ status, options, feedback, message });
      },
      setFeedback: (feedback: Feedback) => {
        setState({ status, options, feedback, message });
      },
      setMessage: (message: Message) => {
        setState({ status, options, feedback, message });
      },
      setFormState: (state: FormState) => {
        setState(state);
      },
      setPartialInitState: (state: Partial<FormState>) => {
        const newState = { ...initState, ...state };
        setState(newState);
      },
      setPartialState: (statePartial: Partial<FormState>) => {
        setState((state) => {
          return { ...state, ...statePartial };
        });
      },
    },
  ];
};
