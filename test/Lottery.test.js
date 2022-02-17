const compileContract = require('../compile')
const Web3 = require('web3')
const ganache = require('ganache-cli')
const assert = require('assert')

const provider = ganache.provider()
const web3Instance = new Web3(provider)
const { interface: contractInterface, bytecode } = compileContract('Lottery')

describe('Lottery Contract', () => {
    let accounts
    let lotteryContract

    beforeEach(async () => {
        accounts = await web3Instance.eth.getAccounts()
        lotteryContract = await new web3Instance.eth.Contract(JSON.parse(contractInterface))
            .deploy({ data: bytecode })
            .send({ from: accounts[0], gas: 1000000 })
    })

    it('should have an address if successfully deployed', async () => {
        assert.ok(lotteryContract.options.address)
    })

    it('should have the `manager` property set to the account we sent with', async () => {
        const managerWalletAddress = await lotteryContract.methods.manager().call()
        assert.equal(managerWalletAddress, accounts[0])
    })

    it('should allow people to enter', async () => {
        await lotteryContract.methods.enter().send({ from: accounts[1], value: web3Instance.utils.toWei('0.02', 'ether') })
        const players = await lotteryContract.methods.getPlayers().call()
        assert.equal(players[0], accounts[1])
    })

    it('should allow multiple people to enter', async () => {
        await lotteryContract.methods.enter().send({ from: accounts[2], value: web3Instance.utils.toWei('0.02', 'ether') })
        await lotteryContract.methods.enter().send({ from: accounts[3], value: web3Instance.utils.toWei('0.02', 'ether') })
        const players = await lotteryContract.methods.getPlayers().call()
        assert.equal(players.length, 2)
        assert.equal(players[1], accounts[3])
    })
})