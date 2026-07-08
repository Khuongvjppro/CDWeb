const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const VNPAY_VERSION = "2.1.0";
const VNPAY_COMMAND = "pay";
const VNPAY_CURRENCY = "VND";
const VNPAY_LOCALE = "vn";
const VNPAY_ORDER_TYPE = "other";

function removeAccents(str) {
  if (typeof str !== "string") return str;
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") {
      sorted[key] = encodeURIComponent(value).replace(/%20/g, "+");
    }
  }

  return sorted;
}

function formatDate(date) {
  const options = {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const partMap = parts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return `${partMap.year}${partMap.month}${partMap.day}${partMap.hour}${partMap.minute}${partMap.second}`;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = "127.0.0.1";

  if (typeof forwarded === "string" && forwarded.length > 0) {
    ip = forwarded.split(",")[0].trim();
  } else if (req.ip) {
    ip = req.ip.replace("::ffff:", "");
  } else if (req.socket?.remoteAddress) {
    ip = req.socket.remoteAddress.replace("::ffff:", "");
  }

  if (ip === "::1" || ip === "localhost") {
    ip = "127.0.0.1";
  }

  return ip;
}

function buildPaymentUrl({
  req,
  orderId,
  amount,
  orderInfo,
  returnUrl,
  ipnUrl,
  bankCode,
}) {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  const vnpUrl =
    process.env.VNPAY_URL ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

  if (!tmnCode || !hashSecret) {
    throw new Error("VNPay configuration is missing");
  }

  const date = new Date();
  const expireDate = new Date(date.getTime() + 15 * 60 * 1000);
  const vnpParams = {
    vnp_Amount: Math.round(Number(amount) * 100),
    vnp_Command: VNPAY_COMMAND,
    vnp_CreateDate: formatDate(date),
    vnp_CurrCode: VNPAY_CURRENCY,
    vnp_IpAddr: getClientIp(req),
    vnp_Locale: VNPAY_LOCALE,
    vnp_OrderInfo: removeAccents(orderInfo || `Thanh toan don hang ${orderId}`),
    vnp_OrderType: VNPAY_ORDER_TYPE,
    vnp_ReturnUrl: returnUrl,
    vnp_TmnCode: tmnCode,
    vnp_TxnRef: String(orderId),
    vnp_Version: VNPAY_VERSION,
    vnp_ExpireDate: formatDate(expireDate),
  };

  if (bankCode) {
    vnpParams.vnp_BankCode = bankCode;
  }

  const sortedParams = sortObject(vnpParams);
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const secureHash = crypto
    .createHmac("sha512", hashSecret)
    .update(Buffer.from(queryString, "utf-8"))
    .digest("hex");

  const logData = `
=================== VNPAY DEBUG ===================
Date: ${new Date().toISOString()}
tmnCode: ${tmnCode}
hashSecret: ${hashSecret}
vnpParams: ${JSON.stringify(vnpParams, null, 2)}
sortedParams: ${JSON.stringify(sortedParams, null, 2)}
queryString: ${queryString}
secureHash: ${secureHash}
====================================================
`;
  try {
    fs.appendFileSync(path.join(__dirname, "../../vnpay-debug.log"), logData);
  } catch (err) {
    console.error("Failed to write vnpay debug log:", err);
  }

  return `${vnpUrl}?${queryString}&vnp_SecureHash=${secureHash}`;
}

function verifySignature(query, hashSecret) {
  const rawQuery = { ...query };
  const secureHash = rawQuery.vnp_SecureHash;
  delete rawQuery.vnp_SecureHash;
  delete rawQuery.vnp_SecureHashType;

  const sortedParams = sortObject(rawQuery);
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const calculatedHash = crypto
    .createHmac("sha512", hashSecret)
    .update(Buffer.from(queryString, "utf-8"))
    .digest("hex");

  return secureHash && calculatedHash === secureHash;
}

module.exports = {
  buildPaymentUrl,
  verifySignature,
};
