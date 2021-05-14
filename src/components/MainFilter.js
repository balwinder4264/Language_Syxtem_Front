import React, { useState } from 'react';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';

const Filter = ({
  allSacreens,
  allLanguage,
  filterScreen,
  filterLanguage,
  selectedScreen,
  selectedLanguage,
}) => {
  return (
    <Row style={{ margin: 10, padding: 20 }}>
      <Col style={{ color: "white" }}>
        Screen
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedScreen ? selectedScreen.screen_name : 'Screen Search'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {allSacreens
              ? Object.values(allSacreens).map((item, index) => {
                return (
                  <Dropdown.Item onClick={() => filterScreen(item)}>
                    {item.screen_name}
                  </Dropdown.Item>
                );
              })
              : null}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col style={{ color: "white" }}>
        Language
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedLanguage ? selectedLanguage.language : 'Lanaguage Search'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {allLanguage
              ? Object.values(allLanguage).map((item, index) => {
                return (
                  <Dropdown.Item onClick={() => filterLanguage(item)}>
                    {item.language}
                  </Dropdown.Item>
                );
              })
              : null}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};
export default Filter;
