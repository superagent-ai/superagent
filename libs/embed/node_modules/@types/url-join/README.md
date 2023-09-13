# Installation
> `npm install --save @types/url-join`

# Summary
This package contains type definitions for url-join (https://github.com/jfromaniello/url-join).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/url-join.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/url-join/index.d.ts)
````ts
// Type definitions for url-join 4.0
// Project: https://github.com/jfromaniello/url-join
// Definitions by: Rogier Schouten <https://github.com/rogierschouten>
//                 Mike Deverell <https://github.com/devrelm>
//                 BendingBender <https://github.com/BendingBender>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * Join all arguments together and normalize the resulting url.
 * This works similar to `path.join` but you shouldn't use `path.join` for urls since it works
 * differently depending on the operating system and also doesn't work for some cases.
 */
declare function urljoin(...parts: string[]): string;
declare function urljoin(parts: string[]): string;

export = urljoin;
export as namespace urljoin;

````

### Additional Details
 * Last updated: Fri, 09 Jul 2021 02:32:44 GMT
 * Dependencies: none
 * Global values: `urljoin`

# Credits
These definitions were written by [Rogier Schouten](https://github.com/rogierschouten), [Mike Deverell](https://github.com/devrelm), and [BendingBender](https://github.com/BendingBender).
