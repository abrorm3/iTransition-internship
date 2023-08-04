import * as crypto from 'crypto';
import * as readline from 'readline';

const moves = process.argv.slice(2);

class KeyGenerator {
    generateRandomKey(): Buffer {
        return crypto.randomBytes(32); // 256 bits
    }
}

class HMACCalculator {
    calculateHMAC(key: Buffer, data: string): string {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        return hmac.digest('hex');
    }
}

class GameRules {
    private moves: string[];

    constructor(moves: string[]) {
        this.moves = moves;
    }
    getWinningMove(userMove: string, computerMove: string): string | null {
        const mid = Math.floor(this.moves.length / 2);
        const winningMoves = this.moves.slice(mid + 1).concat(this.moves.slice(0, mid));

        if (winningMoves.includes(computerMove)) {
            return userMove;
        } else if (winningMoves.includes(userMove)) {
            return computerMove;
        } else {
            return null;
        }
    }

    displayHelpTable(): void {
        const n = this.moves.length;
        const table: string[][] = [];

        // Initialize table with headers
        table[0] = ['', ...this.moves];

        // Fill in table with results
        for (let i = 0; i < n; i++) {
            table[i + 1] = [this.moves[i], ...this.getResultsForRow(this.moves[i])];
        }

        // Display table
        console.log('\nHelp Table:');
        for (const row of table) {
            console.log(row.join('\t'));
        }
    }

    private getResultsForRow(userMove: string): string[] {
        const results: string[] = [];
        for (const computerMove of this.moves) {
            if (userMove === computerMove) {
                results.push('Draw');
            } else {
                const winningMove = this.getWinningMove(userMove, computerMove);
                results.push(winningMove ? `Win (${winningMove})` : 'Lose');
            }
        }
        return results;
    }
}

class Game {
    private key: Buffer;
    private userChoice: number;
    private keyGenerator: KeyGenerator;
    private hmacCalculator: HMACCalculator;
    private gameRules: GameRules;

    constructor() {
        this.keyGenerator = new KeyGenerator();
        this.hmacCalculator = new HMACCalculator();
        this.key = this.keyGenerator.generateRandomKey();
        this.userChoice = -1;
        this.gameRules = new GameRules(moves);
    }

    async start(): Promise<void> {
        if (!this.areParametersValid()) {
            console.log('Error: Incorrect arguments. You must provide an odd number >= 3 of non-repeating strings.');
            console.log('Example: node script.ts Rock Paper Scissors');
            return;
        }

        this.displayHMAC();
        await this.getUserChoice();
        if (this.userChoice !== 0) {
            this.playGame();
        }
    }

    private areParametersValid(): boolean {
        return moves.length >= 3 && moves.length % 2 === 1 && new Set(moves).size === moves.length;
    }

    private displayHMAC(): void {
        const hmac = this.hmacCalculator.calculateHMAC(this.key, 'HMAC Key');
        console.log(`HMAC: ${hmac}`);
    }

    private async getUserChoice(): Promise<void> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    
        console.log('Menu:');
        for (let i = 0; i < moves.length; i++) {
            console.log(`${i + 1} - ${moves[i]}`);
        }
        console.log(`0 - Exit`);
        console.log(`? - Help`);
    
        const input = await new Promise<string>((resolve) => {
            rl.question('Make your choice: ', resolve);
        });
        
        rl.close();
    
        if (input === '?') {
            this.gameRules.displayHelpTable();
            await this.getUserChoice();
        } else {
            const choice = parseInt(input, 10);
            if (isNaN(choice) || choice < 0 || choice > moves.length) {
                console.log('Invalid choice. Please select a valid option.');
                await this.getUserChoice();
            } else {
                this.userChoice = choice;
            }
        }
    }

    private playGame(): void {
        const computerChoice = Math.floor(Math.random() * moves.length);
        const userMove = moves[this.userChoice - 1];
        const computerMove = moves[computerChoice];
        const hmac = this.hmacCalculator.calculateHMAC(this.key, userMove);

        console.log(`Your move: ${userMove}`);
        console.log(`Computer's move: ${computerMove}`);
        console.log(`HMAC: ${hmac}`);

        const winningMove = this.gameRules.getWinningMove(userMove, computerMove);

        if (winningMove) {
            console.log(`You ${winningMove === userMove ? 'win' : 'lose'}!`);
        } else {
            console.log(`It's a draw!`);
        }

        console.log(`Key: ${this.key.toString('hex')}`);
    }
}

const game = new Game();
game.start();
