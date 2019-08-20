import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

pragma solidity >=0.4.22 <0.7.0;

contract SurveyContract {

    // ------- Struct for holding surveys ---
    struct survey {
        uint amount;
        uint requiredResponses;
        address admin;
        uint creationTime;
        uint expirationTime;
        string name;
        string shortid;
        address tokenAddress; // ERC20 Token

        // Keep track of the available funds
        uint remainingAmount;

        // Responses Data
        mapping(address => bool) isSurveyee;
        uint totalResponses;
    }

    mapping(bytes32 => survey) public Surveys;
    mapping(address => bytes32[]) public UserSurveys;
    uint public numSurveys = 0;
    bytes32[] public survey_indices;


    // ----- Functions -------

    function createSurvey(
        string memory _name,
        string memory _shortid,
        uint _amount,
        uint _requiredResponses,
        address _tokenAddress,
        uint _expirationTime
    )
    public
    payable
    returns (bool)
    {
        require(_tokenAddress == address(0) || msg.value == 0);

        // Transfer funds
        if (_tokenAddress != address(0)) {
            // ERC20 token
            ERC20 token = ERC20(_tokenAddress);
            require(token.transferFrom(msg.sender, address(this), _amount));
        } else {
            // Ether
            require(_amount == msg.value);
            require(msg.value > 0);
        }

        // Survey index
        bytes32 surveyIndex = strToMappingIndex(_shortid);

        // shortid must be unique
        require(Surveys[surveyIndex].admin == address(0));

        // create survey
        survey memory s = survey(_amount, _requiredResponses, msg.sender, now, _expirationTime, _name, _shortid, _tokenAddress, _amount, 0);

        Surveys[surveyIndex] = s;
        UserSurveys[msg.sender].push(surveyIndex);
        survey_indices.push(surveyIndex);

        numSurveys += 1;

        return true;
    }

    function submitSurveyResponse(string memory _shortid)
    public
    payable
    returns (bool)
    {
        bytes32 surveyIndex = strToMappingIndex(_shortid);
        survey storage s = Surveys[surveyIndex];

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

        Surveys[surveyIndex] = s;

        return true;
    }

    // ------- getter functions -----------
    function surveyInfo(string memory _shortid)
    public
    view
    returns (string memory, uint, uint, uint)
    {
        return _surveyInfo(strToMappingIndex(_shortid));
    }

    function _surveyInfo(bytes32 index)
    internal
    view
    returns (string memory, uint, uint, uint)
    {
        survey memory s = Surveys[index];
        return (s.name, s.amount, s.requiredResponses, s.totalResponses);
    }

    function getAllSurveys()
    public
    view
    returns (bytes32[] memory, bytes32[] memory, uint[] memory)
    {
        uint surveysCount = survey_indices.length;

        // Name, Shortid, Responses Count
        bytes32[] memory names = new bytes32[](surveysCount);
        bytes32[] memory shortids = new bytes32[](surveysCount);
        uint[] memory totalResponses = new uint[](surveysCount);

        for (uint i = 0; i < surveysCount; i++) {
            survey memory s = Surveys[survey_indices[i]];

            names[i] = stringToBytes32(s.name);
            shortids[i] = stringToBytes32(s.shortid);
            totalResponses[i] = s.totalResponses;
        }

        return (names, shortids, totalResponses);
    }

    function getUserSurveys(address _admin)
    public
    view
    returns (bytes32[] memory, bytes32[] memory, uint[] memory)
    {
        uint surveysCount = UserSurveys[_admin].length;

        // Name, Shortid, Responses Count
        bytes32[] memory names = new bytes32[](surveysCount);
        bytes32[] memory shortids = new bytes32[](surveysCount);
        uint[] memory totalResponses = new uint[](surveysCount);

        for (uint i = 0; i < surveysCount; i++) {
            bytes32 surveyIndex = UserSurveys[_admin][i];
            survey memory s = Surveys[surveyIndex];

            names[i] = stringToBytes32(s.name);
            shortids[i] = stringToBytes32(s.shortid);
            totalResponses[i] = s.totalResponses;
        }

        return (names, shortids, totalResponses);
    }

    // ------- helper functions -----------

    function strToMappingIndex(string memory str)
    private
    pure
    returns (bytes32 result)
    {
        return keccak256(abi.encodePacked(str));
    }

    function stringToBytes32(string memory source)
    private
    pure
    returns (bytes32 result)
    {
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
