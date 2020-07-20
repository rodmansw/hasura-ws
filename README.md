<h1 align="center">
  HASURA WS
</h1>

## 🚀 Getting Started

### Running the API

First create a .env file with the following variables

```env
API_PORT=API_PORT
HASURA_PORT=HASURA_PORT
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hasura_ws
ACTION_SECRET=VALUE_HERE
ENCRYPTION_KEY=VALUE_HERE
HASURA_GRAPHQL_ACCESS_KEY=mysecretkey
HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256", "key": "ENCRYPTION_KEY"}'
```

### Prisma consideration

If you did some DB changes you will need to run the following command

```bash
npm run prisma-deploy
# or
yarn prisma-deploy
```

## Run in Docker

```bash
npm run hasura-docker
# or
yarn hasura-docker
```

PD: Wind. use IP of dockerToolbox(Docker Machine)

## Run Hasura locally

Run the following command and change the DB\_\* variables for your DB info

### Linux

```bash
docker run -d --net=host \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://DB_USER:DB_PASS@DB_HOST:DB_PORT/DB_NAME \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\": \"ENCRYPTION_KEY_IN_YOUR_ENV_FILE\"}" \
  -e HASURA_GRAPHQL_ACCESS_KEY=mysecretkey \
  -e HASURA_GRAPHQL_UNAUTHORIZED_ROLE=public \
  -e ACTION_SECRET=ACTION_SECRET_IN_YOUR_ENV_FILE \
  -e ACTION_BASE_ENDPOINT=API_ENDPOINT \
  hasura/graphql-engine:latest
```

### Windows

If you are using Docker Desktop DB_HOST will be `docker.for.win.localhost` and for Dorcker ToolBox it might be the actual IP of your computer

```bash
docker run -d -p 8080:8080 \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://DB_USER:DB_PASS@DB_HOST:DB_PORT/DB_NAME \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_JWT_SECRET="{\"type\":\"HS256\", \"key\": \"ENCRYPTION_KEY_IN_YOUR_ENV_FILE\"}" \
  -e HASURA_GRAPHQL_ACCESS_KEY=mysecretkey \
  -e HASURA_GRAPHQL_UNAUTHORIZED_ROLE=public \
  -e ACTION_SECRET=ACTION_SECRET_IN_YOUR_ENV_FILE \
  -e ACTION_BASE_ENDPOINT=API_ENDPOINT \
  hasura/graphql-engine:latest
```

## Export Hasura

[Install Hasura CLI](https://hasura.io/docs/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install-hasura-cli)

If you did some changes on Hasura/DB you need to export the metadata so other devs can use it

```bash
# metadata
hasura metadata export --endpoint HASURA_ENDPOINT --admin-secret mysecretkey
# migrations
hasura migrate create migration_name --from-server --endpoint HASURA_ENDPOINT --admin-secret mysecretkey
```

PD: HASURA_ENDPOINT might look like http://localhost:8080

## Import Hasura

Import migrations

```bash
# metadata
hasura metadata apply --endpoint HASURA_ENDPOINT --admin-secret mysecretkey
# migrations
hasura migrate apply --version "<init-migration-version>" --skip-execution
```

## Function

```sql
CREATE OR REPLACE FUNCTION user_full_name(user_row users)
RETURNS TEXT AS $$
  SELECT user_row.name || ' ' || user_row.surname
$$ LANGUAGE sql STABLE;
```

```sql
CREATE OR REPLACE FUNCTION filter_users(search text)
RETURNS SETOF users  AS $$
  SELECT *
  FROM users
  WHERE (
      name ilike ('%' || search || '%')
      OR surname ilike ('%' || search || '%')
    )
$$ LANGUAGE sql STABLE;
```

## Remote Schema

[Contentful](https://graphql.contentful.com/content/v1/spaces/f8bqpb154z8p/explore?access_token=9d5de88248563ebc0d2ad688d0473f56fcd31c600e419d6c8962f6aed0150599)

```
URL: https://graphql.contentful.com/content/v1/spaces/f8bqpb154z8p
Authorization : Bearer 9d5de88248563ebc0d2ad688d0473f56fcd31c600e419d6c8962f6aed0150599
```
