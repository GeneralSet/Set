let imports = {};
imports['./set'] = require('./set');

            const join = require('path').join;
            const bytes = require('fs').readFileSync(join(__dirname, 'set_bg.wasm'));
            const wasmModule = new WebAssembly.Module(bytes);
            const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
            module.exports = wasmInstance.exports;
        