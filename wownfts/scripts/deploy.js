const hre = require("hardhat");

async function main() {
  //This contract was deployed to this address 0xe478Edc815Ca693d9C11494333Bab7Fc96a173Fe

  const metadata = "ipfs://QmerooNbcNBNvefEzH6ZfbQ2zA6q55M5NShE4wum3udTeo/";
  const contract = await hre.ethers.getContractFactory("wownft");
  const deployedContract = await contract.deploy(metadata);
  await deployedContract.deployed();

  console.log("Contract deployment is in progress...");

  console.log(
    `This contract was deployed to this address : ${deployedContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
