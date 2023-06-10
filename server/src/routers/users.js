import app from '../index.js';
import usersRoutes from '../database/controllers/users.js';

app.get('/user/:username', usersRoutes.getUser)

app.post('/User', usersRoutes.postUser)

app.patch('/nickname', usersRoutes.patchNickname)

app.patch('/password', usersRoutes.patchPassword)