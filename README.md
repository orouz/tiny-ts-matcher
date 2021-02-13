<h1 align="center" style="margin-top:0;"> 
<div>☔</div>
<div>tiny-ts-matcher</div> </h1>
<p align="center">
  <a href="https://www.npmjs.com/package/tiny-ts-matcher"><img src="https://img.shields.io/npm/v/readme-md-generator.svg" /></a>
  <img src="https://img.shields.io/bundlephobia/minzip/tiny-ts-matcher" />
  <a href="https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" target="_blank" />
  </a>
</p>
<div align="center">type safe replacement for switch statements</div>

<br/>

## **Install**

`npm i tiny-ts-matcher`

<br/>

## **Usage**

```typescript
import { createMatcher } from "tiny-ts-matcher";

const match = createMatcher("status");

type ServerResponse =
  | { status: 500; message: string }
  | { status: 400; error: string };

const match = match<ServerResponse>()({
  500: ({ message }) => message,
  400: ({ error }) => error,
  _: () => "no match",
})({ status: 500, message: "woops" });

// match: woops
```
