import { z } from 'zod';

type InferType<T> = T extends z.ZodType<infer U> ? U : T;

export class Pipeline<InferredInputType = any, InferredOutputType = any> {
  input<InputType extends any>(
    input: InputType
  ): Omit<Pipeline<InferType<InputType>, InferredOutputType>, 'input'> {
    return this as any;
  }

  ouput<OuputType>(
    input: OuputType
  ): Omit<Pipeline<InferredInputType, InferType<OuputType>>, 'output'> {
    return this as any;
  }

  // query 完全是在消费泛型，不会产生新的泛型或更新泛型，所以不需要声明泛型
  query(
    callback: (options: { input: InferredInputType }) => InferredOutputType
  ): void {}
}
