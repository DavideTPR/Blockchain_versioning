pragma solidity >=0.5.0 <0.7.0;

///@title Versioning of a document
///@author Davide Tarasconi
///@notice Smart contract that allow to save information about a version of a document
contract Versioning{
    
    //information about documents
    struct Document{
        address creator;    //creator or modifier
        string value;      //document hash
        uint creation;      //date of creation
        uint8 version;      //document version
    }

    mapping (uint256 => Document[]) public doc;    //list of the documents and relative "branch"

    //event to notify the creation of a document
    event CreateDocument(uint256 id, uint256 version);
    //event to notify the modification of a document
    event ChangeDocument(address usr, string doc, uint256 version);

    ///@dev create a new document starting the version from 0
    ///@param id document identifier
    ///@param docv document's hash
    ///@param docId document identifier
    ///@param ver document version
    function create(uint256 id, string memory docv) public returns (uint256 docId, uint256 ver){
        require(bytes(docv).length != 0, "No document");  //If document is empty don't execute
        //require(doc[id][0].value != 0, "Document already exist"); //wrong id
        
        //Create new document
        doc[id].push(Document({
            creator: msg.sender,
            value: docv,
            creation: now,
            version: 0
        }));

        return (id, 0);
    }

    ///@dev add a new version of the document
    ///@param id document identifier
    ///@param ver actual version of the document
    ///@param docv document's hash
    ///@param newVer new version value
    function update(uint256 id, uint256 ver, string memory docv) public returns (uint256 newVer){
        require(keccak256(abi.encodePacked(doc[id][ver].value)) != keccak256(abi.encodePacked(docv)), "Same file");   //Check if new file is equal to old file
        require(bytes(doc[id][ver].value).length > 0, "Document doesn't exist");  //Check if selected document exist
        
        //add new version
        doc[id].push(Document({
            creator: msg.sender,
            value: docv,
            creation: now,
            version: doc[id][ver].version+1
        }));

        emit ChangeDocument(doc[id][doc[id][ver].version+1].creator, docv, doc[id][ver].version+1);

        return doc[id][ver].version+1;
    }
    
    ///@dev get version info
    ///@param id document identifier
    ///@param ver actual version of the document
    function get(uint256 id, uint256 ver) public view returns (address creator, string memory value, uint creation, uint8
    version){
        Document memory d = doc[id][ver];
        return (d.creator, d.value, d.creation, d.version);
    }

    ///@dev get number of versions of a document
    ///@param id document identifier
    function getNumVer(uint256 id) public view returns (uint256 num){
        return doc[id].length;
    }
}