import { ethers } from "hardhat"
import { BigNumber } from "ethers";

export const BASE_TEN = 10
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export function mint(instance: any) {
  return instance.functions['mint(address,uint256)']
}
