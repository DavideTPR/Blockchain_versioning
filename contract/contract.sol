pragma solidity >=0.5.0 <0.7.0;

///@title Versioning of a document
///@author Davide Tarasconi
///@notice Smart contract that allow to save information about a version of a document
contract Versioning{
    
    //information about documents
    struct Document{
        address creator;    //creator or modifier
        uint256 value;      //document hash
        uint creation;      //date of creation
        uint8 version;      //document version
    }

    mapping (uint256 => Document[]) doc;    //list of the document and relative "branch"

    //event to notify the modification of a document
    event changeDocument(address usr, uint256 doc);

}