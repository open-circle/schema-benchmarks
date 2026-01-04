# [Schema Benchmarks](https://schemabenchmarks.dev)

A project aiming to consolidate and standardise comparisons of schema validation libraries.

## Methodologies

**Runtime** benchmarks are run in sequence, on a GitHub runner. There are different types of benchmark:

- Initialization: Creating the schema itself. This is usually a one time cost.
- Validation: Checking if a given value matches the schema.
- Parsing: Checking if a given value matches the schema, **and** returning a new value. This will include any transformations.

Some libraries only support validation, or parsing. In these cases, we categorise them accordingly.

Each library is benchmarked against a set of data, both valid and invalid.

**Download** benchmarks are created by compiling example usage files with [Rolldown](https://rolldown.rs/), and measuring the size of the output, both minified and unminified.

## Structure

This monorepo is split into 4 main parts:

### `schemas`

The schemas and benchmark definitions for each library, and the data used.

_If you're looking to add a new library, this is most relevant._

### `website`

The website for displaying results, built with [TanStack Start](https://tanstack.com/start). Deployed at [schemabenchmarks.dev](https://schemabenchmarks.dev).

### `bench`

Node scripts to consume and run the benchmarks, and the results.

### `utils`

Simple utilities that might be useful in multiple places, that aren't worth depending on a specific library for.
