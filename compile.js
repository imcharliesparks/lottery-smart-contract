const path = require('path')
const fs = require('fs')
const solc = require('solc')

const compileContract = (contractName) => {
    const contractLocation = path.resolve(`${__dirname}/contracts/${contractName}.sol`)
    const contractSource = fs.readFileSync(contractLocation, 'utf-8')
    const { contracts } = solc.compile(contractSource, 1)
    return contracts[`:${contractName}`]
}

module.exports = compileContract