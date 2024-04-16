import { t } from 'elysia';
import { App, init } from './Elysia';

const app = new App()
  .patch(
    '/user/profile',
    ({ body, error }) => {
      if (body.age < 18) return error(400, 'Oh no');

      if (body.name === 'Nagisa') return error(418);

      if (body.age === 25) return error(599);

      return body;
    },
    t.Object({
      name: t.String(),
      age: t.Number(),
    })
  )
  .listen(80);

const server = init<typeof app>('localhost');

const res = await server.user.profile.patch({
  name: 'saltyaom',
  age: '21', // x
});

if (res.error) {
  switch (res.error.status) {
    case 400:
      throw res.error.value; // "Oh no"
    case 418:
      throw res.error.value; // "I am a teapot"
    case 599:
      throw res.error.value; // "HTTP Error 599"
  }
}

res.data.name.toString(); // √
