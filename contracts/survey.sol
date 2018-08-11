import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./strings.sol";

pragma solidity ^0.4.23;

contract Survey {
    using strings for *;

    // ------- Struct for holding surveyees ---
    struct surveyee {
        address surveyee;
        uint submittedTime;
        string metaData;
    }

    // ------- Struct for holding surveys ---
    struct survey {
        uint amount;
        address surveyOwner;
        surveyee[] surveyees;
        uint creationTime;
        uint expirationTime;
        bool initialized;
        string surveyURL;
        string metaData;
        bool open;
        address tokenAddress;
    }

    mapping (bytes32 => survey) public Surveys;
    uint public numSurveys = 0;
    bytes32[] public survey_indices;
}
