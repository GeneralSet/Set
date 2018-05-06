/* tslint:disable */
import * as wasm from './set_bg';

const __wbg_f_random_js_random_n_target = Math.random;

export function __wbg_f_random_js_random_n() {
    return __wbg_f_random_js_random_n_target();
}

export function random_f64() {
    return wasm.random_f64();
}

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
        static new(arg0, arg1) {
    return Set.__construct(wasm.set_new(arg0, arg1));
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

let slab = [];

let slab_next = 0;

function addHeapObject(obj) {
    if (slab_next === slab.length)
        slab.push(slab.length + 1);
    const idx = slab_next;
    const next = slab[idx];

    slab_next = next;

    slab[idx] = { obj, cnt: 1 };
    return idx << 1;
}

let stack = [];

function getObject(idx) {
    if ((idx & 1) === 1) {
        return stack[idx >> 1];
    } else {
        const val = slab[idx >> 1];

    return val.obj;

    }
}

export function __wbindgen_object_clone_ref(idx) {
    // If this object is on the stack promote it to the heap.
    if ((idx & 1) === 1)
        return addHeapObject(getObject(idx));

    // Otherwise if the object is on the heap just bump the
    // refcount and move on
    const val = slab[idx >> 1];
    val.cnt += 1;
    return idx;
}

function dropRef(idx) {

    let obj = slab[idx >> 1];

    obj.cnt -= 1;
    if (obj.cnt > 0)
        return;

    // If we hit 0 then free up our space in the slab
    slab[idx >> 1] = slab_next;
    slab_next = idx >> 1;
}

export function __wbindgen_object_drop_ref(i) { dropRef(i); }

export function __wbindgen_string_new(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
}

export function __wbindgen_number_new(i) { return addHeapObject(i); }

export function __wbindgen_number_get(n, invalid) {
    let obj = getObject(n);
    if (typeof(obj) === 'number')
        return obj;
    getUint8Memory()[invalid] = 1;
    return 0;
}

export function __wbindgen_undefined_new() { return addHeapObject(undefined); }

export function __wbindgen_null_new() {
    return addHeapObject(null);
}

export function __wbindgen_is_null(idx) {
    return getObject(idx) === null ? 1 : 0;
}

export function __wbindgen_is_undefined(idx) {
    return getObject(idx) === undefined ? 1 : 0;
}

export function __wbindgen_boolean_new(v) {
    return addHeapObject(v === 1);
}

export function __wbindgen_boolean_get(i) {
    let v = getObject(i);
    if (typeof(v) === 'boolean') {
        return v ? 1 : 0;
    } else {
        return 2;
    }
}

export function __wbindgen_symbol_new(ptr, len) {
    let a;
    if (ptr === 0) {
        a = Symbol();
    } else {
        a = Symbol(getStringFromWasm(ptr, len));
    }
    return addHeapObject(a);
}

export function __wbindgen_is_symbol(i) {
    return typeof(getObject(i)) === 'symbol' ? 1 : 0;
}

export function __wbindgen_string_get(i, len_ptr) {
    let obj = getObject(i);
    if (typeof(obj) !== 'string')
        return 0;
    const [ptr, len] = passStringToWasm(obj);
    getUint32Memory()[len_ptr / 4] = len;
    return ptr;
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}
