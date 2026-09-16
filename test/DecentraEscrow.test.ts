import { expect } from "chai";
import hre from "hardhat";

describe("DecentraEscrow", function () {
    async function deployEscrow() {
        const { ethers } = await hre.network.connect();

        const [buyer, seller, other] = await ethers.getSigners();

        const Escrow = await ethers.getContractFactory("DecentraEscrow");

        const amount = ethers.parseEther("1");

        const escrow = await Escrow.deploy(seller.address, {
            value: amount,
        });

        await escrow.waitForDeployment();

        return { escrow, buyer, seller, other, amount, ethers };
    }

    it("should create a funded escrow", async function () {
        const { escrow, buyer, seller, amount } = await deployEscrow();

        expect(await escrow.buyer()).to.equal(buyer.address);
        expect(await escrow.seller()).to.equal(seller.address);
        expect(await escrow.amount()).to.equal(amount);

        const balance = await escrow.getBalance();
        expect(balance).to.equal(amount);
    });

    it("should allow the buyer to release funds to the seller", async function () {
        const { escrow, buyer, seller, amount } = await deployEscrow();

        const sellerBalanceBefore = await escrow.runner.provider.getBalance(
            seller.address
        );

        await escrow.connect(buyer).releaseFunds();

        expect(await escrow.status()).to.equal(2);

        const escrowBalance = await escrow.getBalance();
        expect(escrowBalance).to.equal(0);

        const sellerBalanceAfter = await escrow.runner.provider.getBalance(
            seller.address
        );

        expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(amount);
    });

    it("should allow the buyer to request a refund", async function () {
        const { escrow, buyer, amount } = await deployEscrow();

        const buyerBalanceBefore = await escrow.runner.provider.getBalance(
            buyer.address
        );

        const tx = await escrow.connect(buyer).refundBuyer();
        const receipt = await tx.wait();

        expect(await escrow.status()).to.equal(3);
        expect(await escrow.getBalance()).to.equal(0);

        // Refund transaction itself costs gas, so the exact balance
        // is not checked here.
        expect(receipt).to.not.equal(null);
    });

    it("should prevent a different account from releasing funds", async function () {
        const { escrow, other } = await deployEscrow();

        await expect(
            escrow.connect(other).releaseFunds()
        ).to.be.revertedWith("Only buyer can release");
    });

    it("should prevent a different account from requesting a refund", async function () {
        const { escrow, other } = await deployEscrow();

        await expect(
            escrow.connect(other).refundBuyer()
        ).to.be.revertedWith("Only buyer can refund");
    });
});