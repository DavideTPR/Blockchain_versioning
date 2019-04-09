pragma solidity ^0.5.0 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Versioning.sol";

contract TestVersioning{

    Versioning ver = Versioning(DeployedAddresses.Versioning());

    function testCreateDocument() public{
        (uint256 id, uint256 version) = ver.create(0, 123);

        Assert.equal(id, 0, "Id error");
        Assert.equal(version, 0, "Not version 0");

        (id, version) = ver.create(1, 123);
        Assert.equal(id, 1, "Id error");
        Assert.equal(version, 0, "Not version 0");

        /*(id, version) = ver.create(2, 0);
        Assert.equal(id, 2, "Id error");
        Assert.equal(version, 0, "Not version 0");*/
    }

    function testAddVersion() public{
        uint256 version = ver.update(0, 0, 122);

        Assert.equal(version, 1, "wrong increment");

        version = ver.update(0, 1, 121);
        Assert.equal(version, 2, "wrong increment");

        /*version = ver.update(5, 1, 121);
        Assert.equal(version, 2, "wrong increment");*/
    }

}