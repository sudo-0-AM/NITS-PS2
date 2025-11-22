import { ethers } from "ethers/dist/ethers.esm.min.js";
import abi from "./abi.json";
import { NETWORK } from "./provider";

export const CONTRACT_ADDRESS = "0xe819485128e272addA676D8D0db2F868dcd5aF20";

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not detected.");
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
}

export function getProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getContract(signer = null) {
  const provider = await getProvider();
  const wallet = signer ? signer : await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
}
