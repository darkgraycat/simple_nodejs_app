"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var actions_1 = require("./actions");
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PATCH"] = "PATCH";
    Methods["DELETE"] = "DELETE";
})(Methods || (Methods = {}));
var server = http_1.default.createServer(function (req, res) {
    switch (req.method) {
        case Methods.GET:
            actions_1.read(req).then(function (data) { return res.end(data); });
            break;
        case Methods.POST:
            actions_1.write(req).then(function () { return res.end('File succesfully changed'); });
            break;
        case Methods.PATCH:
            actions_1.append(req).then(function () { return res.end('File succesfully updated'); });
            break;
        case Methods.DELETE:
            actions_1.remove(req).then(function () { return res.end('File succesfully removed'); });
            break;
        default:
            res.end();
    }
});
server.listen(3000, function () {
    console.log('Server has been started at port 3000');
});
