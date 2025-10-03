import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// --- CONFIG ---
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Your contract details
const contractAddress = "0xf90155c4fcd02a0878768672ade553093156fe55";
const abi = [
  "function deposit() payable",
  "function withdraw(uint amount)",
  "function balances(address) view returns (uint256)"
];

const bank = new ethers.Contract(contractAddress, abi, signer);

async function main() {
  const myAddress = await signer.getAddress();

  // 1. Check balance
  const balance = await bank.balances(myAddress);
  console.log("My contract balance:", ethers.formatEther(balance), "ETH");

  // 2. Deposit 0.01 ETH
  const tx = await bank.deposit({ value: ethers.parseEther("0.01") });
  await tx.wait();
  console.log("Deposited 0.01 ETH");

  // 3. Withdraw 0.005 ETH
  const tx2 = await bank.withdraw(ethers.parseEther("0.005"));
  await tx2.wait();
  console.log("Withdrew 0.005 ETH");
}

main().catch(console.error);
