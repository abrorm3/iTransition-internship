import * as crypto from 'crypto';
import * as readline from 'readline';

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

  determineWinner(playerMove: number, computerMove: number): string {
    const half = (this.moves.length - 1) / 2;
    if (playerMove === computerMove) {
      return 'draw';
    } else if ((computerMove - playerMove + this.moves.length) % this.moves.length <= half) {
      return 'lose';
    } else {
      return 'win';
    }
  }
  

  generateTable(): string[][] {
    const table: string[][] = [];
    table.push(['', ...this.moves]);

    for (let i = 0; i < this.moves.length; i++) {
      const row: string[] = [];
      row.push(this.moves[i]);
      for (let j = 0; j < this.moves.length; j++) {
        const result = this.determineWinner(i + 1, j + 1);
        row.push(result.charAt(0).toUpperCase());
      }
      table.push(row);
    }

    return table;
  }
}

class RockPaperScissorsGame {
  private key: Buffer;
  private moves: string[];
  private hmacCalculator: HMACCalculator;
  private gameRules: GameRules;

  constructor(moves: string[]) {
    this.moves = moves;
    this.key = new KeyGenerator().generateRandomKey();
    this.hmacCalculator = new HMACCalculator();
    this.gameRules = new GameRules(this.moves);
  }

  private generateComputerMove(): number {
    return Math.floor(Math.random() * this.moves.length) + 1;
  }

  start(): void {
    const computerMove = this.generateComputerMove();
    const computerMoveName = this.moves[computerMove - 1];

    console.log(`HMAC: ${this.hmacCalculator.calculateHMAC(this.key, computerMoveName)}`);
    console.log('Available moves:');
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log('0 - exit');
    console.log('? - help');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter your move: ', (input: string) => {
      const userInput = input.trim();
      if (userInput === '0') {
        rl.close();
        return;
      }

      if (userInput === '?') {
        this.displayHelp();
        rl.question('Enter your move: ', this.handleUserMove.bind(this, computerMove, rl));
      } else {
        const playerMove = parseInt(userInput);
        if (isNaN(playerMove) || playerMove < 1 || playerMove > this.moves.length) {
          console.log('Invalid input. Please enter a valid move.');
          this.start();
        } else {
          const playerMoveName = this.moves[playerMove - 1];
          const result = this.gameRules.determineWinner(playerMove, computerMove);

          console.log(`Your move: ${playerMoveName}`);
          console.log(`Computer move: ${computerMoveName}`);
          if(result ==='draw'){
            console.log('It\'s draw!')
          }else{
            console.log(`You ${result}!`);
          }
          console.log(`HMAC key: ${this.key.toString('hex').toUpperCase()}`);

          rl.close();
        }
      }
    });
  }

  private displayHelp(): void {
    const table = this.gameRules.generateTable();
    console.log('Help Table:');
    for (const row of table) {
      console.log(row.join('\t'));
    }
  }

  private handleUserMove(computerMove: number, rl: readline.Interface, input: string): void {
    const playerMove = parseInt(input);
    if (isNaN(playerMove) || playerMove < 1 || playerMove > this.moves.length) {
      console.log('Invalid input. Please enter a valid move.');
      rl.question('Enter your move: ', this.handleUserMove.bind(this, computerMove, rl));
    } else {
      const playerMoveName = this.moves[playerMove - 1];
      const result = this.gameRules.determineWinner(playerMove, computerMove);

      console.log(`Your move: ${playerMoveName}`);
      console.log(`Computer move: ${this.moves[computerMove - 1]}`);
      console.log(`You ${result}!`);
      console.log(`HMAC key: ${this.key.toString('hex').toUpperCase()}`);

      rl.close();
    }
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 3 || args.length % 2 !== 1 || new Set(args).size !== args.length) {
    console.error('Invalid arguments. Please provide an odd number of non-repeating strings.');
    console.error('Example: node script.ts rock paper scissors lizard Spock');
    process.exit(1);
  }

  const game = new RockPaperScissorsGame(args);
  game.start();
}

main();
