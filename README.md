# maybe-monad

[![Greenkeeper badge](https://badges.greenkeeper.io/Roaders/maybe-monad.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/Roaders/maybe-monad.svg?branch=master)](https://travis-ci.org/Roaders/maybe-monad)

A Typescript implementation of the Maybe mondad.

## Installation

`npm install --save maybe-monad`

## Usage

The Usual use case of the Maybe monday is to make it easier to deal with possibly null or undefined values.
A Maybe may have a value or it may not have a value. further processing can take place based on this.

For example:

```
var someObjectFromAService;

const name: string = Maybe.nullToMaybe(someObjectFromAService)
    .map(object => object.name)
    .filter(name => name != '')
    .do(name => console.log('The name is ' + name))
    .elseDo(() => console.log(`There was no name defined`))
    .defaultTo(`Default Name`);
```
This is a simple example. If at any point the value is null then no more processing will occur (until we get to `defaultTo`).

You can use Maybe to deal with logic that does involve `null`. Use the relevant `allowNull` operators such as `mapAllowNull`.

Maybes can be very powerful when combined together using the `and`, `or` and `combine` operators.

## Tests

Tests can be run as follows:

```
git clone https://github.com/Roaders/maybe-monad.git
cd maybe-monad
npm install
npm test
```

## Example
An example can be run as follows:

```
git clone https://github.com/Roaders/maybe-monad.git
cd maybe-monad
npm install
npm start
```