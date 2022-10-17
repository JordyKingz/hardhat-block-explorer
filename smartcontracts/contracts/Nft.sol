pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Nft is ERC721Enumerable, Ownable, ReentrancyGuard {
    string public baseURI;
    uint public maxSupply;
    uint public mintPrice;

    bool public saleStarted;
    mapping(address => uint256) public totalMinted;

    constructor(uint _maxSupply, uint _mintPrice) ERC721("NonFungibleToken", "NFT") {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseUri(string memory _baseUri) onlyOwner external {
        baseURI = _baseUri;
    }

    function setMintPrice(uint256 _newPrice) onlyOwner external {
        mintPrice = _newPrice;
    }

    function toggleSaleStarted() onlyOwner external {
        saleStarted = !saleStarted;
    }

    function transfer() onlyOwner external {
        Address.sendValue(payable(_msgSender()), address(this).balance);
    }

    function publicMint(uint amount) nonReentrant external payable {
        require(saleStarted, "Sale has not started");
        require(msg.value >= mintPrice * amount, "Not enough eth send");
        require((totalSupply() + amount) <= maxSupply, "You cannot exceed the max limit");
        for(uint256 i = 0; i < amount; i++)
        {
            _safeMint(_msgSender(), totalSupply() + 1);
        }
    }
}