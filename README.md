# NC News Seeding

## Summary

This project is an API for a news database, allowing the user to get and change data within the database. This currently has limited functionality with changing information but is able to get information from all tables within the news database.

## Instructions for self-hosting.

1. Clone this project using `git clone https://github.com/IHimA2341/news-seeding`.
2. Use `npm install` in your terminal to install the required dependencies.
3. Create a `.env.development` and a `.env.test file`, putting in `PGDATABASE=your_test_database_name_here` for your `.env.test` file and `PGDATABASE=your_database_name_here` for your `.env.development file`.
4. Run `npm run setup-dbs` to setup your databases and `npm run seed-dev` in your terminal to seed your development database.
5. If you want to test, run `npm test` to run the tests.

## Versions

- Minimum version of Node v23.6.1 needed.
- Minimum version of Postgres v16.8 needed.

## Link to the site
https://news-seeding.onrender.com/

