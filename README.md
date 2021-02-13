<h1 align="center" style="margin-top:0;"> 
<div>☔</div>
<div>tiny-ts-matcher</div> </h1>

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
  500: ({ message }) => `Server Error - ${message}`,
  400: ({ error }) => `Request Error - ${error}`,
  _: () => "no match",
})({ tag: "500", message: "woops" });

// match: Server Error - woops
```
