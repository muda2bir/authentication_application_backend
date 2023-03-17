"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUserAuthenticated(req, res, next) {
    if (req.user)
        next();
    else {
        res.status(401).json({ status: "error", message: "Unauthorized!" });
    }
}
exports.default = isUserAuthenticated;
