// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;


contract logFileStorage{
    struct data{
        string ipfsHash;
        uint timestamp;
        string campLocation;
    }
    data[] public DATA;
    function setter(string memory ip,string memory camp)public {
        data memory newData = data({
            ipfsHash: ip,
            timestamp: block.timestamp,
            campLocation: camp
        });
        DATA.push(newData);

    }
    function getter()public view returns(data[] memory){
        return DATA;
    }
}