const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3')
const compileContract = require("./compile");
require('dotenv').config()

const { interface: contractInterface, bytecode } = compileContract('Lottery')
const provider = new HDWalletProvider(
  process.env.METAMASK_PNEUMONIC,
  process.env.INFURA_URL
)
const web3 = new Web3(provider)

const deploy = async () => {
  try {
    const [wallet] = await web3.eth.getAccounts()
    const contract = await new web3.eth.Contract(JSON.parse(contractInterface))
    const result = await contract
      .deploy({ data: bytecode })
      .send({ from: wallet })
    console.log('contract address', result.options.address)
  } catch (e) {
    console.log('e', e)
  }
}

deploy()