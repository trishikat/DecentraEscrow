// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract DecentraEscrow {
    enum Status {
        Created,
        Funded,
        Released,
        Refunded
    }

    address public buyer;
    address payable public seller;
    uint256 public amount;
    Status public status;

    constructor(address payable _seller) payable {
        require(_seller != address(0), "Invalid seller address");
        require(msg.value > 0, "Escrow must be funded");

        buyer = msg.sender;
        seller = _seller;
        amount = msg.value;
        status = Status.Funded;
    }

    function releaseFunds() external {
        require(msg.sender == buyer, "Only buyer can release");
        require(status == Status.Funded, "Escrow is not funded");

        status = Status.Released;

        (bool success, ) = seller.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function refundBuyer() external {
        require(msg.sender == buyer, "Only buyer can refund");
        require(status == Status.Funded, "Escrow is not funded");

        status = Status.Refunded;

        (bool success, ) = payable(buyer).call{value: amount}("");
        require(success, "Refund failed");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
