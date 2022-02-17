// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Owned {

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "This function is restricted to the contract's owner");
        _;
    }

}

contract Mortal is Owned {
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}

contract GifPortal is Mortal {

    uint256 totalGifs;

    event NewGif(address indexed from, string url, uint256 timestamp);

    struct Gif {
        address user;
        string url;
        uint256 timestamp;
    }

    Gif[] gifs;

    function addGif(string memory url) public {
        bytes memory urlBytes = bytes(url);
        require(urlBytes.length != 0);

        totalGifs += 1;
        console.log("%s added gifs w/ url %s", msg.sender, url);

        gifs.push(Gif(msg.sender, url, block.timestamp));

        emit NewGif(msg.sender, url, block.timestamp);
    }

    function getAllGifs() public view returns (Gif[] memory) {
        return gifs;
    }

    function getTotalGifs() public view returns (uint256) {
        console.log("We have %d total gifs!", totalGifs);
        return totalGifs;
    }

}