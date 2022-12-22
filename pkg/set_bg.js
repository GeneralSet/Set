import * as wasm from './set_bg.wasm';

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
* @returns {number}
*/
export function random() {
    var ret = wasm.random();
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

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
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
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

        wasm.__wbg_set_free(ptr);
    }
    /**
    * @returns {number}
    */
    get board_size() {
        var ret = wasm.__wbg_get_set_board_size(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set board_size(arg0) {
        wasm.__wbg_set_set_board_size(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get number_of_features() {
        var ret = wasm.__wbg_get_set_number_of_features(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set number_of_features(arg0) {
        wasm.__wbg_set_set_number_of_features(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get feature_options() {
        var ret = wasm.__wbg_get_set_feature_options(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set feature_options(arg0) {
        wasm.__wbg_set_set_feature_options(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get sets() {
        var ret = wasm.__wbg_get_set_sets(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set sets(arg0) {
        wasm.__wbg_set_set_sets(this.ptr, arg0);
    }
    /**
    * @param {number} number_of_features
    * @param {number} feature_options
    * @param {number} board_size
    * @returns {Set}
    */
    static new(number_of_features, feature_options, board_size) {
        var ret = wasm.set_new(number_of_features, feature_options, board_size);
        return Set.__wrap(ret);
    }
    /**
    * @param {string} ids
    * @returns {boolean}
    */
    is_set(ids) {
        var ptr0 = passStringToWasm0(ids, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.set_is_set(this.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @param {string} board
    * @returns {string}
    */
    hint(board) {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            var ptr0 = passStringToWasm0(board, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.set_hint(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} set
    * @returns {Set}
    */
    update_board(set) {
        var ptr0 = passStringToWasm0(set, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.set_update_board(this.ptr, ptr0, len0);
        return Set.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get_deck() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.set_get_deck(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get_board() {
        try {
            const retptr = wasm.__wbindgen_export_2.value - 16;
            wasm.__wbindgen_export_2.value = retptr;
            wasm.set_get_board(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_2.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {boolean}
    */
    is_end() {
        var ret = wasm.set_is_end(this.ptr);
        return ret !== 0;
    }
}

export const __wbg_random_acb4d59385f18229 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

