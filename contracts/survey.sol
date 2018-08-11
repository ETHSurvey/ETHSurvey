import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

pragma solidity ^0.4.23;

contract Survey {

    // ------- Struct for holding surveyees ---
    struct surveyee {
        address surveyee;
        uint submittedTime;
        string hash;
    }

    // ------- Struct for holding surveys ---
    struct survey {
        uint amount;
        uint numResponses;
        address surveyOwner;
        uint creationTime;
        uint expirationTime;
        string name;
        string hash;
        address tokenAddress;
        bool open;

        // Surveyees Data
        bytes32[] surveyees;
        uint numSurveyees;
        mapping(bytes32 => surveyee) surveyeeStructs;
    }

    mapping(bytes32 => survey) public Surveys;
    uint public numSurveys = 0;
    bytes32[] public survey_indices;


    // ----- Functions -------

    function createSurvey(
        string memory _name,
        uint _amount,
        uint _numResponses,
        address _tokenAddress,
        uint _expirationTimeDelta,
        string memory _hash
    ) payable public returns (bool) {
        require(_tokenAddress == 0x0 || msg.value == 0);

        // Transfer funds
        if (_tokenAddress != 0x0) {
            // ERC20 token
            StandardToken token = StandardToken(_tokenAddress);
            require(token.transferFrom(msg.sender, this, _amount));
        } else {
            // Ether
            require(_amount == msg.value);
            require(msg.value > 0);
        }

        // only one survey per name at a time
        require(Surveys[strToMappingIndex(_name)].open == false);

        // create survey
        survey storage s;
        s.amount = _amount;
        s.numResponses = _numResponses;
        s.surveyOwner = msg.sender;
        s.creationTime = now;
        s.expirationTime = now + _expirationTimeDelta;
        s.name = _name;
        s.hash = _hash;
        s.open = true;
        s.tokenAddress = _tokenAddress;
        Surveys[strToMappingIndex(_name)] = s;

        survey_indices.push(strToMappingIndex(_name));
        numSurveys += 1;

        return true;
    }

    // ------- getter functions -----------
    function surveyDetails(string _name) returns (uint, address, address, string, uint, string, uint) {
        return _surveyDetails(strToMappingIndex(_name));
    }

    function _surveyDetails(bytes32 index) returns (uint, address, address, string, uint, string, uint) {
        survey storage s = Surveys[index];
        return (
            s.amount,
            s.tokenAddress,
            s.surveyOwner,
            s.name,
            s.creationTime,
            s.hash,
            s.expirationTime
        );
    }

    function strToMappingIndex(string memory str) returns (bytes32 result) {
        return keccak256(str);
    }
}
