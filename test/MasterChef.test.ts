import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('MasterChef', function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
    this.dev = this.signers[3];
    this.minter = this.signers[4];

    this.MasterChef = await ethers.getContractFactory('MasterChef');
    this.CakeToken = await ethers.getContractFactory('CakeToken');
    this.SyrupBar = await ethers.getContractFactory('SyrupBar');
  });

  beforeEach(async function () {
    this.cake = await this.CakeToken.deploy();
    await this.cake.deployed();
    this.syrup = await this.SyrupBar.deploy(this.cake.address);
    await this.syrup.deployed();
  });

  it('should set correct state variables', async function () {
    this.chef = await this.MasterChef.deploy(this.cake.address, this.syrup.address, this.dev.address, '1000', '100');
    await this.chef.deployed();

    await this.cake.transferOwnership(this.chef.address);

    const cake = await this.chef.cake();
    const devaddr = await this.chef.devaddr();
    const owner = await this.cake.owner();

    expect(cake).to.equal(this.cake.address);
    expect(devaddr).to.equal(this.dev.address);
    expect(owner).to.equal(this.chef.address);
  });
});
