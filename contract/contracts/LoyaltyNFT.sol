// ✅ Final Solidity - Without tokenURI
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LoyaltyNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => uint256) public points;
    mapping(address => uint256) public walletToToken;

    // Optional: keep or remove if not used
    string public baseURI;

    event TokenTransferred(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor(string memory _baseURI) ERC721("LoyaltyNFT", "LNFT") {
        baseURI = _baseURI;
        tokenCounter = 1;
    }

    function mintNFT(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        _mint(to, tokenId);
        walletToToken[to] = tokenId;
        tokenCounter++;
        return tokenId;
    }

    // ❌ Remove this if not needed
    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     require(_exists(tokenId), "Token doesn't exist");
    //     return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    // }

    function addPointsToNFT(uint256 tokenId, uint256 _points) public onlyOwner {
        require(_exists(tokenId), "Token doesn't exist");
        points[tokenId] += _points;
    }

    function _exists(uint256 tokenId) internal view override returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function getPoints(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token doesn't exist");
        return points[tokenId];
    }

    function getUserToken(address wallet) public view returns (uint256) {
        uint256 tokenId = walletToToken[wallet];
        require(tokenId > 0, "No token associated with this wallet");
        return tokenId;
    }

    function safeTransferWithMapping(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId);
        updateTokenMapping(from, to, tokenId);
    }

    function transferWithMapping(address from, address to, uint256 tokenId) public {
        transferFrom(from, to, tokenId);
        updateTokenMapping(from, to, tokenId);
    }

    function updateTokenMapping(address from, address to, uint256 tokenId) internal {
        if (from != address(0)) {
            walletToToken[from] = 0;
        }
        walletToToken[to] = tokenId;
        emit TokenTransferred(from, to, tokenId);
    }

    function fixWalletToTokenMapping(address wallet, uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token doesn't exist");
        require(_ownerOf(tokenId) == wallet, "Wallet is not the owner of token");
        walletToToken[wallet] = tokenId;
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
        internal
        virtual
        override
    {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        if (from != address(0)) walletToToken[from] = 0;
        if (to != address(0)) walletToToken[to] = firstTokenId;
    }
}
