import { useState } from "react";
import { Button, ButtonGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import {
  DoCreateItem,
  DoSubmitItem,
  DoSubmitList,
  DoValidateItem,
  DoValidateList,
  FormIterator,
  useFormIterator,
  useFormObject,
} from "react-form-object";
import { ulid } from "ulid";
import { DegubData, DegubList } from "./atom/debug";
import { FormInputText } from "./atom/formInputText";
import {
  ContactItem,
  initContactItem,
  validateContacto,
  validateContactoList,
} from "./data";
import { ItemLayout } from "./layout/itemLayout";

const TableLayout = ({ children }: any) => {
  const { onAppend, onSubmitList, onResetList, status } =
    useFormIterator<ContactItem>();
  return (
    <div className={status}>
      <ButtonGroup>
        <Button variant="secondary" onClick={() => onAppend()}>
          onAppend
        </Button>
        <Button variant="danger" type="button" onClick={onResetList}>
          Reset
        </Button>
        <Button variant="primary" type="button" onClick={() => onSubmitList()}>
          Enviar
        </Button>
        <Button disabled>{status}</Button>
      </ButtonGroup>
      <ListGroup>{children}</ListGroup>
      <DegubList />
    </div>
  );
};

const ROOT_STYLE: any = {
  valid: "was-validated",
  invalid: "was-validated",
  failed: "was-validated",
  success: "was-validated",
};

const ContactRow = () => {
  const { popItem } = useFormIterator<ContactItem>();
  const { index, data, onSubmit, onReset, status } =
    useFormObject<ContactItem>();
  const onRemove = () => {
    popItem(index);
  };
  return (
    <ListGroupItem>
      <div>ID: {data.id}</div>
      <ItemLayout className={ROOT_STYLE[status]}>
        <FormInputText name="name" label="Names" required />
        <FormInputText name="email" label="Email" required />
        <div className="actions">
          <ButtonGroup>
            <Button variant="warning" type="button" onClick={onReset}>
              Reset
            </Button>
            <Button variant="danger" type="button" onClick={onRemove}>
              Remove
            </Button>
            <Button variant="primary" type="button" onClick={() => onSubmit()}>
              Enviar
            </Button>
          </ButtonGroup>
        </div>
        <DegubData />
      </ItemLayout>
    </ListGroupItem>
  );
};

export const ContactListSimpleTSExample = () => {
  const [list, setList] = useState<ContactItem[]>([]);
  const onForceAppend = () => {
    setList([...list, initContactItem]);
  };
  const onForceReset = () => {
    setList([]);
  };
  const doCreateItem: DoCreateItem<ContactItem> = async () => {
    return { ...initContactItem, id: ulid() };
  };
  const doSubmit: DoSubmitList<ContactItem> = ({ list }) => {
    setList(list);
  };
  const doSubmitItem: DoSubmitItem<ContactItem> = ({ item, list }) => {
    const newList = list.map((it) => {
      return it.id === item.id ? item : it;
    });
    setList(newList);
  };
  const doValidateItem: DoValidateItem<ContactItem> = ({ item }) => {
    return validateContacto(item);
  };
  const doValidateList: DoValidateList<ContactItem> = (list) => {
    return validateContactoList(list);
  };
  return (
    <div>
      <h3>LEVEL 2</h3>
      <ButtonGroup>
        <Button onClick={onForceAppend}>Force Append</Button>
        <Button onClick={onForceReset}>Force Reset</Button>
      </ButtonGroup>
      <hr />
      <FormIterator
        list={list}
        doValidate={doValidateList}
        doSubmit={doSubmit}
        doSubmitItem={doSubmitItem}
        doCreateItem={doCreateItem}
        doValidateItem={doValidateItem}
        wrapper={TableLayout}
        deep
      >
        <ContactRow />
      </FormIterator>
      <code>
        <pre>REAL STATE: {JSON.stringify(list, null, 2)}</pre>
      </code>
    </div>
  );
};
