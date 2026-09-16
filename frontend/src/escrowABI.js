const escrowABI = [
    "function buyer() view returns (address)",
    "function seller() view returns (address)",
    "function amount() view returns (uint256)",
    "function status() view returns (uint8)",
    "function releaseFunds()",
    "function refundBuyer()",
    "function getBalance() view returns (uint256)"
];

export default escrowABI;