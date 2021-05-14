import React from 'react';
import {Container, Row, Col, Button, Dropdown} from 'react-bootstrap';

const MobileOrWeb = ({selectedPlatform, setSelectedPlatform}) => {
  let platForms = [{id: 1, type: 'Mobile'}, {id: 2, type: 'Website'}];
  return (
    <Container>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedPlatform.type}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {platForms.map((item, index) => {
            return (
              <Dropdown.Item onClick={() => setSelectedPlatform(item)}>
                {item.type}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};
export default MobileOrWeb;
