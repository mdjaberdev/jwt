const { rateLimit } = require("express-rate-limit");
const createLimiter = (limit) => {
 return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
  });
};

module.exports = createLimiter;
