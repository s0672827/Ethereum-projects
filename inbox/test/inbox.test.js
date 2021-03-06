const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!']})
        .send({ from: accounts[0], gas: '1000000' });
        
    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // checks that the contract was given an address
        // fails if inbox.options.address is null or undefined
        assert.ok(inbox.options.address);
    });
    
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!');
    });
    
    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] }); 
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});







//Example of testing with Mocha

// class Car {
//     park() {
//         return 'stopped';
//     }
//     drive() {
//         return 'vroom';
//     }
// }

// let car;

// beforeEach(() => {
//     car = new Car(); 
// });

// describe('Car', () => {
//     it('can park', () => {
//         //const car = new Car();
//         assert.equal(car.park(), 'stopped');
//     });
    
//     it('can drive', () => {
//         //const car = new Car();
//         assert.equal(car.drive(), 'vroom');
//     });
// });