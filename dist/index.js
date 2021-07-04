"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PATCH"] = "PATCH";
    Methods["DELETE"] = "DELETE";
})(Methods || (Methods = {}));
var server = http_1.default.createServer(function (req, res) {
    var filePath = path_1.default.join(__dirname, 'public', req.url || '');
    switch (req.method) {
        case Methods.GET:
            try {
                fs_1.promises.readFile(filePath, 'utf-8')
                    .then(function (data) { return res.end(data); });
            }
            catch (error) {
                console.error(error.message);
            }
            break;
        case Methods.POST:
            var data_1 = '';
            req.on('data', function (chunk) { return data_1 += chunk; });
            req.on('end', function () {
                try {
                    fs_1.promises.writeFile(filePath, data_1)
                        .then(function () { return res.end('File succesfully changed'); });
                }
                catch (error) {
                    console.error(error.message);
                }
            });
            break;
        case Methods.PATCH:
            var body_1 = '';
            req.on('data', function (chunk) { return body_1 += chunk; });
            req.on('end', function () {
                fs_1.promises.readFile(filePath, 'utf-8')
                    .then(function (data) {
                    var oldData = JSON.parse(data);
                    var newData = JSON.parse(body_1);
                    for (var key in newData) {
                        oldData[key] = newData[key];
                    }
                    fs_1.promises.writeFile(filePath, JSON.stringify(oldData, null, 2))
                        .then(function () { return res.end('File succesfully updated'); });
                });
            });
            break;
        case Methods.DELETE:
            fs_1.promises.unlink(filePath)
                .then(function () { return res.end('File succesfully deleted'); });
            break;
        default:
            res.end();
    }
});
server.listen(3000, function () {
    console.log('Server has been started at port 3000');
});
