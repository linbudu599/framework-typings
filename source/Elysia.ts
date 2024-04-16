import { t } from 'elysia';

type Simplify<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : Simplify<T[K]>
    : T[K];
} & {};

type UnwrapSchemaType<T extends ReturnType<typeof t.Object>> = Simplify<
  T['static']
>;

type HandlerStruct<UnwrappedSchema> = (input: {
  body: UnwrappedSchema;
  error: DefineError;
}) => unknown;

type BuiltInErrorMap = {
  418: 'I am a teapot';
};

type WithError<TErrorCodes extends number, TMessage extends string> = {
  error: {
    status: TErrorCodes;
    value: TMessage;
  };
};

type FallbackError<Code extends number> = `HTTP Error ${Code}`;

type BuildErrorMessage<Code extends number> = Code extends keyof BuiltInErrorMap
  ? BuiltInErrorMap[Code]
  : FallbackError<Code>;

type DefineError = <
  Code extends number,
  Message extends string = BuildErrorMessage<Code>
>(
  errorCode: Code,
  message?: Message
) => WithError<Code, Message>;

type ParsePathAsTuple<T extends string> =
  T extends `${string}/${infer Param}/${infer Rest}`
    ? [Param, ...ParsePathAsTuple<`/${Rest}`>]
    : T extends `${string}/${infer Param}`
    ? [Param]
    : [];

type ComposeObjectFromTuple<
  T extends string[],
  DeepestStruct extends object = {}
> = T extends [infer First, ...infer Rest]
  ? First extends string
    ? Record<
        First,
        Rest extends string[]
          ? Rest['length'] extends 0
            ? DeepestStruct
            : ComposeObjectFromTuple<Rest, DeepestStruct>
          : DeepestStruct
      >
    : {}
  : {};

type ExtractErrors<Input> = Input extends { error: infer T } ? T : never;

type TransformHandlerResult<
  UnwrappedSchema,
  HandlerReturns extends ReturnType<HandlerStruct<UnwrappedSchema>>
> = Promise<
  | {
      data: UnwrappedSchema;
      error: null;
    }
  | {
      data: null;
      error: ExtractErrors<HandlerReturns>;
    }
>;

export class App<AppStruct = {}> {
  constructor() {}

  public patch<
    Path extends string,
    Handler extends HandlerStruct<UnwrappedSchema>,
    Schema extends ReturnType<typeof t.Object>,
    UnwrappedSchema = UnwrapSchemaType<Schema>,
    AdditionalStruct = ComposeObjectFromTuple<
      ParsePathAsTuple<Path>,
      {
        patch: (
          body: UnwrappedSchema
        ) => TransformHandlerResult<UnwrappedSchema, ReturnType<Handler>>;
      }
    >
  >(
    path: Path,
    handler: Handler,
    schema: Schema
  ): App<AdditionalStruct & AppStruct> {
    return this;
  }

  public listen(port: number) {
    return this;
  }
}

export function init<Struct extends App>(domain: string) {
  return {} as Struct extends App<infer T> ? T : never;
}
