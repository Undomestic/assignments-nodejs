# 🧩 Middleware Pipeline Architecture (Node.js)

A single-file **Express.js** demo showcasing a **robust middleware pipeline** architecture where **order matters**.  
This project demonstrates production-grade middleware chaining for performance, security, validation, and error handling.

---

## 🎯 Goal

To build a middleware stack implementing:

| Feature | Description |
|----------|--------------|
| ✅ **X-Request-Id** | Correlates each request with a unique UUID (included in all responses). |
| ⚡ **High-Precision Timing** | Measures processing time in milliseconds (with decimals) using `process.hrtime.bigint()`. |
| 🧱 **Body Size Limit + Safe JSON Parsing** | Protects against large payloads and handles malformed JSON safely. |
| 🌐 **CORS (Whitelist)** | Locks down origins to a predefined whitelist. |
| 🧮 **Per-route Schema Validation** | Uses **AJV** for strict request validation. |
| 🧾 **Centralized Error Handling** | Returns errors in [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) `application/problem+json` format. |
| 🚫 **No Unhandled Rejections** | Async errors are captured and routed to the centralized handler. |
| 🔁 **Response Headers** | Every response includes `X-Request-Id` and `X-Response-Time-ms`. |
| 🧪 **Demo Endpoint** | `POST /order` route validates data and demonstrates middleware ordering. |

---

## 🧠 Architecture Overview


