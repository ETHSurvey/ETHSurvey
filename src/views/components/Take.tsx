import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Input, InputNumber, message } from 'antd';

// Types
import { FormField } from '@src/types';
import { Survey } from '@src/types/Survey';
import { Web3State } from '@src/redux/modules/web3';

// Services
import { ipfs } from '@src/core/services';

const { TextArea } = Input;

interface TakeSurveyProps extends RouteComponentProps<{ id: string }> {
  web3State: Web3State;
}

interface TakeSurveyState {
  amount: string;
  fields: FormField[];
  name: string;
  requiredResponses: string;
  totalResponses: string;
}

class TakeSurvey extends React.Component<TakeSurveyProps, TakeSurveyState> {
  constructor(props: TakeSurveyProps) {
    super(props);

    this.onSubmitSurvey = this.onSubmitSurvey.bind(this);
    this.updateFieldValue = this.updateFieldValue.bind(this);

    this.state = {
      amount: '',
      fields: [],
      name: '',
      requiredResponses: '',
      totalResponses: ''
    };
  }

  async componentDidUpdate(prevProps: TakeSurveyProps) {
    const { match, web3State } = this.props;

    const SurveyContract: Survey = web3State.get('survey');

    const shortid = match.params.id;

    if (this.props !== prevProps && SurveyContract !== null && shortid) {
      try {
        // Get the survey form from IPFS and set it to the state
        const data = await ipfs.readFileContent(`/${shortid}/fields`);
        this.setState({ fields: JSON.parse(data) });

        SurveyContract.methods
          .surveyInfo(shortid)
          .call()
          .then(value => {
            this.setState({
              amount: value[1],
              name: value[0],
              requiredResponses: value[2],
              totalResponses: value[3]
            });
          });

        // Get the survey responses from IPFS
        // const responsesPath = `/${shortid}/responses`;

        // const files = await ipfs.getFileList(responsesPath);

        // const promises = files.map(file => {
        //   return ipfs.readFileContent(`${responsesPath}/${file.name}`);
        // });

        // const responses = await Promise.all(promises);
        // console.log(responses);
      } catch (err) {
        console.error(err);
        message.error('Error while creating Survey: ' + err.message);
      }
    }
  }

  updateFieldValue(
    field: FormField,
    index: number,
    event: React.FormEvent<HTMLInputElement>
  ) {
    field.value = event.currentTarget.value;

    const fields = this.state.fields;
    fields[index] = field;

    this.setState({ fields });
  }

  onSubmitSurvey() {
    console.log(this.state);

    const { match, web3State } = this.props;

    const account = web3State.get('accounts').get(0);
    const shortid = match.params.id;
    const SurveyContract: Survey = web3State.get('survey');

    SurveyContract.methods
      .submitSurveyResponse(shortid)
      .send({ from: account })
      .then(async () => {
        try {
          // Create responses directory to ensure it exists before saving responses
          await ipfs.createDirectory(`/${shortid}/responses`);
        } catch (e) {
          // Do nothing
        }

        // Save the survey responses to IPFS
        await ipfs.writeFileContent(
          `/${shortid}/responses/${account}`,
          this.state.fields
        );

        message.success('Response submitted successfully');
      })
      .catch(err => {
        console.error(err);
        message.error('Error while submitting response: ' + err.message);
      });
  }

  render() {
    return (
      <div style={{ padding: '0 20%' }}>
        <h1 className="text-center"> {this.state.name} </h1>

        {this.state.fields.map((field, index) => {
          return (
            <div key={index} className="m-top-30">
              <h3 className="label">{field.label}</h3>

              {field.description && (
                <p className="description">{field.description}</p>
              )}

              {field.type === 'text' && (
                <Input
                  name="label"
                  type="text"
                  onChange={e => this.updateFieldValue(field, index, e)}
                />
              )}

              {field.type === 'textarea' && (
                <TextArea
                  rows={4}
                  onChange={e => this.updateFieldValue(field, index, e)}
                />
              )}

              {field.type === 'mobile' && (
                <InputNumber
                  min={1}
                  max={10}
                  onChange={e => this.updateFieldValue(field, index, e)}
                />
              )}
            </div>
          );
        })}

        <div className="take-survey-submit">
          <Button size="large" type="primary" onClick={this.onSubmitSurvey}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default TakeSurvey;
