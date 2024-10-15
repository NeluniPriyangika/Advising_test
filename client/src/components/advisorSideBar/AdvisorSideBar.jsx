import React from 'react'
import './advisorSideBar.css'
import { Sidenav, Nav, Toggle } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import 'rsuite/dist/rsuite-no-reset.min.css';

function AdvisorSideBar() {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  return (
    <div className='sidebar-main' style={{ width: 240 }}>
      
      <Sidenav className='sidebar-conatiner' expanded={expanded} defaultOpenKeys={['3', '4']}>
        <Sidenav.Body className='sidebar-body'>
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            <Nav.Item eventKey="1" icon={<DashboardIcon />}>
              My Profile
            </Nav.Item>
            <Nav.Item eventKey="2" icon={<GroupIcon />}>
              Home
            </Nav.Item>
            <Nav.Item eventKey="3" icon={<GroupIcon />}>
              Message
            </Nav.Item>
            <Nav.Item eventKey="4" icon={<GroupIcon />}>
              Public Chat
            </Nav.Item>
            <hr />
            <Nav.Item eventKey="5" icon={<GroupIcon />}>
              Find Seekers
            </Nav.Item>
            <Nav.Item eventKey="6" icon={<GroupIcon />}>
              My Seekers
            </Nav.Item>
            <Nav.Item eventKey="7" icon={<GroupIcon />}>
              My Earnings
            </Nav.Item>
            <Nav.Item eventKey="8" icon={<GroupIcon />}>
              Get Paid
            </Nav.Item>
            <hr />
            <Nav.Menu placement="rightStart" eventKey="9" title="Help" icon={<MagicIcon />}>
              <Nav.Item eventKey="9-1">Find Seekers</Nav.Item>
              <Nav.Item eventKey="9-2">How to start Chat</Nav.Item>
              <Nav.Item eventKey="9-3">Payment Method</Nav.Item>
              <Nav.Item eventKey="9-4">How to Register</Nav.Item>
            </Nav.Menu>
            <Nav.Menu
              placement="rightStart"
              eventKey="10"
              title="Settings"
              icon={<GearCircleIcon />}
            >
              <Nav.Item eventKey="10-1">Applications</Nav.Item>
              <Nav.Item eventKey="10-2">Payments</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};


export default AdvisorSideBar;
