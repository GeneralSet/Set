let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
* @returns {number}
*/
export function random() {
    const ret = wasm.random();
    return ret;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
*/
export class Set {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Set.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_set_free(ptr);
    }
    /**
    * @returns {number}
    */
    get board_size() {
        const ret = wasm.__wbg_get_set_board_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set board_size(arg0) {
        wasm.__wbg_set_set_board_size(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get number_of_features() {
        const ret = wasm.__wbg_get_set_number_of_features(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set number_of_features(arg0) {
        wasm.__wbg_set_set_number_of_features(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get feature_options() {
        const ret = wasm.__wbg_get_set_feature_options(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set feature_options(arg0) {
        wasm.__wbg_set_set_feature_options(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get sets() {
        const ret = wasm.__wbg_get_set_sets(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set sets(arg0) {
        wasm.__wbg_set_set_sets(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} number_of_features
    * @param {number} feature_options
    * @param {number} board_size
    */
    constructor(number_of_features, feature_options, board_size) {
        const ret = wasm.set_new(number_of_features, feature_options, board_size);
        return Set.__wrap(ret);
    }
    /**
    * @param {string} ids
    * @returns {boolean}
    */
    is_set(ids) {
        const ptr0 = passStringToWasm0(ids, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.set_is_set(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @param {string} board
    * @returns {string}
    */
    hint(board) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(board, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.set_hint(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {string} set
    * @returns {Set}
    */
    update_board(set) {
        const ptr0 = passStringToWasm0(set, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.set_update_board(this.__wbg_ptr, ptr0, len0);
        return Set.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get_deck() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.set_get_deck(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {string}
    */
    get_board() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.set_get_board(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {boolean}
    */
    is_end() {
        const ret = wasm.set_is_end(this.__wbg_ptr);
        return ret !== 0;
    }
}

export const __wbg_random_02b4479eb421fd96 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

