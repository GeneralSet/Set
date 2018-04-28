/* tslint:disable */
import * as wasm from './set_bg';

const TextDecoder = typeof self === 'object' && self.TextDecoder
    ? self.TextDecoder
    : require('util').TextDecoder;

let cachedDecoder = new TextDecoder('utf-8');

let cachedUint8Memory = null;
function getUint8Memory() {
    if (cachedUint8Memory === null ||
        cachedUint8Memory.buffer !== wasm.memory.buffer)
        cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
    return cachedUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedDecoder.decode(getUint8Memory().slice(ptr, ptr + len));
}

let cachedUint32Memory = null;
function getUint32Memory() {
    if (cachedUint32Memory === null ||
        cachedUint32Memory.buffer !== wasm.memory.buffer)
        cachedUint32Memory = new Uint32Array(wasm.memory.buffer);
    return cachedUint32Memory;
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null)
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    return cachedGlobalArgumentPtr;
}

function getGlobalArgument(arg) {
    const idx = globalArgumentPtr() / 4 + arg;
    return getUint32Memory()[idx];
}

export function init_deck() {
    const ret = wasm.init_deck();
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}

