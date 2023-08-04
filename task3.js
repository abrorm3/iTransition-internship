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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var readline = require("readline");
var moves = process.argv.slice(2);
var KeyGenerator = /** @class */ (function () {
    function KeyGenerator() {
    }
    KeyGenerator.prototype.generateRandomKey = function () {
        return crypto.randomBytes(32); // 256 bits
    };
    return KeyGenerator;
}());
var HMACCalculator = /** @class */ (function () {
    function HMACCalculator() {
    }
    HMACCalculator.prototype.calculateHMAC = function (key, data) {
        var hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        return hmac.digest('hex');
    };
    return HMACCalculator;
}());
var GameRules = /** @class */ (function () {
    function GameRules(moves) {
        this.moves = moves;
    }
    GameRules.prototype.getWinningMove = function (userMove, computerMove) {
        var mid = Math.floor(this.moves.length / 2);
        var winningMoves = this.moves.slice(mid + 1).concat(this.moves.slice(0, mid));
        if (winningMoves.includes(computerMove)) {
            return userMove;
        }
        else if (winningMoves.includes(userMove)) {
            return computerMove;
        }
        else {
            return null;
        }
    };
    GameRules.prototype.displayHelpTable = function () {
        var n = this.moves.length;
        var table = [];
        // Initialize table with headers
        table[0] = __spreadArray([''], this.moves, true);
        // Fill in table with results
        for (var i = 0; i < n; i++) {
            table[i + 1] = __spreadArray([this.moves[i]], this.getResultsForRow(this.moves[i]), true);
        }
        // Display table
        console.log('\nHelp Table:');
        for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
            var row = table_1[_i];
            console.log(row.join('\t'));
        }
    };
    GameRules.prototype.getResultsForRow = function (userMove) {
        var results = [];
        for (var _i = 0, _a = this.moves; _i < _a.length; _i++) {
            var computerMove = _a[_i];
            if (userMove === computerMove) {
                results.push('Draw');
            }
            else {
                var winningMove = this.getWinningMove(userMove, computerMove);
                results.push(winningMove ? "Win (".concat(winningMove, ")") : 'Lose');
            }
        }
        return results;
    };
    return GameRules;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.keyGenerator = new KeyGenerator();
        this.hmacCalculator = new HMACCalculator();
        this.key = this.keyGenerator.generateRandomKey();
        this.userChoice = -1;
        this.gameRules = new GameRules(moves);
    }
    Game.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.areParametersValid()) {
                            console.log('Error: Incorrect arguments. You must provide an odd number >= 3 of non-repeating strings.');
                            console.log('Example: node script.ts Rock Paper Scissors');
                            return [2 /*return*/];
                        }
                        this.displayHMAC();
                        return [4 /*yield*/, this.getUserChoice()];
                    case 1:
                        _a.sent();
                        if (this.userChoice !== 0) {
                            this.playGame();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.areParametersValid = function () {
        return moves.length >= 3 && moves.length % 2 === 1 && new Set(moves).size === moves.length;
    };
    Game.prototype.displayHMAC = function () {
        var hmac = this.hmacCalculator.calculateHMAC(this.key, 'HMAC Key');
        console.log("HMAC: ".concat(hmac));
    };
    Game.prototype.getUserChoice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rl, i, input, choice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout,
                        });
                        console.log('Menu:');
                        for (i = 0; i < moves.length; i++) {
                            console.log("".concat(i + 1, " - ").concat(moves[i]));
                        }
                        console.log("0 - Exit");
                        console.log("? - Help");
                        return [4 /*yield*/, new Promise(function (resolve) {
                                rl.question('Make your choice: ', resolve);
                            })];
                    case 1:
                        input = _a.sent();
                        rl.close();
                        if (!(input === '?')) return [3 /*break*/, 3];
                        this.gameRules.displayHelpTable();
                        return [4 /*yield*/, this.getUserChoice()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        choice = parseInt(input, 10);
                        if (!(isNaN(choice) || choice < 0 || choice > moves.length)) return [3 /*break*/, 5];
                        console.log('Invalid choice. Please select a valid option.');
                        return [4 /*yield*/, this.getUserChoice()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this.userChoice = choice;
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.playGame = function () {
        var computerChoice = Math.floor(Math.random() * moves.length);
        var userMove = moves[this.userChoice - 1];
        var computerMove = moves[computerChoice];
        var hmac = this.hmacCalculator.calculateHMAC(this.key, userMove);
        console.log("Your move: ".concat(userMove));
        console.log("Computer's move: ".concat(computerMove));
        console.log("HMAC: ".concat(hmac));
        var winningMove = this.gameRules.getWinningMove(userMove, computerMove);
        if (winningMove) {
            console.log("You ".concat(winningMove === userMove ? 'win' : 'lose', "!"));
        }
        else {
            console.log("It's a draw!");
        }
        console.log("Key: ".concat(this.key.toString('hex')));
    };
    return Game;
}());
var game = new Game();
game.start();
