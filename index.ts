import * as bcrypt from 'bcrypt';
import cors, { CorsOptions } from 'cors';
import * as dotenv from 'dotenv';
import express, { Response } from 'express';
import authMiddleware from './app/middleware/auth';
import Role from './app/models/db/role';
import User from './app/models/db/user';
import auth from './app/routes/auth';
import users from './app/routes/users';
import sequelize from './db/config';

dotenv.config();

const app = express();

const PORT: number = process.env.APP_PORT as unknown as number;

const corsOptions: CorsOptions = {
  origin: `http://localhost:3000`,
};

app.use(cors(corsOptions));

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
sequelize.sync();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (_, res: Response) => {
  res.json({ message: 'Welcome to backend' });
});

app.post('/db-sync', (_, res: Response) => {
  sequelize.sync({ force: true }).then(async () => {
    console.log('Drop and re-sync db.');

    const adminRole: Role = await Role.create({ role: 'admin' });
    await Role.create({ role: 'user' });

    User.create(
      {
        email: 'tom@rcl.com',
        password: await bcrypt.hash('test', 10),
        accountValidated: true,
        emailVerified: true,
        roleId: adminRole.id,
      },
      {
        include: [Role],
      },
    );
    res.sendStatus(200);
  });
});

app.use('/', auth);

app.use('/users', authMiddleware, users);

app.use((_, res: Response) => {
  res.status(404).send('Unable to find the requested resource!');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
