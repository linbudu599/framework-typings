# 框架中的类型编程

许多前端框架为了带给开发者极致的开发体验，已经卷得一去不回头，尤其是在类型推导上，它们已经把泛型、模板字符串类型、条件类型等等玩出了花。比如，Prisma 能根据 select 的属性来推导返回值的类型，Hono 能从路由地址解析出参数，Elysia 能把路由地址转化成链式调用...

这些神奇的功能都是如何实现的？这个仓库收录了这些框架简化后的类型编程实现，帮助你从实践出发，理解如何实现这些酷炫的类型推导。

```typescript
import { request } from './Hono';

request('/user/:name/:id', (ctx) => {
  const name = ctx.param('name');
  const id = ctx.param('id');
});
```

```typescript
import { findUnique } from './Prisma';

const result1 = findUnique({
  where: { id: 1 },
  select: { id: true, email: true },
});

result1?.id;
result1?.email;
result1?.name; // x
```

文章列表一览：

- [框架中的类型编程：tRPC & Prisma 中的泛型应用](https://linbudu.gitbook.io/spaces/typescript-in-deep/kuang-jia-zhong-de-lei-xing-bian-cheng-trpc-prisma-zhong-de-fan-xing-ying-yong)
- [框架中的类型编程： Hono 中的模板字符串类型编程](https://linbudu.gitbook.io/spaces/typescript-in-deep/kuang-jia-zhong-de-lei-xing-bian-cheng-hono-zhong-de-mo-ban-zi-fu-chuan-lei-xing-bian-cheng)
- [框架中的类型编程：Elysia 中的链式调用与错误处理](https://linbudu.gitbook.io/spaces/typescript-in-deep/kuang-jia-zhong-de-lei-xing-bian-cheng-san-elysiajs-de-lian-shi-tiao-yong-yu-cuo-wu-chu-li)
