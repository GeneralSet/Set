/* tslint:disable */
import * as wasm from './set_bg';

export function __wbg_random_02b4479eb421fd96() {
    return Math.random();
}

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

export function __wbg_log_7bf4f600c7f7243a(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    console.log(varg0);
}
/**
* @returns {number}
*/
export function random_f64() {
    return wasm.random_f64();
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    }
    return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

let cachedTextEncoder = new TextEncoder('utf-8');

let WASM_VECTOR_LEN = 0;

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}

function freeSet(ptr) {

    wasm.__wbg_set_free(ptr);
}
/**
*/
export class Set {

    static __wrap(ptr) {
        const obj = Object.create(Set.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeSet(ptr);
    }

    /**
    * @returns {number}
    */
    get board_size() {
        return wasm.__wbg_get_set_board_size(this.ptr);
    }
    set board_size(arg0) {
        return wasm.__wbg_set_set_board_size(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get number_of_features() {
        return wasm.__wbg_get_set_number_of_features(this.ptr);
    }
    set number_of_features(arg0) {
        return wasm.__wbg_set_set_number_of_features(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get feature_options() {
        return wasm.__wbg_get_set_feature_options(this.ptr);
    }
    set feature_options(arg0) {
        return wasm.__wbg_set_set_feature_options(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get sets() {
        return wasm.__wbg_get_set_sets(this.ptr);
    }
    set sets(arg0) {
        return wasm.__wbg_set_set_sets(this.ptr, arg0);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {Set}
    */
    static new(arg0, arg1) {
        return Set.__wrap(wasm.set_new(arg0, arg1));
    }
    /**
    * @returns {string}
    */
    init_deck() {
        const retptr = globalArgumentPtr();
        wasm.set_init_deck(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @param {string} arg0
    * @returns {boolean}
    */
    is_set(arg0) {
        const ptr0 = passStringToWasm(arg0);
        const len0 = WASM_VECTOR_LEN;
        return (wasm.set_is_set(this.ptr, ptr0, len0)) !== 0;
    }
    /**
    * @param {string} arg0
    * @returns {string}
    */
    hint(arg0) {
        const ptr0 = passStringToWasm(arg0);
        const len0 = WASM_VECTOR_LEN;
        const retptr = globalArgumentPtr();
        wasm.set_hint(retptr, this.ptr, ptr0, len0);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @param {string} arg0
    * @param {string} arg1
    * @returns {Set}
    */
    update_board(arg0, arg1) {
        const ptr0 = passStringToWasm(arg0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm(arg1);
        const len1 = WASM_VECTOR_LEN;
        return Set.__wrap(wasm.set_update_board(this.ptr, ptr0, len0, ptr1, len1));
    }
    /**
    * @returns {string}
    */
    get_deck() {
        const retptr = globalArgumentPtr();
        wasm.set_get_deck(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @returns {string}
    */
    get_board() {
        const retptr = globalArgumentPtr();
        wasm.set_get_board(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

