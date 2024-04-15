import { request } from './Hono';

request('/user/:name/:id', (ctx) => {
  const name = ctx.param('name');
  const id = ctx.param('id');
});
