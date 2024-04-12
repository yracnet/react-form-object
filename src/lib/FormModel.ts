// Provider Common
export type Status =
  | "loading"
  | "ready"
  | "valid"
  | "invalid"
  | "sending"
  | "failed"
  | "success"
  | "reset";

export type SetStatus = (status: Status) => void;

export type FeedbackItem = any & {
  type: string;
  message: string;
};

export type Feedback = Record<string, FeedbackItem>;

export type SetFeedback = (feedback: Feedback) => void;

export type OptionItem = {
  value: string | number;
  label: string;
  descripcion?: string;
  [key: string]: any;
};

export type Options = Record<string, OptionItem[]>;

export type SetOptions = (options: Options) => void;

export type Message =
  | false
  | {
      type: string;
      title: string;
      descripcion?: string;
      [key: string]: any;
    };

export type SetMessage = (message: Message) => void;

export type FormState = {
  status: Status;
  options: Options;
  feedback: Feedback;
  message: Message;
};

export type FormHandler = {
  setStatus: SetStatus;
  setOptions: SetOptions;
  setFeedback: SetFeedback;
  setMessage: SetMessage;
  setFormState: (state: FormState) => void;
  setPartialInitState: (state: Partial<FormState>) => void;
  setPartialState: (state: Partial<FormState>) => void;
};

// Hooks

export type OnAppend = (index?: number) => void;

export type OnSubmit = (force?: boolean) => void;

export type OnReload = () => void;

export type OnReset = () => void;

export type OnValidate = () => void;

export type Notify = {
  type: string;
  [key: string]: any;
};
export type OnNotify = (notify: Notify) => void;

// Defined

export type Function<T, R> = (arg: T) => R | Promise<R>;

export type Function2<T, D, R> = (arg: T, arg2: D) => R | Promise<R>;
