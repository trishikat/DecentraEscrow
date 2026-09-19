import { useState } from "react";
import { ethers } from "ethers";
import escrowABI from "./escrowABI";
import "./App.css";

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
            setStatus(
                "Release failed: " + (error.reason || error.message)
            );
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
            setStatus(
                "Refund failed: " + (error.reason || error.message)
            );
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
            "Refunded",
        ];

        setEscrowStatus(statusNames[Number(currentStatus)]);
    }

    return (
        <div className="app">
            <h1>DecentraEscrow</h1>

            <p className="subtitle">
                A simple blockchain-based escrow application
            </p>

            <div className="wallet-section">
                <button onClick={connectWallet}>
                    Connect MetaMask
                </button>

                {account && (
                    <div className="account">
                        <strong>Connected Account</strong>
                        <br />
                        {account}
                    </div>
                )}
            </div>

            <div className="info-card">
                <h2>Escrow Details</h2>

                <div className="info-row">
                    <span>Balance</span>
                    <strong>
                        {balance ? `${balance} ETH` : "Not checked"}
                    </strong>
                </div>

                <div className="info-row">
                    <span>Status</span>
                    <strong>
                        {escrowStatus || "Not checked"}
                    </strong>
                </div>
            </div>

            {escrowStatus && (
                <div className="status-message">
                    Escrow Status:{" "}
                    <span
                        className={`status-badge status-${[
                            "Funded",
                            "Released",
                            "Refunded",
                            "Created",
                        ].includes(escrowStatus)
                            ? escrowStatus.toLowerCase()
                            : "unknown"
                            }`}
                    >
                        {escrowStatus}
                    </span>
                </div>
            )}

            <div className="actions">
                {escrowStatus && escrowStatus !== "Funded" && (
                    <div className="action-info">
                        🔒 Actions unavailable — this escrow is already{" "}
                        {escrowStatus.toLowerCase()}.
                    </div>
                )}
                <button onClick={getEscrowBalance}>
                    Check Balance
                </button>

                <button onClick={getEscrowStatus}>
                    Check Status
                </button>

                <button
                    onClick={releaseFunds}
                    disabled={escrowStatus !== "Funded"}
                    title={
                        escrowStatus !== "Funded"
                            ? "Funds can only be released while the escrow is funded"
                            : "Release funds to the seller"
                    }
                >
                    Release Funds
                </button>

                <button
                    onClick={refundBuyer}
                    disabled={escrowStatus !== "Funded"}
                    title={
                        escrowStatus !== "Funded"
                            ? "Funds can only be refunded while the escrow is funded"
                            : "Refund funds to the buyer"
                    }
                >
                    Refund Funds
                </button>
            </div>

            {status && (
                <div className="status-message">
                    {status}
                </div>
            )}
        </div>
    );
}

export default EscrowApp;