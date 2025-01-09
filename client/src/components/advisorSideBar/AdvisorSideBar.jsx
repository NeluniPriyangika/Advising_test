import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import 'rsuite/dist/rsuite-no-reset.min.css';

function AdvisorSideBar() {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  const navigate = useNavigate();
  const { advisorId } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  // Verify if the current user has access to this advisor route
  const verifyAccess = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return false;
    }
    
    // Check if the user is an advisor and if they're accessing their own routes
    if (user.userType === 'advisor' && user.userId === userId) {
      return true;
    }
    
    // Redirect to home if unauthorized
    navigate('/');
    return false;
  };

  const handleSelect = (eventKey) => {
    if (!verifyAccess()) return;
    
    setActiveKey(eventKey);
    
    // Use userId instead of advisorId for routes
    const routes = {
      '1': `/advisor-profile/${userId}`,
      '2': `/advisor-home/${userId}`,
      '3': `/advisor-messages/${userId}`,
      '4': `/advisor-public-chat/${userId}`,
      '5': `/advisor-find-seekers/${userId}`,
      '6': `/advisor-my-seekers/${userId}`,
      '7': `/advisor-earnings/${userId}`,
      '8': `/advisor-payments/${userId}`,
      '9-1': `/advisor-help/find-seekers/${userId}`,
      '9-2': `/advisor-help/start-chat/${userId}`,
      '9-3': `/advisor-help/payment-method/${userId}`,
      '9-4': `/advisor-help/registration/${userId}`,
      '10-1': `/advisor-settings/applications/${userId}`,
      '10-2': `/advisor-settings/payments/${userId}`,
    };

    if (routes[eventKey]) {
      navigate(routes[eventKey]);
    }
  };

  return (
    <div className="advisor-sidebar-main" style={{ width: 240 }}>
      <Sidenav
        className="advisor-sidebar-container"
        expanded={expanded}
        defaultOpenKeys={['3', '4']}
      >
        <Sidenav.Body className="advisor-sidebar-body">
          <Nav activeKey={activeKey} onSelect={handleSelect}>
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
            <Nav.Menu
              placement="rightStart"
              eventKey="9"
              title="Help"
              icon={<MagicIcon />}
            >
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
}

export default AdvisorSideBar;