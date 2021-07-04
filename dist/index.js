"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PATCH"] = "PATCH";
    Methods["DELETE"] = "DELETE";
})(Methods || (Methods = {}));
var readFile = function () { };
var replaceFile = function () { };
var updateFile = function () { };
var deleteFile = function () { };
var server = http_1.default.createServer(function (req, res) {
    var filePath = path_1.default.join(__dirname, 'public', req.url || '');
    switch (req.method) {
        case Methods.GET:
            readFile();
            fs_1.default.readFile(filePath, 'utf-8', function (err, data) {
                if (err)
                    throw err;
                console.log('Get file');
                res.end(data);
            });
            break;
        case Methods.POST:
            replaceFile();
            var data_1 = '';
            req.on('data', function (chunk) { return data_1 += chunk; });
            req.on('end', function () {
                fs_1.default.writeFile(filePath, data_1, function (err) {
                    if (err)
                        throw err;
                    console.log('Write file');
                    res.end('File succesfully changed');
                });
            });
            break;
        case Methods.PATCH:
            updateFile();
            var body_1 = '';
            req.on('data', function (chunk) { return body_1 += chunk; });
            req.on('end', function () {
                fs_1.default.readFile(filePath, 'utf-8', function (err, data) {
                    if (err)
                        throw err;
                    var old = JSON.parse(data);
                    var ccc = JSON.parse(body_1);
                    for (var k in ccc) {
                        old[k] = ccc[k];
                    }
                    fs_1.default.writeFile(filePath, JSON.stringify(old), function (err) {
                        if (err)
                            throw err;
                        res.end('File succesfully updated');
                    });
                });
            });
            break;
        case Methods.DELETE:
            deleteFile();
            fs_1.default.unlink(filePath, function (err) {
                if (err)
                    throw err;
                res.end('File succesfully deleted');
            });
            break;
        default:
            res.end();
    }
});
server.listen(3000, function () {
    console.log('Server has been started at port 3000');
});
