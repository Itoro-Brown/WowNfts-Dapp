// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract wownft is ERC721Enumerable, Ownable {
    using Strings for uint256;

    //This depicts the baseUri of the nft
    string _baseTokenURI;

    //Here the price of one single nft is set
    uint256 _price = 0.01 ether;

    //This variable is used to pause the contract anytimethere is an emergency.abi
    bool paused;

    //To set the max number of wownfts
    uint256 maxToken = 10;

    //To get the total number of nfts minted
    uint256 public tokenIds;

    //The modifier below is used to initiate a paused on the contract
    modifier onlyWhenNotPaused() {
        require(paused, "Contract is not paused ");
        _;
    }

    //The contructor below will take in the name and symbol of the nft
    //It also takes in the base baseURI to set the baseTokenUri

    constructor(string memory baseURI) ERC721("wownft", "wn") {
        _baseTokenURI = baseURI;
    }

    //The function below mints the wownft to the user's address at a certain price
    function mint() public payable {
        require(tokenIds < maxToken, "Maximum number of nfts has been minted");
        require(msg.value >= _price, "Insufficient funds");
        tokenIds += 1;

        _safeMint(msg.sender, tokenIds);
    }

    //This overrides the defaut openzeppelin ERC721 default implementation which returns an empty string
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    //The function below extracts the URI of a given tokenId  from where we can get our nft metadata of the tokenID

    function tokenURI(uint256 tokenID)
        public
        view
        virtual
        override
        returns (string memory)
    {
        //heck to see if the tokenID exist
        require(_exists(tokenID), "No nft exist by that TokenId");
        string memory baseURI = _baseURI();
        /*The code belows checks to see if the length of the baseURI >0, if it is,
        it returns the baseURI and tokenID and attaches  a .json to if so it know the 
        location of the metadata of the given tokenID store on the IPFS
         */
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenID.toString(), ".json"))
                : "";
    }

    //The function pauses the contract and it can only be activated by the owner of the contarct
    function setPause(bool val) public onlyOwner {
        paused = val;
    }

    function withdraw() public payable onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Transaction failed");
    }

    fallback() external payable {}

    receive() external payable {}
}
