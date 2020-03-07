"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
router.post('/login', function (req, res) {
    res.json({
        ok: true,
        message: 'Hola desde backend'
    });
});
exports.default = router;
