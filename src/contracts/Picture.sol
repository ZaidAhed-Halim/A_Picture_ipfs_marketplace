// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.5;

contract Picture {

    string variableName;

    function set(string memory _picture) public {
        variableName = _picture;
    }

    function get() public view returns (string memory){
        return variableName;
    }

}