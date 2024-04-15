import { t } from 'elysia';

type Simplify<T> = {
  [K in keyof T]: T[K] extends object ? Simplify<T[K]> : T[K];
} & {};

type UnwrapSchemaType<T extends ReturnType<typeof t.Object>> = Simplify<
  T['static']
>;

type Handler<InferredSchema> = (input: {
  body: InferredSchema;
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

type GetBuiltInError<Code extends number> = Code extends keyof BuiltInErrorMap
  ? BuiltInErrorMap[Code]
  : FallbackError<Code>;

type DefineError = <
  const Code extends number,
  const Message extends string = GetBuiltInError<Code>
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

type ComposeObject<TFirst extends string, Nesting extends any> = {
  [K in TFirst]: Nesting;
};

type ComposeObjectFromTuple<
  T extends string[],
  DeepestStruct extends object = {}
> = T extends [infer First, ...infer Rest]
  ? First extends string
    ? ComposeObject<
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
  InferredSchema,
  HandlerDefinition extends ReturnType<Handler<InferredSchema>>
> = Promise<
  | {
      data: InferredSchema;
      error: null;
    }
  | {
      data: null;
      error: ExtractErrors<HandlerDefinition>;
    }
>;

export class App<AppStruct = {}> {
  constructor() {}

  public post<
    TPath extends string,
    HandlerDefinition extends Handler<InferredSchema>,
    TSchema extends ReturnType<typeof t.Object>,
    InferredSchema = UnwrapSchemaType<TSchema>,
    TParsedStruct = ComposeObjectFromTuple<
      ParsePathAsTuple<TPath>,
      {
        post: (
          body: InferredSchema
        ) => TransformHandlerResult<
          InferredSchema,
          ReturnType<HandlerDefinition>
        >;
      }
    >
  >(
    path: TPath,
    handler: HandlerDefinition,
    schema: TSchema
  ): App<TParsedStruct> {
    return this as App<TParsedStruct>;
  }

  public listen(port: number) {
    return this;
  }
}

export function init<Struct extends App>(domain: string) {
  return {} as Struct extends App<infer T> ? T : never;
}
