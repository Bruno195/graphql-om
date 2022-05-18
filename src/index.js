import { resolvers, typeDefs } from './graphql/schema';

import { ApolloServer } from 'apollo-server';
import { CommentSQLDataSource } from './graphql/schema/comment/datasources';
import { LoginApi } from './graphql/schema/login/datasources';
import { PostsApi } from './graphql/schema/post/datasources';
import { UsersApi } from './graphql/schema/user/datasources';
import { context } from './graphql/context';
import { knex } from './knex/';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      postApi: new PostsApi(),
      userApi: new UsersApi(),
      loginApi: new LoginApi(),
      commentDb: new CommentSQLDataSource(knex),
    };
  },
  uploads: false,
  cors: {
    origin: ['https://localhost:3000/', 'http://192.168.1.4:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
  subscriptions: {
    onConnect: (connectionParams, ws, _context) => {
      return {
        req: ws.upgradeReq,
      };
    },
    path: '/',
    keepAlive: 5000,
  },
});

const port = process.env.PORT || 4003;
server.listen(port).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
