type User = {
  id: number;
  email: string;
  name: string | null;
};

type UserSelectConstraint = Partial<Record<keyof User, boolean>>;

interface FindUniqueParams<SelectFields extends UserSelectConstraint> {
  where: Partial<User>;
  select: SelectFields;
}

export type PlainObjectType = Record<string, any>;

export type Intersection<A, B> = A extends B ? A : never;

export type ObjectKeysIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Intersection<keyof T, keyof U>;

export type ObjectIntersection<
  T extends PlainObjectType,
  U extends PlainObjectType
> = Pick<T, ObjectKeysIntersection<T, U>>;

export type PickByValueType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

export declare function findUnique<SelectFields extends UserSelectConstraint>(
  params: FindUniqueParams<SelectFields>
): ObjectIntersection<User, PickByValueType<SelectFields, true>> | undefined;
