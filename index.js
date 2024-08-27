const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { TODOS, USERS } = require("./DB.js");

const PORT = 8000;

const typeDefs = `
    type Todo {
        id: ID!
        title: String
        completed: Boolean
        user: User
    }

    type User {
        id: ID!
        name: String
        username: String
        phone: String
        website: String
    }

    type Query {
        getTodos: [Todo]
        getUsers: [User]
    }
`;

const resolvers = {
    Todo: {
        user: (todo) => USERS.find((user) => user.id === todo.userId),
    },
    Query: {
        getTodos: () => TODOS,
        getUsers: () => USERS,
    }
};

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
    });

    app.use(express.json());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(PORT, () => {
        console.log("Server is listening on PORT: ", PORT);
    });
}

startServer();