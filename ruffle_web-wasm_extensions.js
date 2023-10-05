import { getProperty, copyToAudioBufferInterleaved } from './ruffle-imports';

const lAudioContext = (typeof AudioContext !== 'undefined' ? AudioContext : (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : undefined));
let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

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

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

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

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_52(arg0, arg1, arg2) {
    wasm.closure512_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_57(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__had68ccfdb9287801(arg0, arg1);
}

function __wbg_adapter_60(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4ab7309a8e8deaaf(arg0, arg1, arg2);
}

function __wbg_adapter_69(arg0, arg1, arg2) {
    wasm.closure4294_externref_shim(arg0, arg1, arg2);
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addToExternrefTable0(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

let cachedFloat32Memory0 = null;

function getFloat32Memory0() {
    if (cachedFloat32Memory0 === null || cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedUint8ClampedMemory0 = null;

function getUint8ClampedMemory0() {
    if (cachedUint8ClampedMemory0 === null || cachedUint8ClampedMemory0.byteLength === 0) {
        cachedUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}
function __wbg_adapter_1015(arg0, arg1, arg2, arg3) {
    wasm.closure7732_externref_shim(arg0, arg1, arg2, arg3);
}

/**
* An opaque handle to a `RuffleInstance` inside the pool.
*
* This type is exported to JS, and is used to interact with the library.
*/
export class Ruffle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ruffle.prototype);
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
        wasm.__wbg_ruffle_free(ptr);
    }
    /**
    * @param {HTMLElement} parent
    * @param {any} js_player
    * @param {any} config
    */
    constructor(parent, js_player, config) {
        const ret = wasm.ruffle_new(parent, js_player, config);
        return ret;
    }
    /**
    * Stream an arbitrary movie file from (presumably) the Internet.
    *
    * This method should only be called once per player.
    *
    * `parameters` are *extra* parameters to set on the LoaderInfo -
    * parameters from `movie_url` query parameters will be automatically added.
    * @param {string} movie_url
    * @param {any} parameters
    */
    stream_from(movie_url, parameters) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(movie_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.ruffle_stream_from(retptr, this.__wbg_ptr, ptr0, len0, parameters);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Play an arbitrary movie on this instance.
    *
    * This method should only be called once per player.
    * @param {Uint8Array} swf_data
    * @param {any} parameters
    * @param {string} swf_name
    */
    load_data(swf_data, parameters, swf_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(swf_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.ruffle_load_data(retptr, this.__wbg_ptr, swf_data, parameters, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    */
    play() {
        wasm.ruffle_play(this.__wbg_ptr);
    }
    /**
    */
    pause() {
        wasm.ruffle_pause(this.__wbg_ptr);
    }
    /**
    * @returns {boolean}
    */
    is_playing() {
        const ret = wasm.ruffle_is_playing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    volume() {
        const ret = wasm.ruffle_volume(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} value
    */
    set_volume(value) {
        wasm.ruffle_set_volume(this.__wbg_ptr, value);
    }
    /**
    * @returns {any}
    */
    renderer_debug_info() {
        const ret = wasm.ruffle_renderer_debug_info(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {any}
    */
    renderer_name() {
        const ret = wasm.ruffle_renderer_name(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {any}
    */
    prepare_context_menu() {
        const ret = wasm.ruffle_prepare_context_menu(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} index
    */
    run_context_menu_callback(index) {
        wasm.ruffle_run_context_menu_callback(this.__wbg_ptr, index);
    }
    /**
    * @param {boolean} is_fullscreen
    */
    set_fullscreen(is_fullscreen) {
        wasm.ruffle_set_fullscreen(this.__wbg_ptr, is_fullscreen);
    }
    /**
    */
    clear_custom_menu_items() {
        wasm.ruffle_clear_custom_menu_items(this.__wbg_ptr);
    }
    /**
    */
    destroy() {
        wasm.ruffle_destroy(this.__wbg_ptr);
    }
    /**
    * @param {string} name
    * @param {any[]} args
    * @returns {any}
    */
    call_exposed_callback(name, args) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(args, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.ruffle_call_exposed_callback(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
    * @param {any} observer
    */
    set_trace_observer(observer) {
        wasm.ruffle_set_trace_observer(this.__wbg_ptr, observer);
    }
    /**
    * Returns the web AudioContext used by this player.
    * Returns `None` if the audio backend does not use Web Audio.
    * @returns {AudioContext | undefined}
    */
    audio_context() {
        const ret = wasm.ruffle_audio_context(this.__wbg_ptr);
        return ret;
    }
    /**
    * Returns whether the `simd128` target feature was enabled at build time.
    * This is intended to discriminate between the two WebAssembly module
    * versions, one of which uses WebAssembly extensions, and the other one
    * being "vanilla". `simd128` is used as proxy for most extensions, since
    * no other WebAssembly target feature is exposed to `cfg!`.
    * @returns {boolean}
    */
    static is_wasm_simd_used() {
        const ret = wasm.ruffle_is_wasm_simd_used();
        return ret !== 0;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_setMetadata_128bd20648a12d07 = function(arg0, arg1) {
        arg0.setMetadata(arg1);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_getProperty_af1b259e02b39917 = function() { return handleError(function (arg0, arg1) {
        const ret = getProperty(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_onCallbackAvailable_d54d3847055a0720 = function(arg0, arg1, arg2) {
        arg0.onCallbackAvailable(getStringFromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_onFSCommand_68fd9326a1eb7ff5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.onFSCommand(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbg_panic_52092d3d09d11787 = function(arg0, arg1) {
        arg0.panic(arg1);
    };
    imports.wbg.__wbg_displayRootMovieDownloadFailedMessage_ed4ad3ae9522c8a3 = function(arg0) {
        arg0.displayRootMovieDownloadFailedMessage();
    };
    imports.wbg.__wbg_displayMessage_6b8a0011f836541f = function(arg0, arg1, arg2) {
        arg0.displayMessage(getStringFromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_setFullscreen_85ac797b8823b727 = function() { return handleError(function (arg0, arg1) {
        arg0.setFullscreen(arg1 !== 0);
    }, arguments) };
    imports.wbg.__wbg_openVirtualKeyboard_e0659b8d0c7b81ed = function(arg0) {
        arg0.openVirtualKeyboard();
    };
    imports.wbg.__wbg_isVirtualKeyboardFocused_1719ab4ec034b0ab = function(arg0) {
        const ret = arg0.isVirtualKeyboardFocused();
        return ret;
    };
    imports.wbg.__wbg_displayUnsupportedVideo_619cdc62d232655a = function(arg0, arg1, arg2) {
        arg0.displayUnsupportedVideo(getStringFromWasm0(arg1, arg2));
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_ruffle_new = function(arg0) {
        const ret = Ruffle.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_copyToAudioBufferInterleaved_efb71b16faf5adb2 = function(arg0, arg1, arg2) {
        copyToAudioBufferInterleaved(arg0, getArrayF32FromWasm0(arg1, arg2));
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbg_String_4370c5505c674d30 = function(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getwithrefkey_d1f0d12f1f1b63ea = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_set_bd72c078edfa51ad = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_log_c9486ca5d8e2cbe8 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_log_aba5996d9bde071f = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_mark_40e050a77cc39fea = function(arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_measure_aa7a73f17813f708 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        let deferred0_0;
        let deferred0_1;
        let deferred1_0;
        let deferred1_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            deferred1_0 = arg2;
            deferred1_1 = arg3;
            performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_crypto_c48a774b022d20ac = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_process_298734cf255a885d = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_versions_e2e78e134e3e5d01 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_node_1cd7a5d853dbea79 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_msCrypto_bcb970640f50a1e8 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_require_8f08ceecec0f4fee = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_37fa2ca9e4e07fab = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_dc1e9a60c158336d = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_instanceof_WebGl2RenderingContext_f921526c513bf717 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGL2RenderingContext;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_beginQuery_d338463adf721553 = function(arg0, arg1, arg2) {
        arg0.beginQuery(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindBufferRange_d8a5ebc8ea8be507 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.bindBufferRange(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_bindSampler_d74e398b68cf5980 = function(arg0, arg1, arg2) {
        arg0.bindSampler(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindVertexArray_8863a216d7b0a339 = function(arg0, arg1) {
        arg0.bindVertexArray(arg1);
    };
    imports.wbg.__wbg_blitFramebuffer_e6642748dd06d47e = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
    };
    imports.wbg.__wbg_bufferData_496bbb31639d9850 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_21334671c4ba6004 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferSubData_c472b93c9e272eac = function(arg0, arg1, arg2, arg3) {
        arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_clearBufferfi_25bcd35b825f629d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferfi(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearBufferfv_9de0cb45cc5a012b = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_clearBufferiv_fc2f8bce2930c586 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_clearBufferuiv_2f6d220a31eabca4 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_clientWaitSync_6a74725ec890efdd = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.clientWaitSync(arg1, arg2 >>> 0, arg3 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_compressedTexSubImage2D_945ba54869f3a612 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
    };
    imports.wbg.__wbg_compressedTexSubImage2D_ed56fa2f82a839b1 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
    };
    imports.wbg.__wbg_compressedTexSubImage3D_4cebeae1440fdc14 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
    };
    imports.wbg.__wbg_compressedTexSubImage3D_0ae61aaa91089745 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10);
    };
    imports.wbg.__wbg_copyBufferSubData_d112912c90270156 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_copyTexSubImage3D_9fa5e9e7b16cf09d = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    };
    imports.wbg.__wbg_createQuery_2ef2dc0f01a4a8e3 = function(arg0) {
        const ret = arg0.createQuery();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createSampler_039ecd204675292b = function(arg0) {
        const ret = arg0.createSampler();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArray_51d51e1e1e13e9f6 = function(arg0) {
        const ret = arg0.createVertexArray();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_deleteQuery_0c64c5200cdc57a6 = function(arg0, arg1) {
        arg0.deleteQuery(arg1);
    };
    imports.wbg.__wbg_deleteSampler_ce5b8e120f96fc1a = function(arg0, arg1) {
        arg0.deleteSampler(arg1);
    };
    imports.wbg.__wbg_deleteSync_1b05dfcc176e7466 = function(arg0, arg1) {
        arg0.deleteSync(arg1);
    };
    imports.wbg.__wbg_deleteVertexArray_3e4f2e2ff7f05a19 = function(arg0, arg1) {
        arg0.deleteVertexArray(arg1);
    };
    imports.wbg.__wbg_drawArraysInstanced_8fb13fe9faf95212 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_drawBuffers_15d26e17a8d24ee0 = function(arg0, arg1) {
        arg0.drawBuffers(arg1);
    };
    imports.wbg.__wbg_drawElementsInstanced_dcf53461a977d44c = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_endQuery_faf7eb231d6f2a66 = function(arg0, arg1) {
        arg0.endQuery(arg1 >>> 0);
    };
    imports.wbg.__wbg_fenceSync_d68dcbdcdd134d92 = function(arg0, arg1, arg2) {
        const ret = arg0.fenceSync(arg1 >>> 0, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_framebufferTextureLayer_a92788e5f0409234 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_getBufferSubData_8710cc73621fc332 = function(arg0, arg1, arg2, arg3) {
        arg0.getBufferSubData(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_getIndexedParameter_4f004dc25c3d15a9 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getQueryParameter_64c18ef385414bf1 = function(arg0, arg1, arg2) {
        const ret = arg0.getQueryParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getSyncParameter_d93ec7f6bb11274c = function(arg0, arg1, arg2) {
        const ret = arg0.getSyncParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getUniformBlockIndex_99c15053c9a87c73 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_invalidateFramebuffer_03bd99588b15d627 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.invalidateFramebuffer(arg1 >>> 0, arg2);
    }, arguments) };
    imports.wbg.__wbg_readBuffer_c426fe18344296ff = function(arg0, arg1) {
        arg0.readBuffer(arg1 >>> 0);
    };
    imports.wbg.__wbg_readPixels_99fda83f6ca7ec72 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readPixels_9634f0dcfb54667c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_renderbufferStorageMultisample_9260e2e620c949e5 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_samplerParameterf_1c7562ef061b803b = function(arg0, arg1, arg2, arg3) {
        arg0.samplerParameterf(arg1, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_samplerParameteri_0fee083bc48e70ee = function(arg0, arg1, arg2, arg3) {
        arg0.samplerParameteri(arg1, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_texImage2D_699c5d8e0d9ea28a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
    }, arguments) };
    imports.wbg.__wbg_texStorage2D_6665d01025a7e7fc = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_texStorage3D_c01c31c1b02d75fd = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_texSubImage2D_d2841ded12a8aa66 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_bccf4e250f1ce1b8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_780a7c889dc20a98 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_b5bb36f2f54b4264 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_a297114050ea1098 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_43f39a73ed02fae3 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_ffdccca1422b482a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_69d5e09d45e0251c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_ae3ed5d0154c346c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_80693fc2c7855e4d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_uniform2fv_2b473f6dce24c898 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform2iv_fdaa3cd258d3451e = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3fv_3e55033ca16ec6ab = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3iv_3d3ed90c76e6777e = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4fv_26ec0c9d7bf6d7c6 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4iv_2be6b77c47b90d81 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniformBlockBinding_0dc4bd81bb4ccb6a = function(arg0, arg1, arg2, arg3) {
        arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_uniformMatrix2fv_1ab7aeb8562ea3dd = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix3fv_0b151be4d76ee66b = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix4fv_766b5ba343983038 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_vertexAttribDivisor_197e2e23e3fbde7f = function(arg0, arg1, arg2) {
        arg0.vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_vertexAttribIPointer_6f8540e358f8a547 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_activeTexture_799bf1387e911c27 = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_attachShader_47256b6b3d42a22e = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBuffer_24f6010e273fa400 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindFramebuffer_a9573e340dab20fe = function(arg0, arg1, arg2) {
        arg0.bindFramebuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindRenderbuffer_54c404711f9b6958 = function(arg0, arg1, arg2) {
        arg0.bindRenderbuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_92d6d7f8bff9531e = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_blendColor_7974f09cb60d2be0 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_blendEquation_12146cb96dc1bcd9 = function(arg0, arg1) {
        arg0.blendEquation(arg1 >>> 0);
    };
    imports.wbg.__wbg_blendEquationSeparate_205526dad772d160 = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFunc_533de6de45b80a09 = function(arg0, arg1, arg2) {
        arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_fbf93dee3e5ce456 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_colorMask_fba1e2efd891e2ac = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_6bf78b425d5c98e1 = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_copyTexSubImage2D_26685100d5f2b4c0 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
    };
    imports.wbg.__wbg_createBuffer_323425af422748ac = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createFramebuffer_1684a99697ac9563 = function(arg0) {
        const ret = arg0.createFramebuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_4eaf3b97b5747a62 = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createRenderbuffer_3e6dd356d7897ed7 = function(arg0) {
        const ret = arg0.createRenderbuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_429776c9dd6fb87b = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_1bf4d6fec570124b = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_cullFace_6daa9f2aa42b4620 = function(arg0, arg1) {
        arg0.cullFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_deleteBuffer_2c09d03fa4b0bd08 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteFramebuffer_edd16bb8df6a8e0d = function(arg0, arg1) {
        arg0.deleteFramebuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_53a32852f245b839 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteRenderbuffer_134040051fcc1ba5 = function(arg0, arg1) {
        arg0.deleteRenderbuffer(arg1);
    };
    imports.wbg.__wbg_deleteShader_7c1222349324b5e2 = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_4fcfea73cd8f6214 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_depthFunc_fb41ad353d07948d = function(arg0, arg1) {
        arg0.depthFunc(arg1 >>> 0);
    };
    imports.wbg.__wbg_depthMask_6a4ff02cd2a2702e = function(arg0, arg1) {
        arg0.depthMask(arg1 !== 0);
    };
    imports.wbg.__wbg_depthRange_a5647a9040aec55b = function(arg0, arg1, arg2) {
        arg0.depthRange(arg1, arg2);
    };
    imports.wbg.__wbg_disable_e02106ca6c7002d6 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_6d57776c8f642f44 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawArrays_c91ce3f736bf1f2a = function(arg0, arg1, arg2, arg3) {
        arg0.drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_enable_195891416c520019 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_8804480c2ea0bb72 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_framebufferRenderbuffer_3ec0983918c2b69d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_framebufferTexture2D_e88fcbd7f8523bb8 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_frontFace_786a036f1d643925 = function(arg0, arg1) {
        arg0.frontFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_getActiveUniform_78367ddc7339640b = function(arg0, arg1, arg2) {
        const ret = arg0.getActiveUniform(arg1, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getError_7191ad6ea53607fe = function(arg0) {
        const ret = arg0.getError();
        return ret;
    };
    imports.wbg.__wbg_getExtension_77909f6d51d49d4d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getParameter_55b36a787dbbfb74 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_b81bc53188e286fa = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getProgramParameter_35522a0bfdfaad27 = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderInfoLog_968b93e75477d725 = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getShaderParameter_ac2727ae4fe7648e = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getSupportedExtensions_fafc31aab913037d = function(arg0) {
        const ret = arg0.getSupportedExtensions();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getUniformLocation_9f6eb60c560a347b = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_linkProgram_33998194075d71fb = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_pixelStorei_f3a24990aa352fc7 = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_polygonOffset_faca8e73770272ff = function(arg0, arg1, arg2) {
        arg0.polygonOffset(arg1, arg2);
    };
    imports.wbg.__wbg_renderbufferStorage_987d1af7c9faf5dd = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
    };
    imports.wbg.__wbg_scissor_e8e41e1c0a9817c8 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_shaderSource_1cb7c64dc7d1a500 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_stencilFuncSeparate_8ff94e24a50a3c45 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
    };
    imports.wbg.__wbg_stencilMask_641f92999dd3c3de = function(arg0, arg1) {
        arg0.stencilMask(arg1 >>> 0);
    };
    imports.wbg.__wbg_stencilMaskSeparate_6b2c8ef22fb3b6d1 = function(arg0, arg1, arg2) {
        arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_stencilOpSeparate_38925591af8feb44 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_texParameteri_85dad939f62a15aa = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_uniform1f_88379f4e2630bc66 = function(arg0, arg1, arg2) {
        arg0.uniform1f(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_d2e61a6a43889648 = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform4f_a9fd337d4b07f595 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_useProgram_3683cf6f60939dcd = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_vertexAttribPointer_316ffe2f0458fde7 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_fad1ce9e18f741c0 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_instanceof_Window_9029196b662bc42a = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_document_f7ace2b956f30a4f = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_location_56243dba507f472d = function(arg0) {
        const ret = arg0.location;
        return ret;
    };
    imports.wbg.__wbg_navigator_7c9103698acde322 = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_devicePixelRatio_f9de7bddca0eaf20 = function(arg0) {
        const ret = arg0.devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_localStorage_dbac11bd189e9fa0 = function() { return handleError(function (arg0) {
        const ret = arg0.localStorage;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_confirm_d7ddd98cd3a22cf2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.confirm(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_focus_3936c6eb13bd58df = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_open_7a2a86bf6285507d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_cancelAnimationFrame_9b68e9588c6543bc = function() { return handleError(function (arg0, arg1) {
        arg0.cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_d082200514b6674d = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_336b6f0cb426b46e = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_body_674aec4c1c0910cd = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createElement_4891554b28d3388b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElementNS_119acf9e82482041 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_querySelector_52ded52c20e23921 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_setid_1984ee27e5075311 = function(arg0, arg1, arg2) {
        arg0.id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_clientWidth_51ec21e3189f5656 = function(arg0) {
        const ret = arg0.clientWidth;
        return ret;
    };
    imports.wbg.__wbg_clientHeight_09ec0b524d59c367 = function(arg0) {
        const ret = arg0.clientHeight;
        return ret;
    };
    imports.wbg.__wbg_querySelector_aff7124330d731be = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_releasePointerCapture_c36c2b5804654f8b = function() { return handleError(function (arg0, arg1) {
        arg0.releasePointerCapture(arg1);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_e7e80b478b7b8b2f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setAttributeNS_64c72a189bd9594f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setAttributeNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), getStringFromWasm0(arg5, arg6));
    }, arguments) };
    imports.wbg.__wbg_setPointerCapture_e7c29336490bba19 = function() { return handleError(function (arg0, arg1) {
        arg0.setPointerCapture(arg1);
    }, arguments) };
    imports.wbg.__wbg_remove_48288e91662163dc = function(arg0) {
        arg0.remove();
    };
    imports.wbg.__wbg_length_a1cd52a4ac95d41e = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_setbuffer_beeece042e02534f = function(arg0, arg1) {
        arg0.buffer = arg1;
    };
    imports.wbg.__wbg_setonended_83dd83b7f84cdef2 = function(arg0, arg1) {
        arg0.onended = arg1;
    };
    imports.wbg.__wbg_start_99ecc2647eb67ca6 = function() { return handleError(function (arg0, arg1) {
        arg0.start(arg1);
    }, arguments) };
    imports.wbg.__wbg_connect_3f8f5ba805800c62 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.connect(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setProperty_b95ef63ab852879e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_582686fb2263dd3c = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_48e8701355d8e2d4 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_43193b7cc99f8914 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_key_8aeaa079126a9cc7 = function(arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_code_96d6322b968b2d17 = function(arg0, arg1) {
        const ret = arg1.code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_language_4f943dbdc59c3951 = function(arg0, arg1) {
        const ret = arg1.language;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_baseURI_ca0d285a4207cf6a = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.baseURI;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_parentElement_c75962bc9997ea5f = function(arg0) {
        const ret = arg0.parentElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_appendChild_51339d4cde00ee22 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_removeChild_973429f368206138 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.removeChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_framebufferTextureMultiviewOVR_4d911c3fccedc517 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.framebufferTextureMultiviewOVR(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_headers_b439dcff02e808e5 = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_newwithstrandinit_cad5cd6038c7ff5d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getData_8aeca5994420c599 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_videoWidth_02eadb74917aa4fc = function(arg0) {
        const ret = arg0.videoWidth;
        return ret;
    };
    imports.wbg.__wbg_videoHeight_dac4c345988e5562 = function(arg0) {
        const ret = arg0.videoHeight;
        return ret;
    };
    imports.wbg.__wbg_new_68d926df4499a81a = function() { return handleError(function () {
        const ret = new Path2D();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_addPath_3cc27612c7072ced = function(arg0, arg1, arg2) {
        arg0.addPath(arg1, arg2);
    };
    imports.wbg.__wbg_bezierCurveTo_6579a7b8038a0ab2 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.bezierCurveTo(arg1, arg2, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_closePath_f3ce4126143e1d2f = function(arg0) {
        arg0.closePath();
    };
    imports.wbg.__wbg_lineTo_6dae7afdea80cb55 = function(arg0, arg1, arg2) {
        arg0.lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_moveTo_f28fe5c750fc6dcd = function(arg0, arg1, arg2) {
        arg0.moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_quadraticCurveTo_becb27dbf030fff7 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.quadraticCurveTo(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_rect_5c1dc88471690403 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.rect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_drawArraysInstancedANGLE_01b862ba133350a3 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_drawElementsInstancedANGLE_ea6343af8bf9c9f8 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_vertexAttribDivisorANGLE_a8476eb778e16c70 = function(arg0, arg1, arg2) {
        arg0.vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_clipboardData_c480a3b34e3e7b1d = function(arg0) {
        const ret = arg0.clipboardData;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_addEventListener_5651108fc3ffeb6e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_a5963e26cd7b176b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_2cee5876a20f9a8c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_5de660c02ed784e4 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_782040b4432709cb = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlFormElement_b57527983c7c1ada = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLFormElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setaction_e223447a07aa1887 = function(arg0, arg1, arg2) {
        arg0.action = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmethod_16a6c8e4f4b47198 = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settarget_14aec6123b774250 = function(arg0, arg1, arg2) {
        arg0.target = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_submit_fd8bd9b11eead9ed = function() { return handleError(function (arg0) {
        arg0.submit();
    }, arguments) };
    imports.wbg.__wbg_href_d62a28e4fc1ab948 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.href;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_protocol_91948f5885595359 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.protocol;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_assign_6a18f7b04202c9b9 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.assign(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_get_f028630ecf797640 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1[getStringFromWasm0(arg2, arg3)];
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_set_b574fec410521820 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0[getStringFromWasm0(arg1, arg2)] = getStringFromWasm0(arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_delete_23c0d8a2a81a97e8 = function() { return handleError(function (arg0, arg1, arg2) {
        delete arg0[getStringFromWasm0(arg1, arg2)];
    }, arguments) };
    imports.wbg.__wbg_drawBuffersWEBGL_139bf2fe0c1522d6 = function(arg0, arg1) {
        arg0.drawBuffersWEBGL(arg1);
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_bc0a6635c96eca9b = function(arg0) {
        let result;
        try {
            result = arg0 instanceof CanvasRenderingContext2D;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setglobalAlpha_97edbae8133ee6af = function(arg0, arg1) {
        arg0.globalAlpha = arg1;
    };
    imports.wbg.__wbg_setglobalCompositeOperation_84bbd92ad836f613 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.globalCompositeOperation = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_setstrokeStyle_3fe4d1c0d11ed1b6 = function(arg0, arg1) {
        arg0.strokeStyle = arg1;
    };
    imports.wbg.__wbg_setfillStyle_401fa583a1c8863c = function(arg0, arg1) {
        arg0.fillStyle = arg1;
    };
    imports.wbg.__wbg_setfilter_07ed01a555f85fdd = function(arg0, arg1, arg2) {
        arg0.filter = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setimageSmoothingEnabled_703f4d1eabdc4004 = function(arg0, arg1) {
        arg0.imageSmoothingEnabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setlineWidth_6cbd15cb2b4ab14b = function(arg0, arg1) {
        arg0.lineWidth = arg1;
    };
    imports.wbg.__wbg_setlineCap_6ebf29df37947b53 = function(arg0, arg1, arg2) {
        arg0.lineCap = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlineJoin_eccaea89d57fb044 = function(arg0, arg1, arg2) {
        arg0.lineJoin = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmiterLimit_50d0d46f19e3054f = function(arg0, arg1) {
        arg0.miterLimit = arg1;
    };
    imports.wbg.__wbg_drawImage_51831abbe53b6d2a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.drawImage(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_clip_1e4ca4e6321b64bf = function(arg0, arg1, arg2) {
        arg0.clip(arg1, arg2);
    };
    imports.wbg.__wbg_fill_d61aea098fdc5814 = function(arg0, arg1, arg2) {
        arg0.fill(arg1, arg2);
    };
    imports.wbg.__wbg_stroke_c4647eb26598b90b = function(arg0, arg1) {
        arg0.stroke(arg1);
    };
    imports.wbg.__wbg_createLinearGradient_32d24e61e667d0ee = function(arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createLinearGradient(arg1, arg2, arg3, arg4);
        return ret;
    };
    imports.wbg.__wbg_createPattern_b554842f03d7adfe = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createPattern(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_createRadialGradient_b9262e36ae8f3cea = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        const ret = arg0.createRadialGradient(arg1, arg2, arg3, arg4, arg5, arg6);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_putImageData_f157d52a70a206d5 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.putImageData(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_clearRect_517d3360d8be8a55 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_fillRect_e285f7b46668b7fa = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_restore_890c3582852dbadf = function(arg0) {
        arg0.restore();
    };
    imports.wbg.__wbg_save_cdcca9591f027e80 = function(arg0) {
        arg0.save();
    };
    imports.wbg.__wbg_resetTransform_8427c5468207dba3 = function() { return handleError(function (arg0) {
        arg0.resetTransform();
    }, arguments) };
    imports.wbg.__wbg_setTransform_39caea5e97b29f2e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setTransform(arg1, arg2, arg3, arg4, arg5, arg6);
    }, arguments) };
    imports.wbg.__wbg_transform_c9f55f741f6615bf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.transform(arg1, arg2, arg3, arg4, arg5, arg6);
    }, arguments) };
    imports.wbg.__wbg_currentTarget_be4545d7d2e0a77f = function(arg0) {
        const ret = arg0.currentTarget;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_preventDefault_24104f3f0a54546a = function(arg0) {
        arg0.preventDefault();
    };
    imports.wbg.__wbg_newwithbuffersourcesequenceandoptions_59d261a36a6bcb4b = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setTransform_a645f7c1bcce1364 = function(arg0, arg1) {
        arg0.setTransform(arg1);
    };
    imports.wbg.__wbg_set_b34caba58723c454 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_348d0e222e16eec4 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLTextAreaElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setvalue_0dc100d4b9908028 = function(arg0, arg1, arg2) {
        arg0.value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_select_6be40fad5b8e1680 = function(arg0) {
        arg0.select();
    };
    imports.wbg.__wbg_width_c97f89a38a3c1da7 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_height_c8424a3757db7869 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_newwithsw_102f92aa6317fd45 = function() { return handleError(function (arg0, arg1) {
        const ret = new ImageData(arg0 >>> 0, arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithu8clampedarray_fb90064f569c16ec = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_a_a582c5862d7b76b9 = function(arg0) {
        const ret = arg0.a;
        return ret;
    };
    imports.wbg.__wbg_seta_7d2bfcca92d2ffa9 = function(arg0, arg1) {
        arg0.a = arg1;
    };
    imports.wbg.__wbg_b_3074f954105a7c92 = function(arg0) {
        const ret = arg0.b;
        return ret;
    };
    imports.wbg.__wbg_c_71713b23124c2037 = function(arg0) {
        const ret = arg0.c;
        return ret;
    };
    imports.wbg.__wbg_d_ddd916af3f35b902 = function(arg0) {
        const ret = arg0.d;
        return ret;
    };
    imports.wbg.__wbg_setd_658afd0040997055 = function(arg0, arg1) {
        arg0.d = arg1;
    };
    imports.wbg.__wbg_e_8c02a65e774a03bb = function(arg0) {
        const ret = arg0.e;
        return ret;
    };
    imports.wbg.__wbg_f_a0ec3b923f8249fe = function(arg0) {
        const ret = arg0.f;
        return ret;
    };
    imports.wbg.__wbg_new_eb9a803ff8e4fd2f = function() { return handleError(function () {
        const ret = new DOMMatrix();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwitharray64_9cbe4d780edc6b4a = function() { return handleError(function (arg0, arg1) {
        const ret = new DOMMatrix(getArrayF64FromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlDocument_0485e23863c92f34 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLDocument;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_execCommand_eecccd1fb945375b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.execCommand(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlInputElement_31b50e0cf542c524 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setname_d54ea76b414f305e = function(arg0, arg1, arg2) {
        arg0.name = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settype_ed9a0cf484870612 = function(arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setvalue_1f95e61cbc382f7f = function(arg0, arg1, arg2) {
        arg0.value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_now_0cfdc90c97d0c24b = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_size_6eb4aa794f6bf220 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_type_37bb6b4936b5e027 = function(arg0) {
        const ret = arg0.type;
        return ret;
    };
    imports.wbg.__wbg_name_ebae3a7e89367611 = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getSupportedProfiles_420ce044cc3114a1 = function(arg0) {
        const ret = arg0.getSupportedProfiles();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_style_3801009b2339aa94 = function(arg0) {
        const ret = arg0.style;
        return ret;
    };
    imports.wbg.__wbg_destination_9e793cf556243084 = function(arg0) {
        const ret = arg0.destination;
        return ret;
    };
    imports.wbg.__wbg_sampleRate_951ae4b792d7f810 = function(arg0) {
        const ret = arg0.sampleRate;
        return ret;
    };
    imports.wbg.__wbg_currentTime_c6831b97750b898c = function(arg0) {
        const ret = arg0.currentTime;
        return ret;
    };
    imports.wbg.__wbg_new_1b59056b80579a3b = function() { return handleError(function () {
        const ret = new lAudioContext();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_51aa5539747ce076 = function() { return handleError(function (arg0) {
        const ret = arg0.close();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_suspend_429126c923b22063 = function() { return handleError(function (arg0) {
        const ret = arg0.suspend();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBuffer_13cd030d2b48e8fa = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createBuffer(arg1 >>> 0, arg2 >>> 0, arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBufferSource_58423f6345b5f559 = function() { return handleError(function (arg0) {
        const ret = arg0.createBufferSource();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resume_9dc64ed7c3a65255 = function() { return handleError(function (arg0) {
        const ret = arg0.resume();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_bindVertexArrayOES_b7d9da7e073aa6b5 = function(arg0, arg1) {
        arg0.bindVertexArrayOES(arg1);
    };
    imports.wbg.__wbg_createVertexArrayOES_6a3c3a5a68201f8f = function(arg0) {
        const ret = arg0.createVertexArrayOES();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_deleteVertexArrayOES_7bf4589e63d84df6 = function(arg0, arg1) {
        arg0.deleteVertexArrayOES(arg1);
    };
    imports.wbg.__wbg_instanceof_Response_fc4327dbfcdf5ced = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_url_8503de97f69da463 = function(arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_redirected_b14cd3a1d0cc991e = function(arg0) {
        const ret = arg0.redirected;
        return ret;
    };
    imports.wbg.__wbg_status_ac85a3142a84caa2 = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_ok_e3d8d84e630fd064 = function(arg0) {
        const ret = arg0.ok;
        return ret;
    };
    imports.wbg.__wbg_statusText_1dd32f6c94d79ef0 = function(arg0, arg1) {
        const ret = arg1.statusText;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_arrayBuffer_288fb3538806e85c = function() { return handleError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_addColorStop_d2d6fed08fdaa4ca = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addColorStop(arg1, getStringFromWasm0(arg2, arg3));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_da5f9efa0688cf6d = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLCanvasElement;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_width_2931aaedd21f1fff = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_a667a942dba6656e = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_0d36fbbeb60b0661 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_setheight_a747d440760fe5aa = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_7c5944ea807bf5d3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_6d1f155bb5c1096a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_offsetX_5a58f16f6c3a41b6 = function(arg0) {
        const ret = arg0.offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_c45b4956f6429a95 = function(arg0) {
        const ret = arg0.offsetY;
        return ret;
    };
    imports.wbg.__wbg_button_7a095234b69de930 = function(arg0) {
        const ret = arg0.button;
        return ret;
    };
    imports.wbg.__wbg_width_0b4991f5cf7c640a = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_15266a5e81f43cf0 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_8cce73e95fb10fd3 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_setheight_2e9bab573f1775a6 = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_inverse_c9ee46c728da912b = function(arg0) {
        const ret = arg0.inverse();
        return ret;
    };
    imports.wbg.__wbg_width_019b79813c2e80cf = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_height_12082005add04bb5 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_pointerId_701aab7b4fb073ff = function(arg0) {
        const ret = arg0.pointerId;
        return ret;
    };
    imports.wbg.__wbg_deltaY_64823169afb0335d = function(arg0) {
        const ret = arg0.deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaMode_1c680147cfdba8a5 = function(arg0) {
        const ret = arg0.deltaMode;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WebGlRenderingContext_ea632546035eecb1 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGLRenderingContext;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_drawingBufferWidth_1a2697e5a3638f03 = function(arg0) {
        const ret = arg0.drawingBufferWidth;
        return ret;
    };
    imports.wbg.__wbg_drawingBufferHeight_e5d38c5b1cd5bcc5 = function(arg0) {
        const ret = arg0.drawingBufferHeight;
        return ret;
    };
    imports.wbg.__wbg_bufferData_92a3e0b745b0d726 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_a11a9f65f31e7256 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_ee8e1f8b52130c76 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.bufferData(arg1 >>> 0, getArrayU8FromWasm0(arg2, arg3), arg4 >>> 0);
    };
    imports.wbg.__wbg_bufferSubData_fca6f1c10273be21 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_compressedTexSubImage2D_21078c6de0a71aad = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
    };
    imports.wbg.__wbg_readPixels_91b0d8854de90477 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_texImage2D_ba9ab23dac10b236 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_f1a31f8045b7f831 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_uniform1fv_f9edc98edf0e66b8 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform1fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform2fv_c928f6ba0085b381 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform2iv_7e5f8e7c2f4d4d6a = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3fv_1aba437b913c1926 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3iv_23751fe4dfcdf539 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4fv_7c51c2251d851cb2 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4iv_27b49984e9c5d90a = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniformMatrix2fv_f8f3ef807f196bf1 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix3fv_341eec37953e50c5 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix4fv_465ab8de531f4f78 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_activeTexture_93b4de60af07da9c = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_attachShader_b65b695055670cb5 = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBuffer_313561e5bc0e533f = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindFramebuffer_56bf6536a4ced0ec = function(arg0, arg1, arg2) {
        arg0.bindFramebuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindRenderbuffer_559c7c6b6676dddd = function(arg0, arg1, arg2) {
        arg0.bindRenderbuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_9cb5c770d1ba2cca = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_blendColor_b9006ef6c450acd0 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_blendEquation_f31ce08020786a09 = function(arg0, arg1) {
        arg0.blendEquation(arg1 >>> 0);
    };
    imports.wbg.__wbg_blendEquationSeparate_7ec5e34f066e44f8 = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFunc_fbe9d3a688fe71c3 = function(arg0, arg1, arg2) {
        arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_7547ade0a7dfade2 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_clear_2ccea1f65b510c97 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clearColor_de587608b28bc7ed = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_colorMask_7cbd7a102954ede9 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_d88d0a8cd9b72b4d = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_copyTexSubImage2D_3029f8dfe7543ab6 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
    };
    imports.wbg.__wbg_createBuffer_59051f4461e7c5e2 = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createFramebuffer_223c1212ad76affc = function(arg0) {
        const ret = arg0.createFramebuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_88dbe21c0b682e1a = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createRenderbuffer_bcb61b756ba21490 = function(arg0) {
        const ret = arg0.createRenderbuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_9d7d388633caad18 = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_9d0bb4d741b8ad76 = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_cullFace_4c086dc1d86a19b5 = function(arg0, arg1) {
        arg0.cullFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_deleteBuffer_cdc6b9c73f54aff7 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteFramebuffer_fcc10cb143c6573d = function(arg0, arg1) {
        arg0.deleteFramebuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_d8d7fc79ba83b256 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteRenderbuffer_edf9e1b4e0a1e005 = function(arg0, arg1) {
        arg0.deleteRenderbuffer(arg1);
    };
    imports.wbg.__wbg_deleteShader_9a2f85efe5cb3706 = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_a883356c5034d482 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_depthFunc_4eda7b4e682acbad = function(arg0, arg1) {
        arg0.depthFunc(arg1 >>> 0);
    };
    imports.wbg.__wbg_depthMask_a3071e13bb087102 = function(arg0, arg1) {
        arg0.depthMask(arg1 !== 0);
    };
    imports.wbg.__wbg_depthRange_ff5298a73fd02650 = function(arg0, arg1, arg2) {
        arg0.depthRange(arg1, arg2);
    };
    imports.wbg.__wbg_disable_5cf2070641fa2ed7 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_8dacd44e21adcaa2 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawArrays_d5c7dc2b2376c85a = function(arg0, arg1, arg2, arg3) {
        arg0.drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_drawElements_3316ee0cd1117c2a = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_enable_8965e69c596f0a94 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_2b0475db43533cf2 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_framebufferRenderbuffer_d80f5381d429bc45 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_framebufferTexture2D_953e69a8bec22fa9 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_frontFace_0ba67b9e6365557c = function(arg0, arg1) {
        arg0.frontFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_getActiveUniform_87df972e841afed2 = function(arg0, arg1, arg2) {
        const ret = arg0.getActiveUniform(arg1, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getAttribLocation_a5a98d5272b01c0d = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getExtension_088d115a16ecbd7d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getParameter_bfab7f0b00c9d7fb = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_0b7af4ad85fa52a4 = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getProgramParameter_2a3735278367f8bc = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderInfoLog_979aafa403ffb252 = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getShaderParameter_e8054f1d9026fb70 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getUniformLocation_688976233799a45a = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_linkProgram_9a2d12d120d99917 = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_pixelStorei_5ec932ebefd00149 = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_polygonOffset_55eea57bba1b49e9 = function(arg0, arg1, arg2) {
        arg0.polygonOffset(arg1, arg2);
    };
    imports.wbg.__wbg_renderbufferStorage_4bcd9ddf1749ce26 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
    };
    imports.wbg.__wbg_scissor_c8ec3b1e053f3756 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_shaderSource_f435f9b74440bb54 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_stencilFunc_11e7ac2d45aa66c7 = function(arg0, arg1, arg2, arg3) {
        arg0.stencilFunc(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_stencilFuncSeparate_0fae0ee7c04a23b2 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
    };
    imports.wbg.__wbg_stencilMask_79416c29ac1ce3a4 = function(arg0, arg1) {
        arg0.stencilMask(arg1 >>> 0);
    };
    imports.wbg.__wbg_stencilMaskSeparate_19bdb57664d2c34f = function(arg0, arg1, arg2) {
        arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_stencilOp_398dc625213ddfed = function(arg0, arg1, arg2, arg3) {
        arg0.stencilOp(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_stencilOpSeparate_18e0bd316555925f = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_texParameteri_1f17358e51eb8069 = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_uniform1f_7586c5e17ad254c9 = function(arg0, arg1, arg2) {
        arg0.uniform1f(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_9f94ef0ba6b3cc66 = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform4f_9aa5afa9177c6ab1 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_useProgram_019eb6df066fabf5 = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_vertexAttribPointer_ca11984ee8843c0a = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_6ebef187c89e2616 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_get_44be0491f933a435 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_length_fff51ee6522a1a18 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_new_898a68150f225f2e = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_newnoargs_581967eacc0e2604 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_next_526fc47e980da008 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_ddb3312ca1c4e32a = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_5c1f01fb660d73b5 = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_value_1695675138684bd5 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_iterator_97f0c81209c6c35a = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_get_97b561fb56f034b5 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_cb65541d95d71282 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_b51585de1b234aff = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_self_1ff1d729e9aae938 = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_window_5f4faef6c12b79ec = function() { return handleError(function () {
        const ret = window.window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_globalThis_1d39714405582d3c = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_global_651f05c6a0944d1c = function() { return handleError(function () {
        const ret = global.global;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_502d29070ea18557 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_includes_e846113095d52470 = function(arg0, arg1, arg2) {
        const ret = arg0.includes(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_isArray_4c24b343cb13cfb1 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_of_053899a68de3ef48 = function(arg0) {
        const ret = Array.of(arg0);
        return ret;
    };
    imports.wbg.__wbg_of_195c986fbfdd6637 = function(arg0, arg1) {
        const ret = Array.of(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_push_ca1c26067ef907ac = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_39ac22089b74fddb = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_values_e80af618f92c8649 = function(arg0) {
        const ret = arg0.values();
        return ret;
    };
    imports.wbg.__wbg_new_d258248ed531ff54 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_apply_64be369596a02ae0 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.apply(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_01734de55d61e11d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_bb8e18dd21c97288 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_getTime_5e2054f832d82ec9 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_getTimezoneOffset_8aee3445f323973e = function(arg0) {
        const ret = arg0.getTimezoneOffset();
        return ret;
    };
    imports.wbg.__wbg_new_cd59bfc8881f487b = function(arg0) {
        const ret = new Date(arg0);
        return ret;
    };
    imports.wbg.__wbg_new0_c0be7df4b6bd481f = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_3daa8298c86298be = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_entries_e51f29c7bba0c054 = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_fromEntries_46475be008d7104f = function() { return handleError(function (arg0) {
        const ret = Object.fromEntries(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_is_205d914af04a8faa = function(arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_43f1b47c28813cbd = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_1015(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_53698b95aaf7fcf8 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_then_f7e06ee3c11698eb = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_b2267541e2a73865 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_buffer_085ec1f694018c4f = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_828b952f0e692245 = function(arg0, arg1, arg2) {
        const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_735ed5ea2ae07fe9 = function(arg0, arg1, arg2) {
        const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_9f43b22ab631d1d6 = function(arg0, arg1, arg2) {
        const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_6da8e527659b86aa = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_new_8125e318e6245eed = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_5cf90238115182c3 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_length_72e2208bbc0efc61 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_31ff1024ef0c63c7 = function(arg0, arg1, arg2) {
        const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_6df0e8c3efd2a5d3 = function(arg0, arg1, arg2) {
        const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_69193e31c844b792 = function(arg0, arg1, arg2) {
        const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_d8d9cb2b8e8ac1d4 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_e5d69174d6984cd7 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_buffer_f5b7059c439f330d = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_subarray_13db269f57aa838d = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_has_c5fcd020291e56b8 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ownKeys_391189872004f097 = function() { return handleError(function (arg0) {
        const ret = Reflect.ownKeys(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_092e06b0f9d71865 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1270 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_52);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1271 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_52);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1272 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_57);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1274 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_60);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1275 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_52);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1276 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_52);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1277 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_52);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper10513 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 4295, __wbg_adapter_69);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat32Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;
    cachedUint8ClampedMemory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('ruffle_web-wasm_extensions_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
