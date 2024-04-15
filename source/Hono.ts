type ExtractMuliParams<T extends string> =
  T extends `${string}/:${infer Param}/${infer Rest}`
    ? [Param, ...ExtractMuliParams<`/${Rest}`>]
    : T extends `${string}/:${infer Param}`
    ? [Param]
    : [];

type Context<Path extends string> = {
  param(key: ExtractMuliParams<Path>[number]): string;
};

type RequestHandler<Path extends string> = (ctx: Context<Path>) => void;

export declare function request<Path extends string>(
  requestPath: Path,
  handler: RequestHandler<Path>
): void;
