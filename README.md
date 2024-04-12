**React Form Object**
![react-form-object](https://github.com/yracnet/react-form-object)

A library for composing and managing complex forms in React.

## Description

The FormObject component is a powerful tool for managing form state in React applications. It provides a simple and intuitive interface for handling form data, validation, and submission. With FormObject, you can easily define complex forms with nested fields and dynamic validation rules. It handles state management internally, reducing boilerplate code and making form development more efficient. Additionally, FormObject integrates seamlessly with Yup for schema-based validation and provides hooks for custom validation logic. Overall, FormObject simplifies the process of building and managing forms in React applications, making it an essential tool for frontend developers.

## Installation

You can install the package via npm:

```bash
npm install react-form-object
```

Or via yarn:

```bash
yarn add react-form-object
```

## Componentes

- FormObject: For managing complex data forms.
- FormIterator: For managing arrays of complex data forms.

## Usage

To use the FormObject component, import it from react-form-object and use it within your React components. Here's a simple example of how to use the FormObject component:

See the full code [here](examples/src/contact/simplejs.jsx)

```jsx
export const ContactSimpleExample = () => {
  const [data, setData] = useState(initContact);
  // Method for load options of form
  const doOptions = async () => {
    await sleep(1000); // Simulate fetching options from a server
    return {
      status: "ready",
      options: {
        gender: [
          { value: "", label: `??? ${Date.now()}` },
          { value: "M", label: "Male" },
          { value: "F", label: "Female" },
        ],
      },
    };
  };

  // Method for validate the contact data
  // You could use any tool
  const doValidate = async (contact) => {
    try {
      const result = contactSchema.validateSync(contact, { abortEarly: false });
      return {
        status: "valid",
        feedback: {
          name: {
            type: "valid",
            message: "It is valid!!!",
          },
        },
      };
    } catch (validationError) {
      const feedback = {};
      validationError.inner.forEach((error) => {
        const path = error.path;
        const errorMessage = error.message;
        feedback[path] = { type: "invalid", message: errorMessage };
      });
      return { status: "invalid", feedback };
    }
  };
  // Submit data
  const doSubmit = async ({ data }) => {
    setData(data);
    await sleep(1000); // Simulate submitting data to a server
    return {
      status: "failed",
      message: {
        type: "danger",
        title: "Invalid Service",
        description: "This service is invalid",
      },
    };
  };
  // Declare FormObject
  return (
    <div>
      <FormObject
        data={data}
        doOptions={doOptions}
        doSubmit={doSubmit}
        doValidate={doValidate}
      >
        <ContactForm />
      </FormObject>
      <pre>MAIN:{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

The `ContactForm` is abstracted from data information and can be split into smaller parts, as it is reused in other forms.

```jsx
const ContactForm = () => {
  const { data, onSubmit, onReset, onReload, options } = useFormObject();
  const enabledGuardian = data.age && data.age < 18;
  return (
    <FormLayout className={ROOT_STYLE[status]}>
      <FormInputText label="Name" name="name" required />
      <FormInputText label="Last Name" name="lastname" required />
      <FormInputText label="Gender" name="gender" required />
      <FormInputText label="Age" name="age" required />
      <FormInputText
        label="Guardian Name"
        name="guardianName"
        disabled={!enabledGuardian}
        required
      />
      <FormInputText
        label="Guardian Phone"
        name="guardianPhone"
        disabled={!enabledGuardian}
        required
      />
      <FormInputText label="Correo Electrónico" name="email" required />
      <FormSelectText
        label="Gender"
        name="gender"
        options={options.gender}
        required
      />
      <div className="message">
        <MessageResponse />
      </div>
      <div className="actions">
        <ButtonGroup>
          <Button variant="success" type="button" onClick={onReload}>
            Reload
          </Button>
          <Button variant="danger" type="button" onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" type="button" onClick={(e) => onSubmit()}>
            Submit
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={(e) => onSubmit(true)}
          >
            Force Submit
          </Button>
        </ButtonGroup>
      </div>
    </FormLayout>
  );
};
```

The `FormInputText` component is reused throughout the entire project.

```jsx
const FormInputText = ({ name, label, ...props }) => {
  const { getAttribute, setAttribute, feedback } = useFormObject();
  const onChange = (e) => setAttribute(name, e.target.value);
  const value = getAttribute(name) || "";
  const className = ITEM_STYLE[feedback[name]?.type];
  return (
    <Form.Group className={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        value={value}
        onChange={onChange}
        className={className}
      />
      <Form.Control.Feedback type={feedback[name]?.type}>
        {feedback[name]?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};
```

The `MessageResponse` component is reused throughout the entire project.

```jsx
const MessageResponse = () => {
  const { status, message } = useFormObject();
  return (
    message && (
      <Alert variant={message.type}>
        <b>
          {status} - {message.title}:{" "}
        </b>{" "}
        {message.description}
      </Alert>
    )
  );
};
```

## FormObject

The `FormObject` component accepts the following props:

```ts
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
```

- **index:** Index within an array, used primarily in conjunction with the FormIterator component.
- **pk:** The name of the primary key attribute.
- **name:** The name of the FormObject, used for identification in debugging purposes.
- **data:** The initial data, representing the initial state of the form.
- **doReset:** A function to perform reset actions on the form.
- **doChange:** A function to handle changes to the form data.
- **doNotify:** A function to notify changes within the form.
- **doSubmit:** A function to handle form submission.
- **doReload:** A function to reload the form.
- **doOptions:** A function to fetch options for form fields.
- **doValidate:** A function to validate the form data.
- **deep:** A boolean indicating whether deep cloning is required for the form data.
- **children:** The child components of the FormObject.
- **wrapper:** A wrapper component to render before the child components.

### useFormObject

The `useFormObject` hook provides access to the following data:

```ts
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
```

- **pk:** The name of the primary key attribute.
- **name:** The name of the FormObject, used for identification.
- **index:** Index within an array, used primarily in conjunction with the FormIterator component.
- **data:** The current form data.
- **setData:** A function to update the form data.
- **setAttribute:** A function to set a specific attribute of the form data.
- **getAttribute:** A function to get the value of a specific attribute from the form data.
- **status:** The current status of the form (e.g., loading, ready, invalid).
- **setStatus:** A function to update the status of the form.
- **feedback:** Feedback messages related to form validation.
- **setFeedback:** A function to update the feedback messages.
- **options:** Options available for form fields.
- **setOptions:** A function to update the available options.
- **message:** A message returned after submitting the form.
- **setMessage:** A function to update the message after form submission.
- **onReset:** A method to reset the form to its initial state.
- **onSubmit:** A method to submit the form data.
- **onReload:** A method to reload the form.
- **onNotify:** A method to notify changes within the form.
- **onValidate:** A method to validate the form data.

## FormIterator

The `FormIterator` component is used for managing arrays of complex data within forms.

### useFormIterator

The `useFormIterator` hook provides access to the functionality of the `FormIterator` component, allowing for dynamic management of array data within forms.

## Contributing

## License

This package is open-sourced software licensed under the [MIT license](LICENSE.md).
