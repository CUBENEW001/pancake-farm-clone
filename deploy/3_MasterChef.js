module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const cake = await ethers.getContract("CakeToken")
  const syrup = await ethers.getContract("SyrupBar")
  
  const { address } = await deploy("MasterChef", {
    from: deployer,
    args: [cake.address, syrup.address, dev, "10", "11749500"],
    log: true,
    deterministicDeployment: false
  })

  if (await cake.owner() !== address) {
    // Transfer Cake Ownership to Chef
    console.log("Transfer Cake Ownership to Chef")
    await (await cake.transferOwnership(address)).wait()
  }

  const masterChef = await ethers.getContract("MasterChef")
  if (await masterChef.owner() !== dev) {
    // Transfer ownership of MasterChef to dev
    console.log("Transfer ownership of MasterChef to dev")
    await (await masterChef.transferOwnership(dev)).wait()
  }
}

module.exports.tags = ["MasterChef"]
module.exports.dependencies = ["CakeToken"]
