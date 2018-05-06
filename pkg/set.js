function isNode() { return process && typeof process.env === 'object' && Object.keys(process.env).length; }

if(isNode()) {
  import('./node/set.js');
} else {
  import('./web/set.js');
}
