 module.exports = async function ({ ethers, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const cake = await ethers.getContract("CakeToken")

  await deploy("SyrupBar", {
    from: deployer,
    log: true,
    args: [cake.address],
    deterministicDeployment: false
  })
}

module.exports.tags = ["SyrupBar"]
module.exports.dependencies = ["CakeToken"]
