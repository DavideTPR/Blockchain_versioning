pragma solidity >=0.5.0 <0.7.0;

///@title Versioning of a document
///@author Davide Tarasconi
///@notice Smart contract that allow to save information about a version of a document
contract Versioning{

    Document doc;
    mapping (uint256 => Document[]) modify;
    //event to notify the modification of a document
    event changeDocument(address mod, uint doc);


    constructor(uint256 doc_h) public{
        doc = new Document(msg.sender, doc_h, 0);
    }


    function change(uint256 doc_h) public{
        require(doc.value != doc_h);
        modify[doc.creator].push(new Document(msg.sender, doc_h, doc.version+1));
    }

}

///@title document
contract Document{
    address public creator; //document's creator
    uint256 public value; //document's hash
    uint public creation; //date of creation of this document
    uint8 public version; //version of the document


    ///@param c addres of creator
    ///@param hash_doc the identificator of the document
    constructor(address c, uint256 hash_doc, uint8 v) public{
        creator = c;
        value = hash_doc;
        creation = now;
        version = v;
    }
}