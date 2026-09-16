import { useState } from "react";
import { ethers } from "ethers";
import escrowABI from "./escrowABI";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function EscrowApp() {
    const [account, setAccount] = useState("");
    const [balance, setBalance] = useState("");
    const [status, setStatus] = useState("");

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

    return (
        <div>
            <h1>DecentraEscrow</h1>

            <button onClick={connectWallet}>Connect MetaMask</button>

            {account && <p>Connected Account: {account}</p>}

            <button onClick={getEscrowBalance}>Check Escrow Balance</button>

            {balance && <p>Escrow Balance: {balance} ETH</p>}
            <button onClick={releaseFunds}>
                Release Funds
            </button>

            {status && <p>Status: {status}</p>}
        </div>
    );
}

export default EscrowApp;
