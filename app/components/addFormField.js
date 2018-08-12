import React from 'react';
import { Button, Modal, Form, Input, Radio, Icon, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class AddFormField extends React.Component {

    constructor(props) {
      super(props);
  
      this.state = {
        visible: false,
        label: '',
        description: '',
        type: '',
      }
    }

    showModal() {
      this.setState({
        visible: true,
      });
      this.resetState();
    }
  
    handleCancel(e) {
      console.log(e);
      this.setState({
        visible: false,
      });
      this.resetState();
    }

    resetState() {
      this.setState({
        label: '',
        description: '',
        type: '',
      });
    }
  

    handleOk(e) {
      this.props.submit(this.state);
      this.setState({
        visible: false,
      });
      this.resetState();
    }

    handleChange(value) {
      this.setState({ type: value });
    }
  
    render(){
      return (
        <div>
          <Button type="dashed" className="add-button m-top-40" onClick={this.showModal.bind(this)}>
            <Icon type="plus" /> Add Input field
          </Button>
          <Modal
            title="Buidl the field"
            visible={this.state.visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
          > 
            <h4>Enter the title</h4>
            <Input onChange={e => this.setState({ label: e.target.value })} value={this.state.label} name="label" type="text"/>
            <h4 className="m-top-30">Enter the description if any</h4>
            <Input onChange={e => this.setState({ description: e.target.value })} value={this.state.description} name="description" type="text"/>
            <h4 className="m-top-30">Enter the type of form field</h4>
            <Select defaultValue={this.state.type} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
              <Option value="text">Short Text</Option>
              <Option value="phoneNumber">Phone Number</Option>
              <Option value="textarea">Long Text</Option>
            </Select>
          </Modal>
        </div>
      );
    }
  }

export default AddFormField;