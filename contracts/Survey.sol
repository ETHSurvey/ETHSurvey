import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

pragma solidity ^0.4.23;

contract Survey {

    // ------- Struct for holding surveys ---
    struct survey {
        uint amount;
        uint requiredResponses;
        address admin;
        uint creationTime;
        uint expirationTime;
        string name;
        address tokenAddress; // ERC20 Token

        // Keep track of the available funds
        uint remainingAmount;

        // Responses Data
        mapping(address => bool) isSurveyee;
        uint totalResponses;
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
        uint _expirationTime
    ) payable public returns (bool) {
        require(_tokenAddress == address(0) || msg.value == 0);

        // Transfer funds
        if (_tokenAddress != address(0)) {
            // ERC20 token
            ERC20 token = ERC20(_tokenAddress);
            require(token.transferFrom(msg.sender, this, _amount));
        } else {
            // Ether
            require(_amount == msg.value);
            require(msg.value > 0);
        }

        // only one survey per name at a time
        require(Surveys[strToMappingIndex(_name)].admin == address(0));

        // create survey
        survey storage s;
        s.amount = _amount;
        s.remainingAmount = _amount;
        s.requiredResponses = _requiredResponses;
        s.admin = msg.sender;
        s.creationTime = now;
        s.expirationTime = _expirationTime;
        s.name = _name;
        s.tokenAddress = _tokenAddress;
        Surveys[strToMappingIndex(_name)] = s;

        survey_indices.push(strToMappingIndex(_name));
        numSurveys += 1;

        return true;
    }

    function submitSurveyResponse(string _name) payable public returns (bool) {
        survey storage s = Surveys[strToMappingIndex(_name)];

        // Check if surveyee is the survey owner
        require(s.admin != msg.sender);

        // Check if there's funding available to transfer to the surveyee
        require(s.amount != 0 && s.remainingAmount != 0);

        // Check if the user had already submitted response
        require(!s.isSurveyee[msg.sender]);

        // Transfer funds to the surveyee
        uint _value = s.amount / s.requiredResponses;

        if (s.tokenAddress != address(0)) {
            // ERC20
            ERC20 token = ERC20(s.tokenAddress);
            require(token.transfer(msg.sender, _value));
        } else {
            // ETH
            msg.sender.transfer(_value);
        }

        // Update survey data in the Surveys Map
        s.isSurveyee[msg.sender] = true;
        s.totalResponses += 1;

        s.remainingAmount -= _value;

        Surveys[strToMappingIndex(_name)] = s;

        return true;
    }

    // ------- getter functions -----------
    function surveyInfo(string _name) returns (uint) {
        return _surveyInfo(strToMappingIndex(_name));
    }

    function _surveyInfo(bytes32 index) returns (uint) {
        survey storage s = Surveys[index];
        return (s.totalResponses);
    }

    function getUserSurveys(address _admin)
    public
    returns (bytes32[], uint[])
    {
        uint surveysCount = survey_indices.length;

        // Name, Responses Count
        bytes32[] memory names = new bytes32[](surveysCount);
        uint[] memory totalResponses = new uint[](surveysCount);

        for (uint i = 0; i < surveysCount; i++) {
            survey storage s = Surveys[survey_indices[i]];

            if (s.admin == _admin) {
                names[i] = stringToBytes32(s.name);
                totalResponses[i] = s.totalResponses;
            }
        }

        return (names, totalResponses);
    }

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

        return result;
    }
}
