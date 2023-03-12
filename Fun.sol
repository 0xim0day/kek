//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenVault is Ownable {
    mapping(address => bool) private _allowedTokens;
    mapping(address => uint256) private _tokenBalances;

    event TokensAllowed(address indexed token);
    event TokensDisallowed(address indexed token);
    event TokensDeposited(address indexed token, address indexed from, uint256 amount);
    event TokensWithdrawn(address indexed token, address indexed to, uint256 amount);

    function allowTokens(address[] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            require(!_allowedTokens[token], "Token is already allowed");
            require(isSupportedToken(token), "Token is not supported");

            _allowedTokens[token] = true;

            emit TokensAllowed(token);
        }
    }

    function disallowTokens(address[] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            require(_allowedTokens[token], "Token is not allowed");

            _allowedTokens[token] = false;

            emit TokensDisallowed(token);
        }
    }

    function depositTokens(address token, uint256 amount) public {
        require(_allowedTokens[token], "Token is not allowed");
        require(IERC20(token).balanceOf(msg.sender) >= amount, "Insufficient balance");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        _tokenBalances[token] += amount;

        emit TokensDeposited(token, msg.sender, amount);
    }

    function withdrawTokens(address token, address to, uint256 amount) public onlyOwner {
        require(_tokenBalances[token] >= amount, "Insufficient balance");

        IERC20(token).transfer(to, amount);
        _tokenBalances[token] -= amount;

        emit TokensWithdrawn(token, to, amount);
    }

    function isSupportedToken(address token) private view returns (bool) {
        return token == 0x0000000000000000000000000000000000000000 // ETH
            || token == 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c // BNB
            || token == 0x55d398326f99059fF775485246999027B3197955 // USDT
            || token == 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d // USDC
            || token == 0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0; // MATIC
    }
}