# hasura-ws

## Getting starter

```bash
docker run -d --net=host \                                                              
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgres@localhost:5432/hasura_ws \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true
  hasura/graphql-engine:latest
```

### Advanced

```bash
docker run -d --net=host \                                                              
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgres@localhost:5432/hasura_ws \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\": \"TlAhvbFyklCGJZLduCvAcwDD5EGMVqiH\"}" \
  -e HASURA_GRAPHQL_ACCESS_KEY=mysecretkey \
  -e HASURA_GRAPHQL_UNAUTHORIZED_ROLE=public \
  -e ACTION_SECRET=myactionsecret \
  -e ACTION_BASE_ENDPOINT=http://localhost:4000 \
  hasura/graphql-engine:latest
```
