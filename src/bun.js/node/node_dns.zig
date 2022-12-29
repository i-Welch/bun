const std = @import("std");
const builtin = @import("builtin");
const bun = @import("bun");
const C = bun.C;
const string = bun.string;
const strings = bun.strings;
const JSC = @import("bun").JSC;
const Environment = bun.Environment;
const Global = bun.Global;
const is_bindgen: bool = std.meta.globalOption("bindgen", bool) orelse false;
const heap_allocator = bun.default_allocator;

pub const Dns = struct {
    pub const name = "Bun__Dns";
    pub const code = @embedFile("../dns.exports.js");

    pub fn create(globalObject: *JSC.JSGlobalObject) callconv(.C) JSC.JSValue {
        const module = JSC.JSValue.createEmptyObject(globalObject, 20);

        module.put(globalObject, JSC.ZigString.static("getaddrinfo"), JSC.NewFunction(globalObject, JSC.ZigString.static("getaddrinfo"), 5, getaddrinfo, true));

        return module;
    }

    pub fn getaddrinfo(globalThis: *JSC.JSGlobalObject, callframe: *JSC.CallFrame) callconv(.C) JSC.JSValue {
        var args_ = callframe.arguments(5);
        const arguments: []const JSC.JSValue = args_.ptr[0..args_.len];
        if (args_.len < 5) {
            const err = JSC.toTypeError(
                JSC.Node.ErrorCode.ERR_INVALID_ARG_TYPE,
                "Please stop",
                .{},
                globalThis,
            );
            globalThis.vm().throwError(globalThis, err);
            return JSC.JSValue.jsUndefined();
        }
        return JSC.JSArray.from(globalThis, arguments);
    }
};
