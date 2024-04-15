import { findUnique } from './Prisma';

const result1 = findUnique({
  where: { id: 1 },
  select: { id: true, email: true },
});

result1?.id;
result1?.email;
result1?.name; // x

const result2 = findUnique({
  where: { id: 1 },
  select: { id: true, name: true, email: false },
});

result2?.id;
result2?.name;
result2?.email; // x
