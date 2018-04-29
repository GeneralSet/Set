/* tslint:disable */
import * as wasm from './set_bg';

const __wbg_f_random_random_n_target = Math.random;

export function __wbg_f_random_random_n() {
    return __wbg_f_random_random_n_target();
}

const __wbg_f_floor_floor_n_target = Math.floor;

export function __wbg_f_floor_floor_n(arg0) {
    return __wbg_f_floor_floor_n_target(arg0);
}

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

const TextEncoder = typeof self === 'object' && self.TextEncoder
    ? self.TextEncoder
    : require('util').TextEncoder;

let cachedEncoder = new TextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    return [ptr, buf.length];
}

function setGlobalArgument(arg, i) {
    const idx = globalArgumentPtr() / 4 + i;
    getUint32Memory()[idx] = arg;
}

export class Set {

                static __construct(ptr) {
                    return new Set(ptr);
                }

                constructor(ptr) {
                    this.ptr = ptr;
                }
            get board_size() {
    return wasm.__wbg_get_set_board_size(this.ptr);
}
set board_size(arg0) {
    return wasm.__wbg_set_set_board_size(this.ptr, arg0);
}get number_of_features() {
    return wasm.__wbg_get_set_number_of_features(this.ptr);
}
set number_of_features(arg0) {
    return wasm.__wbg_set_set_number_of_features(this.ptr, arg0);
}get feature_options() {
    return wasm.__wbg_get_set_feature_options(this.ptr);
}
set feature_options(arg0) {
    return wasm.__wbg_set_set_feature_options(this.ptr, arg0);
}get sets() {
    return wasm.__wbg_get_set_sets(this.ptr);
}
set sets(arg0) {
    return wasm.__wbg_set_set_sets(this.ptr, arg0);
}
            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_set_free(ptr);
            }
        static new() {
    return Set.__construct(wasm.set_new());
}
init_deck() {
    const ret = wasm.set_init_deck(this.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
is_set(arg0) {
    const [ptr0, len0] = passStringToWasm(arg0);
    setGlobalArgument(len0, 0);
    return (wasm.set_is_set(this.ptr, ptr0)) !== 0;
}
hint(arg0) {
    const [ptr0, len0] = passStringToWasm(arg0);
    setGlobalArgument(len0, 0);
    const ret = wasm.set_hint(this.ptr, ptr0);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
update_board(arg0, arg1) {
    const [ptr0, len0] = passStringToWasm(arg0);
    setGlobalArgument(len0, 0);
    const [ptr1, len1] = passStringToWasm(arg1);
    setGlobalArgument(len1, 1);
    return Set.__construct(wasm.set_update_board(this.ptr, ptr0, ptr1));
}
get_deck() {
    const ret = wasm.set_get_deck(this.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
get_board() {
    const ret = wasm.set_get_board(this.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

