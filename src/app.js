'use strict';

import { Integer } from './lib/integer';
import * as Bitwise from './lib/bitwise';

const [ten] = Integer.create(100);
const [two] = Integer.create(20);
const [result_and] = Bitwise.and(ten, two);
const [result_or] = Bitwise.or(ten, two);

console.log(result_and.decimal(), result_and.binary());
console.log(result_or.decimal(), result_or.binary());
