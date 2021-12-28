// ! run this file separately to get keys which can be used as ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET
import crypto from "crypto";

const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");
console.table({ key1, key2 });
