import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

// Types
import { RouterState } from 'react-router-redux';

// Components
import Identicon from '@src/views/components/Identicon';

// Assets
import logo from '@src/img/logo.svg';

const AntDHeader = Layout.Header;
const Item = Menu.Item;

interface HeaderProps extends RouterState {
  account: string;
}

class Header extends React.Component<HeaderProps, {}> {
  public render() {
    const { account, location } = this.props;

    return (
      <AntDHeader>
        <div className="logo">
          <img src={logo} /> ETHSurvey
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['/']}
          selectedKeys={[location.pathname]}
          style={{ lineHeight: '64px' }}
        >
          <Item key={'/account'} disabled>
            {account.substring(0, 4)}
            ... <Identicon address={account} size={30} />
          </Item>
          <Item key={'/survey'}>
            <Link to={'/survey'}>Take Survey</Link>
          </Item>
          <Item key={'/view'}>
            <Link to={'/view'}>View</Link>
          </Item>
          <Item key={'/create'}>
            <Link to={'/create'}>Create</Link>
          </Item>
          <Item key={'/'}>
            <Link to={'/'}>Home</Link>
          </Item>
        </Menu>
      </AntDHeader>
    );
  }
}

export default Header;
