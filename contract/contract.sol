pragma solidity >=0.5.0 <0.7.0;

contract Versioning{

    mapping (address => uint) document; //document's hash
    address public creator; //document's creator
    address public mod_user; //user who made last modify

}