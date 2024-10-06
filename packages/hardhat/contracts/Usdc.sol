// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDCoin is ERC20, Ownable {
    uint8 private _decimals;

    constructor(uint256 initialSupply) ERC20("USD Coin", "USDC") {
        _decimals = 6; // USDC uses 6 decimal places
        _mint(msg.sender, initialSupply * 10**_decimals / 2);
        _mint(0x90138150A4cF51Ae2CB7Fc6376771a7A858dd07c, initialSupply * 10**_decimals / 2);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}