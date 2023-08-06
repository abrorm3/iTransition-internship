"use strict";
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
    GameRules.prototype.determineWinner = function (playerMove, computerMove) {
        var half = (this.moves.length - 1) / 2;
        if (playerMove === computerMove) {
            return 'draw';
        }
        else if ((computerMove - playerMove + this.moves.length) % this.moves.length <= half) {
            return 'lose';
        }
        else {
            return 'win';
        }
    };
    GameRules.prototype.generateTable = function () {
        var table = [];
        table.push(__spreadArray([''], this.moves, true));
        for (var i = 0; i < this.moves.length; i++) {
            var row = [];
            row.push(this.moves[i]);
            for (var j = 0; j < this.moves.length; j++) {
                var result = this.determineWinner(i + 1, j + 1);
                row.push(result.charAt(0).toUpperCase());
            }
            table.push(row);
        }
        return table;
    };
    return GameRules;
}());
var RockPaperScissorsGame = /** @class */ (function () {
    function RockPaperScissorsGame(moves) {
        this.moves = moves;
        this.key = new KeyGenerator().generateRandomKey();
        this.hmacCalculator = new HMACCalculator();
        this.gameRules = new GameRules(this.moves);
    }
    RockPaperScissorsGame.prototype.generateComputerMove = function () {
        return Math.floor(Math.random() * this.moves.length) + 1;
    };
    RockPaperScissorsGame.prototype.start = function () {
        var _this = this;
        var computerMove = this.generateComputerMove();
        var computerMoveName = this.moves[computerMove - 1];
        console.log("HMAC: ".concat(this.hmacCalculator.calculateHMAC(this.key, computerMoveName)));
        console.log('Available moves:');
        this.moves.forEach(function (move, index) {
            console.log("".concat(index + 1, " - ").concat(move));
        });
        console.log('0 - exit');
        console.log('? - help');
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter your move: ', function (input) {
            var userInput = input.trim();
            if (userInput === '0') {
                rl.close();
                return;
            }
            if (userInput === '?') {
                _this.displayHelp();
                rl.question('Enter your move: ', _this.handleUserMove.bind(_this, computerMove, rl));
            }
            else {
                var playerMove = parseInt(userInput);
                if (isNaN(playerMove) || playerMove < 1 || playerMove > _this.moves.length) {
                    console.log('Invalid input. Please enter a valid move.');
                    _this.start();
                }
                else {
                    var playerMoveName = _this.moves[playerMove - 1];
                    var result = _this.gameRules.determineWinner(playerMove, computerMove);
                    console.log("Your move: ".concat(playerMoveName));
                    console.log("Computer move: ".concat(computerMoveName));
                    if (result === 'draw') {
                        console.log('It\'s draw!');
                    }
                    else {
                        console.log("You ".concat(result, "!"));
                    }
                    console.log("HMAC key: ".concat(_this.key.toString('hex').toUpperCase()));
                    rl.close();
                }
            }
        });
    };
    RockPaperScissorsGame.prototype.displayHelp = function () {
        var table = this.gameRules.generateTable();
        console.log('Help Table:');
        for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
            var row = table_1[_i];
            console.log(row.join('\t'));
        }
    };
    RockPaperScissorsGame.prototype.handleUserMove = function (computerMove, rl, input) {
        var playerMove = parseInt(input);
        if (isNaN(playerMove) || playerMove < 1 || playerMove > this.moves.length) {
            console.log('Invalid input. Please enter a valid move.');
            rl.question('Enter your move: ', this.handleUserMove.bind(this, computerMove, rl));
        }
        else {
            var playerMoveName = this.moves[playerMove - 1];
            var result = this.gameRules.determineWinner(playerMove, computerMove);
            console.log("Your move: ".concat(playerMoveName));
            console.log("Computer move: ".concat(this.moves[computerMove - 1]));
            console.log("You ".concat(result, "!"));
            console.log("HMAC key: ".concat(this.key.toString('hex').toUpperCase()));
            rl.close();
        }
    };
    return RockPaperScissorsGame;
}());
function main() {
    var args = process.argv.slice(2);
    if (args.length < 3 || args.length % 2 !== 1 || new Set(args).size !== args.length) {
        console.error('Invalid arguments. Please provide an odd number of non-repeating strings.');
        console.error('Example: node script.ts rock paper scissors lizard Spock');
        process.exit(1);
    }
    var game = new RockPaperScissorsGame(args);
    game.start();
}
main();
