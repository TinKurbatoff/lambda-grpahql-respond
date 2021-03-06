// graphql.ts
import { ApolloServer, gql } from 'apollo-server-lambda';
import fs from "fs";
import { Client } from 'pg';
require('dotenv').config();

let client = new Client({ // Let use Pooling now
  // In production I will use environment variables
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  port: process.env.RDS_PORT,
  host: process.env.RDS_HOSTNAME,
  ssl: process.env.DB_SSL === "True"? { rejectUnauthorized: false } : false,
});

// if a backend error or network problem happens
// pool.on('error', (err: Error, client: PoolClient): void => {
//   console.error('Unexpected error on idle client', err) // just report to console
//   process.exit(-1)
// }) 

// Connect to pool
console.log(`ENVIRONMENT:${process.env.ENVIRONMENT}`);
console.log(`RDS_USERNAME:${process.env.RDS_USERNAME}`);
console.log(`RDS_DATABASE:${process.env.RDS_DATABASE}`);
client.connect()
console.log("DB connected!")

// Construct a schema, using GraphQL schema language
const gqlTypes = fs.readFileSync("./src/types/schema.graphql");
const typeDefs = gql`
  ${gqlTypes}
`;

// Provide resolver functions for schema fields
const resolvers = {
  Query: {
    // addrListItems: () => 'Hello world!',
    async addrListItems(parent, args, context, info) {
        console.log(args);
        let query: {text: string, values: Array<any>}  = {
          text: `SELECT * FROM addresses WHERE formatted_street_address LIKE $1 || '%'`,
          values: [args?.primary_lane.toUpperCase()],
        };
        let resolver: {status: string, message: string, itemsCount: string, data: Array<{}> } = {
          status: "completed", data: [],
          message: "",
          itemsCount: ""
        }
        let result = await client.query(query.text, query.values)
        // let result = await client.query("SELECT NOW();")
        console.log(result.rows)
        // client.end()
        resolver.data = result.rows 
        resolver.message = "real time!"
        resolver.itemsCount = result.rowCount
        return resolver
      },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false,
  cache: 'bounded',
});

exports.handler = server.createHandler();
