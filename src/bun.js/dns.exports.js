// IPv4 Segment
const v4Seg = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
const v4Str = `(${v4Seg}[.]){3}${v4Seg}`;
const IPv4Reg = new RegExp(`^${v4Str}$`);

// IPv6 Segment
const v6Seg = "(?:[0-9a-fA-F]{1,4})";
const IPv6Reg = new RegExp(
  "^(" +
    `(?:${v6Seg}:){7}(?:${v6Seg}|:)|` +
    `(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|` +
    `(?:${v6Seg}:){5}(?::${v4Str}|(:${v6Seg}){1,2}|:)|` +
    `(?:${v6Seg}:){4}(?:(:${v6Seg}){0,1}:${v4Str}|(:${v6Seg}){1,3}|:)|` +
    `(?:${v6Seg}:){3}(?:(:${v6Seg}){0,2}:${v4Str}|(:${v6Seg}){1,4}|:)|` +
    `(?:${v6Seg}:){2}(?:(:${v6Seg}){0,3}:${v4Str}|(:${v6Seg}){1,5}|:)|` +
    `(?:${v6Seg}:){1}(?:(:${v6Seg}){0,4}:${v4Str}|(:${v6Seg}){1,6}|:)|` +
    `(?::((?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:))` +
    ")(%[0-9a-zA-Z-.:]{1,})?$",
);

function isIPv4(s) {
  // TODO(aduh95): Replace RegExpPrototypeTest with RegExpPrototypeExec when it
  // no longer creates a perf regression in the dns benchmark.
  // eslint-disable-next-line node-core/avoid-prototype-pollution
  return new RegExp(IPv4Reg).test(s);
}

function isIPv6(s) {
  // TODO(aduh95): Replace RegExpPrototypeTest with RegExpPrototypeExec when it
  // no longer creates a perf regression in the dns benchmark.
  // eslint-disable-next-line node-core/avoid-prototype-pollution
  return new RegExp(IPv6Reg).test(s);
}

function isIP(s) {
  if (isIPv4(s)) return 4;
  if (isIPv6(s)) return 6;
  return 0;
}

function validateString(value, name) {
  if (typeof value !== "string")
    throw new TypeError("Expected " + name + " to be a string. Got " + value);
}

const validateFunction = (value, name) => {
  if (typeof value !== "function")
    throw new TypeError("Expected " + name + " to be a funciton. Got " + value);
};

const validateOneOf = (value, name, oneOf) => {
  if (!oneOf.includes(value)) {
    const allowed = oneOf
      .map((v) => (typeof v === "string" ? `'${v}'` : String(v)))
      .join(", ");
    const reason = "must be one of: " + allowed;
    throw new TypeError(
      "Expected " + name + " to be one of " + allowed + " Instead got " + value,
    );
  }
};

function validateBoolean(value, name) {
  if (typeof value !== "boolean")
    throw new TypeError("Expected " + name + " to be a boolean. Got " + value);
}

function validateNumber(value, name, min = undefined, max) {
  if (typeof value !== "number")
    throw new TypeError("Expected " + name + " to be a number. Got " + value);

  if (
    (min != null && value < min) ||
    (max != null && value > max) ||
    ((min != null || max != null) && Number.isNaN(value))
  ) {
    throw new TypeError(
      "Expected " +
        name +
        " to be between " +
        `${min != null ? `>= ${min}` : ""}${
          min != null && max != null ? " && " : ""
        }${max != null ? `<= ${max}` : ""}` +
        " but instead got " +
        value,
    );
  }
}

const dns = Bun.dns;
const fs = Bun.fs;
export const lookup = () => {
  console.log(
    dns().getaddrinfo(
      "test",
      { test: "testobj" },
      "test3",
      "test4",
      "test5",
      "test6",
    ),
  );
  console.log(fs());
};

// const validFamilies = [0, 4, 6];
// export function lookup(hostname, options, callback) {
//   let hints = 0;
//   let family = 0;
//   let all = false;
//   let verbatim = false;

//   // Parse arguments
//   if (hostname) {
//     validateString(hostname, "hostname");
//   }

//   if (typeof options === "function") {
//     callback = options;
//     family = 0;
//   } else if (typeof options === "number") {
//     validateFunction(callback, "callback");

//     validateOneOf(options, "family", validFamilies);
//     family = options;
//   } else if (options !== undefined && typeof options !== "object") {
//     validateFunction(arguments.length === 2 ? options : callback, "callback");
//     throw new TypeError(
//       "Expected options to be of type integer or object but instead got " +
//         options,
//     );
//   } else {
//     validateFunction(callback, "callback");

//     if (options?.hints != null) {
//       validateNumber(options.hints, "options.hints");
//       hints = options.hints >>> 0;
//       // TODO: need to validate these hints at some point
//       // to make sure they are actually valid for the
//       // getaddrinfo
//     }
//     if (options?.family != null) {
//       switch (options.family) {
//         case "IPv4":
//           family = 4;
//           break;
//         case "IPv6":
//           family = 6;
//           break;
//         default:
//           validateOneOf(options.family, "options.family", validFamilies);
//           family = options.family;
//           break;
//       }
//     }
//     if (options?.all != null) {
//       validateBoolean(options.all, "options.all");
//       all = options.all;
//     }
//     if (options?.verbatim != null) {
//       validateBoolean(options.verbatim, "options.verbatim");
//       verbatim = options.verbatim;
//     }
//   }

//   if (!hostname) {
//     if (all) {
//       process.nextTick(callback, null, []);
//     } else {
//       process.nextTick(callback, null, null, family === 6 ? 6 : 4);
//     }
//     return {};
//   }

//   const matchedFamily = isIP(hostname);
//   if (matchedFamily) {
//     if (all) {
//       process.nextTick(callback, null, [
//         { address: hostname, family: matchedFamily },
//       ]);
//     } else {
//       process.nextTick(callback, null, hostname, matchedFamily);
//     }
//     return {};
//   }

//   // This needs to be  rewritten
//   const req = new GetAddrInfoReqWrap();
//   req.callback = callback;
//   req.family = family;
//   req.hostname = hostname;
//   req.oncomplete = all ? onlookupall : onlookup;

//   const err = cares.getaddrinfo(
//     req,
//     toASCII(hostname),
//     family,
//     hints,
//     verbatim,
//   );
//   if (err) {
//     process.nextTick(callback, new Error(err + "getaddrinfo" + hostname));
//     return {};
//   }
//   return req;
//   //
// }
