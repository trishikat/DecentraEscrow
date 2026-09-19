import { useState } from "react";
import { ethers } from "ethers";
import escrowABI from "./escrowABI";

const CONTRACT_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

function EscrowApp() {
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState("");
    const [status, setStatus] = useState("");
    const [escrowStatus, setEscrowStatus] = useState("");

    async function connectWallet() {
        if (!window.ethereum) {
            alert("Please install MetaMask");
            return;
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
    }

    async function releaseFunds() {
        try {
            if (!window.ethereum) {
                setStatus("Please install MetaMask");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                escrowABI,
                signer
            );

            const tx = await contract.releaseFunds();
            await tx.wait();

            setStatus("Funds released successfully");
            setEscrowStatus("Released");
        } catch (error) {
            setStatus("Release failed: " + (error.reason || error.message));
        }
    }

    async function refundBuyer() {
        try {
            if (!window.ethereum) {
                setStatus("Please install MetaMask");
                return;
            }
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                escrowABI,
                signer
            );

            const tx = await contract.refundBuyer();
            await tx.wait();

            setStatus("Funds refunded successfully");
            setEscrowStatus("Refunded");
        } catch (error) {
            setStatus("Refund failed: " + (error.reason || error.message));
        }
    }

    async function getEscrowBalance() {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            escrowABI,
            provider
        );

        const contractBalance = await contract.getBalance();
        setBalance(ethers.formatEther(contractBalance));
    }

    async function getEscrowStatus() {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            escrowABI,
            provider
        );

        const currentStatus = await contract.status();

        const statusNames = [
            "Created",
            "Funded",
            "Released",
            "Refunded"
        ];

        setEscrowStatus(statusNames[Number(currentStatus)]);
    }

    return (
        <div>
            <h1>DecentraEscrow</h1>

            <button onClick={connectWallet}>Connect MetaMask</button>

            {account && <p>Connected Account: {account}</p>}

            <button onClick={getEscrowBalance}>
                Check Escrow Balance
            </button>

            <button onClick={getEscrowStatus}>
                Check Escrow Status
            </button>

            {balance && <p>Escrow Balance: {balance} ETH</p>}

            {escrowStatus && <p>Escrow Status: {escrowStatus}</p>}

            <button onClick={releaseFunds}>
                Release Funds
            </button>

            <button onClick={refundBuyer}>
                Refund Funds
            </button>

            {status && <p>Status: {status}</p>}
        </div>
    );
}

export default EscrowApp;