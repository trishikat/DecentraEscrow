import hre from "hardhat";

async function main() {
    const { ethers } = await hre.network.connect();

    const [buyer, seller] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("DecentraEscrow");

    const amount = ethers.parseEther("1");

    const escrow = await Escrow.deploy(seller.address, {
        value: amount,
    });

    await escrow.waitForDeployment();

    console.log("Buyer:", buyer.address);
    console.log("Seller:", seller.address);
    console.log("Escrow deployed to:", await escrow.getAddress());
    console.log("Escrow balance:", await escrow.getBalance());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});