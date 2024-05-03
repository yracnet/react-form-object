import { Attribute, Path } from "./FormObjectContext";

export const assertPath = (path: Attribute): Path => {
  path = Array.isArray(path) ? [...path] : [path];
  return <Path>path.flatMap((it) => it, 99);
};

export const getRootAttribute = <T>(
  root: T,
  attr: Attribute,
  value2: any = undefined
) => {
  const path = assertPath(attr);
  const name = path.pop();
  let refValue: any = root;
  path.forEach((name) => {
    let value = refValue[name];
    if (!value) {
      refValue[name] = Number.isInteger(name) ? [] : {};
    }
    refValue = refValue[name];
  });
  const value1 = refValue[name!];
  return value1 !== undefined && value1 !== null ? value1 : value2;
};

export const setRootAttribute = <T>(root: T, attr: Attribute, value: any) => {
  const path = assertPath(attr);
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
