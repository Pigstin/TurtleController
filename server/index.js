"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var ngrok_1 = require("ngrok");
// tsc server/index.ts
// node server/index.js
var turtle_ids = [];
//var turtles_connected = turtle_ids.length();
var turtle_names = ["jake", "joe", "jeff", "jon", "jonny", "james", "jonathan"];
var sender_turtle = [], sender_web = [], web_num = 0;
var wss = new ws_1.Server({ port: 5757 });
console.log("Starting Server...");
wss.on('connection', function connection(ws) {
    //console.log(ws);
    ws.on('message', function incoming(message) {
        var data = JSON.parse(message);
        if (data.type == "web_client") { // if is web client
            console.log(data);
            if (data.isEval) {
                //console.log(ws._sender); // dont do this.
                var command_obj = { type: "server", isEval: data.isEval, command: data.command };
                // add turtle names
                var command_JSON = JSON.stringify(command_obj);
                if (data.turtle_id != "") {
                    if (data.turtle_id == "all") {
                        console.log(turtle_ids);
                        if (turtle_ids[0] == undefined) {
                        }
                        for (var i = 0; i < turtle_ids.length; i++) {
                            //console.log(i);
                            //console.log(turtle_ids.length);
                            //console.log(sender_turtle[turtle_ids[i]]);
                            if (turtle_ids[i] != "" || turtle_ids[i] != null || turtle_ids[i] != undefined) {
                                ws._sender = sender_turtle[i];
                                ws.send(command_JSON);
                            }
                        }
                    }
                    else if (data.turtle_id == null) {
                        console.error('error: data.turtle_id  = null');
                    }
                    else {
                        ws._sender = sender_turtle[data.id];
                        ws.send(command_JSON);
                        //console.log("sent data to " + data.);
                    }
                }
                else {
                    console.log("'sender' is undefined");
                }
            }
            else { // if is_Eval is false
                if (data.command == "inital_msg" && data.turtle_id == "" || data.turtle_id == null) { // if it is the first message the web client sends
                    sender_web[web_num] = ws._sender;
                    web_num = sender_web.length;
                    sender_web = deleteDuplicates(sender_web); // may be more info than needed -- can isolate needed info? 
                }
            }
        }
        else if (data.type == "turtle_client") {
            console.log(data);
            //console.log(data.turtle_id); // -- turtle_id is not part of data !! 
            sender_turtle[sender_turtle.length] = ws._sender;
            //sender_turtle = deleteDuplicates(sender_turtle); 
            turtle_ids[turtle_ids.length] = data.id;
            //turtle_ids = deleteDuplicates(turtle_ids);
            for (var i = 0; i < 15; i++) {
                if (data.inventory.slots[i] != null) {
                    console.log(data.inventory.slots[i]);
                }
            }
            if (data.name == null || data.name == "") { // OR is ||, AND is &&
                // if a turtle does not have a name, assume it's a new turtle
                var new_name = turtle_names[data.id];
                var new_data = { type: "new_data", name: new_name, id: data.id };
                console.log(JSON.stringify(new_data));
                ws.send(JSON.stringify(new_data));
            }
        }
        else {
            console.log(message);
        }
    });
});
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, new_url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ngrok_1.connect(5757)];
            case 1:
                url = _a.sent();
                new_url = url.slice(8, url.length);
                console.log(new_url);
                new_url = url.replace("https://", "wss://");
                console.log(new_url);
                return [2 /*return*/];
        }
    });
}); })();
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
function deleteDuplicates(array_) {
    var uniqueItems = __spread(new Set(array_));
    uniqueItems = uniqueItems.filter(Boolean); // https://stackoverflow.com/questions/28607451/removing-undefined-values-from-array
    return uniqueItems;
}
