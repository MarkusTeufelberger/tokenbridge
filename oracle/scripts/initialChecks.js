require('../env')
const Web3 = require('web3')
const { ERC677_BRIDGE_TOKEN_ABI, ERC_TYPES } = require('../../commons')

async function initialChecks() {
  const { ERC20_TOKEN_ADDRESS, BRIDGE_MODE, FOREIGN_RPC_URL, FOREIGN_BRIDGE_ADDRESS } = process.env
  const result = {}

  if (BRIDGE_MODE === 'ERC_TO_ERC') {
    const foreignWeb3 = new Web3(new Web3.providers.HttpProvider(FOREIGN_RPC_URL))
    const tokenContract = new foreignWeb3.eth.Contract(ERC677_BRIDGE_TOKEN_ABI, ERC20_TOKEN_ADDRESS)
    try {
      const bridgeContract = await tokenContract.methods.bridgeContract().call()
      if (bridgeContract === FOREIGN_BRIDGE_ADDRESS) {
        result.foreignERC = ERC_TYPES.ERC677
      } else {
        result.foreignERC = ERC_TYPES.ERC20
      }
    } catch (e) {
      result.foreignERC = ERC_TYPES.ERC20
    }
  }
  console.log(JSON.stringify(result))
  return result
}

initialChecks()

module.exports = initialChecks
