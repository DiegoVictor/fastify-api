# Fastify API
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DiegoVictor/fastify-api/config.yml?logo=github&style=flat-square)](https://github.com/DiegoVictor/fastify-api/actions)
[![postgres](https://img.shields.io/badge/postgres-8.11.5-326690?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![typescript](https://img.shields.io/badge/typescript-5.4.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![eslint](https://img.shields.io/badge/eslint-8.57.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![vitest](https://img.shields.io/badge/vitest-1.5.2-6e9f18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/fastify-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/fastify-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/fastify-api/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Fastify%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Ffastify-api%2Fmain%2FInsomnia_2024-12-16.json)

Small and simple transactions API developed with [Fastify](https://www.fastify.io/).

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use just one database, you can choose between: [SQLite](https://www.sqlite.org/index.html) and [Postgres](https://www.postgresql.org/), look to [env](#env) to see how.

### Migrations
Remember to run the migrations:
```
$ yarn knex:migrate
```
Or:
```
$ npx knex migrate:latest
```
> See more information on [Knex Migrations](https://knexjs.org/guide/migrations.html).

### .env
In this file you may configure the environment, your app's port and a url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|NODE_ENV|App environment.|`development`
|DATABASE_CLIENT|Postgres (`pg`) or SQLite (`sqlite`).|`sqlite`
|DATABASE_URL|If `DATABASE_CLIENT` is `sqlite` this should be the path to the database file, but if `DATABASE_CLIENT` is `pg` it should be the URL to connect to the database.|`./db/fastify-api.sqlite`
|PORT|Port number where the app will run (optional).|`3000`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Routes
|route|HTTP Method|params|description
|:---|:---:|:---:|:---:
|`/transactions`|POST|Body with user transaction `type`, `title` and `amount`.|Create a new transaction (`credit` or `debit`).
|`/transactions`|GET| - |Get all transactions.
|`/transactions/:id`|GET|`id` of the transaction|Get one transaction.
|`/transactions/summary`|GET| - |Return transactions summary.

### Requests
* `POST /connections`

Request body:
```json
{
  "type": "credit",
  "title": "Deposit",
  "amount": 1000
}
```

# Running the tests
[Vitest](https://vitest.dev) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
