'use strict';

import { Integer } from './lib/integer';
import * as bitwise from './lib/bitwise';

const ten = Integer.create(100);
const two = Integer.create(20);

console.log(bitwise.and(ten, two));
