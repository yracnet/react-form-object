import { Attribute } from "./FormObjectContext";

export type Attribute1 = (number | string)[];

export const getRootAttribute = <T>(root: T, path: Attribute) => {
  path = Array.isArray(path) ? [...path] : [path];
  const name = path.pop();
  let refValue: any = root;
  path.forEach((name) => {
    let value = refValue[name];
    if (!value) {
      refValue[name] = Number.isInteger(name) ? [] : {};
    }
    refValue = refValue[name];
  });
  return refValue[name!];
};

export const setRootAttribute = <T>(root: T, path: Attribute, value: any) => {
  path = Array.isArray(path) ? [...path] : [path];
  const name = path.pop();
  let refValue: any = root;
  path.forEach((name) => {
    let value = refValue[name];
    if (!value) {
      refValue[name] = Number.isInteger(name) ? [] : {};
    }
    refValue = refValue[name];
  });
  refValue[name!] = value;
  return root;
};

export const createClone = <T>(value: T, deep: boolean = false): T => {
  if (value === undefined || value === null) return value;
  if (deep) {
    let newValue = JSON.stringify(value);
    newValue = JSON.parse(newValue);
    return <T>newValue;
  }
  return Array.isArray(value) ? <T>[...value] : <T>{ ...value };
};
