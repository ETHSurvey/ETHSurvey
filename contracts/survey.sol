import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

pragma solidity ^0.4.23;

contract Survey {

    // ------- Struct for holding surveyees ---
    struct response {
        address surveyee;
        uint submittedTime;
        string hash;
    }

    // ------- Struct for holding surveys ---
    struct survey {
        uint amount;
        uint requiredResponses;
        address surveyOwner;
        uint creationTime;
        uint expirationTime;
        string name;
        string hash;
        address tokenAddress;
        bool open;

        // Keep track of the available funds
        uint remainingAmount;

        // Responses Data
        mapping(address => bool) isSurveyee;
        string[] responseHashes;
        uint totalResponses;
        mapping(string => response) Responses;
    }

    mapping(bytes32 => survey) public Surveys;
    uint public numSurveys = 0;
    bytes32[] public survey_indices;


    // ----- Functions -------

    function createSurvey(
        string memory _name,
        uint _amount,
        uint _requiredResponses,
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
        s.remainingAmount = _amount;
        s.requiredResponses = _requiredResponses;
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

    function submitSurveyResponse(string _name, string _responseHash) payable public returns (bool) {
        survey storage s = Surveys[strToMappingIndex(_name)];

        // Check if surveyee is the survey owner
        require(s.surveyOwner != msg.sender);

        // Check if there's funding available to transfer to the surveyee
        require(s.amount != 0 && s.remainingAmount != 0);

        // Check if the user had already submitted response
        require(!s.isSurveyee[msg.sender]);

        // Add response to Survey
        response storage r;
        r.surveyee = msg.sender;
        r.submittedTime = now;
        r.hash = _responseHash;

        // Transfer funds to the surveyee
        uint _value = s.amount / s.requiredResponses;

        if (s.tokenAddress != 0x0) {
            // ERC20
            StandardToken token = StandardToken(s.tokenAddress);
            require(token.transfer(msg.sender, _value));
        } else {
            // ETH
            msg.sender.transfer(_value);
        }

        // Update survey data in the Surveys Map
        s.isSurveyee[msg.sender] = true;
        s.responseHashes.push(_responseHash);
        s.totalResponses += 1;
        s.Responses[_responseHash] = r;

        s.remainingAmount -= _value;

        Surveys[strToMappingIndex(_name)] = s;

        return true;
    }

    // ------- getter functions -----------
    function surveyDetails(string _name) returns (uint, uint, address, address, string, uint, string, uint) {
        return _surveyDetails(strToMappingIndex(_name));
    }

    function _surveyDetails(bytes32 index) returns (uint, uint, address, address, string, uint, string, uint) {
        survey storage s = Surveys[index];
        return (
            s.amount,
            s.requiredResponses,
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
