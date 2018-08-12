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
        string responsesHash;
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
        uint _expirationTime,
        string _hash
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
        s.expirationTime = _expirationTime;
        s.name = _name;
        s.hash = _hash;
        s.open = true;
        s.tokenAddress = _tokenAddress;
        Surveys[strToMappingIndex(_name)] = s;

        survey_indices.push(strToMappingIndex(_name));
        numSurveys += 1;

        return true;
    }

    function submitSurveyResponse(string _name, string _responseHash, string _responsesHash) payable public returns (bool) {
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
        s.responsesHash = _responsesHash;
        s.totalResponses += 1;
        s.Responses[_responseHash] = r;

        s.remainingAmount -= _value;

        Surveys[strToMappingIndex(_name)] = s;

        return true;
    }

    // ------- getter functions -----------
    function surveyInfo(string _name) returns (string, string, uint, string) {
        return _surveyInfo(strToMappingIndex(_name));
    }

    function _surveyInfo(bytes32 index) returns (string, string, uint, string) {
        survey storage s = Surveys[index];
        return (s.name, s.hash, s.totalResponses, s.responsesHash);
    }

//    function getUserSurveys(address _surveyOwner)
//    public
//    returns (bytes32[], bytes32[])
//    {
//        uint surveysCount = survey_indices.length;
//
//         Name, Hash, Responses, Count
//        bytes32[] memory names = new bytes32[](surveysCount.length);
//        bytes32[] memory hashes = new bytes32[](surveysCount.length);
//
//        for (uint i = 0; i < surveysCount; i++) {
//            survey storage s = Surveys[survey_indices[i]];
//        }
//
//        return (names, hashes);
//    }

    // ------- helper functions -----------

    function strToMappingIndex(string memory str) returns (bytes32 result) {
        return keccak256(str);
    }

    function stringToBytes32(string memory source) returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;

        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }

        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }

        return string(bytesStringTrimmed);
    }

    function bytes32ArrayToString(bytes32[] data) returns (string) {
        bytes memory bytesString = new bytes(data.length * 32);
        uint urlLength;

        for (uint i = 0; i < data.length; i++) {
            for (uint j = 0; j < 32; j++) {
                byte char = byte(bytes32(uint(data[i]) * 2 ** (8 * j)));
                if (char != 0) {
                    bytesString[urlLength] = char;
                    urlLength += 1;
                }
            }
        }

        bytes memory bytesStringTrimmed = new bytes(urlLength);
        for (i = 0; i < urlLength; i++) {
            bytesStringTrimmed[i] = bytesString[i];
        }

        return string(bytesStringTrimmed);
    }
}
