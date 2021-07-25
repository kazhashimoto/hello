#!/usr/bin/env node

const { program } = require("commander");
const debug = require('debug')('hello');

program
  .name('hello')
  .version('1.0.0')
  .usage('[options]')
  .showHelpAfterError()
  .option('-u, --upper', 'convert the message to upper case');

program.parse(process.argv);
const options = program.opts();
debug('options', options);

let greeting_msg = 'hello, world!'
if (options.upper) {
  greeting_msg = greeting_msg.toUpperCase();
}
console.log(greeting_msg);

x = 1;
