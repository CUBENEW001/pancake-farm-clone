import { ethers } from "hardhat";
import { expect } from "chai";
import { mint } from "./utils"

describe("CakeToken", function () {
  before(async function () {
    this.CakeToken = await ethers.getContractFactory("CakeToken")
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
  })

  beforeEach(async function () {
    this.cake = await this.CakeToken.deploy()
    await this.cake.deployed()
    // mint(this.cake) = this.cake.functions['mint(address,uint256)']
  })

  it("should have correct name and symbol and decimal", async function () {
    const name = await this.cake.name()
    const symbol = await this.cake.symbol()
    const decimals = await this.cake.decimals()
    expect(name, "CakeToken")
    expect(symbol, "CAKE")
    expect(decimals, "18")
  })

  it("should have correct name and symbol and decimal2", async function () {
    const name = await this.cake.name()
    const symbol = await this.cake.symbol()
    const decimals = await this.cake.decimals()
    expect(name, "CakeToken")
    expect(symbol, "CAKE")
    expect(decimals, "18")
  })

  it("should only allow owner to mint token", async function () {
    await mint(this.cake)(this.alice.address, "100")
    await mint(this.cake)(this.bob.address, "1000")
    const bobCake = await this.cake.connect(this.bob)
    await expect(mint(bobCake)(this.carol.address, "1000", { from: this.bob.address })).to.be.revertedWith(
      "Ownable: caller is not the owner"
    )
    const totalSupply = await this.cake.totalSupply()
    const aliceBal = await this.cake.balanceOf(this.alice.address)
    const bobBal = await this.cake.balanceOf(this.bob.address)
    const carolBal = await this.cake.balanceOf(this.carol.address)
    expect(totalSupply).to.equal("1100")
    expect(aliceBal).to.equal("100")
    expect(bobBal).to.equal("1000")
    expect(carolBal).to.equal("0")
  })

  it("should supply token transfers properly", async function () {
    await mint(this.cake)(this.alice.address, "100")
    await mint(this.cake)(this.bob.address, "1000")
    await this.cake.transfer(this.carol.address, "10")
    await this.cake.connect(this.bob).transfer(this.carol.address, "100", {
      from: this.bob.address,
    })
    const totalSupply = await this.cake.totalSupply()
    const aliceBal = await this.cake.balanceOf(this.alice.address)
    const bobBal = await this.cake.balanceOf(this.bob.address)
    const carolBal = await this.cake.balanceOf(this.carol.address)
    expect(totalSupply, "1100")
    expect(aliceBal, "90")
    expect(bobBal, "900")
    expect(carolBal, "110")
  })

  it("should fail if you try to do bad transfers", async function () {
    await mint(this.cake)(this.alice.address, "100")
    await expect(this.cake.transfer(this.carol.address, "110")).to.be.revertedWith("BEP20: transfer amount exceeds balance")
    await expect(this.cake.connect(this.bob).transfer(this.carol.address, "1", { from: this.bob.address })).to.be.revertedWith(
      "BEP20: transfer amount exceeds balance"
    )
  })
})
