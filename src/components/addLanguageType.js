import React, { useState } from 'react';
import {
  Container,
  Form,
  Col,
  Button,
  FormControl,
  Spinner,
  Alert,
  Modal,
  Row,
} from 'react-bootstrap';
import axios from 'axios';
const LanguageType = ({ getAllLanguages, ipAdress }) => {
  const [addLanguage, setAddLanguage] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [validated, setValidated] = useState(false);
  const [loading, setloading] = useState(false);
  const [languageAddedResponse, setLanguageAddedResponse] = useState(null);

  const addlanguageFunc = async event => {
    event.preventDefault();

    // console.log(frm);
    // frm.reset();


    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    // setValidated(true);
    let tempLanguage = event.target.elements.language.value;
    setloading(true);
    const response = await axios.post(ipAdress + '/add_language_types_admin', {
      language: tempLanguage,
    });

    // let response1 = await fetch(ipAdress + '/add_language_types_admin', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     Accept: 'application/json',
    //   },
    //   body: JSON.stringify({language: tempLanguage}),
    // });
    // console.log(response1);
    // let response = await response1.json();
    // console.log('sucess', response);

    setloading(false);
    // return;
    if (response) {
      if (response.data.success) {
        console.log('sucess', response);
        // setAddLanguage(!addLanguage);
        setLanguageAddedResponse(response.data.data);
        setloading(true);
        await getAllLanguages();
        setloading(false);
        // event.target.reset();
      }
      setValidated(false);
      console.log('fail', response);
      setLanguageAddedResponse(response.data.data);
    }
  };
  return (
    <Container>
      <Button
        onClick={() => {
          setAddLanguage(!addLanguage);
          setLanguageAddedResponse(null);
        }}
        variant="success">
        {addLanguage ? 'Cancel' : 'Add Language'}
      </Button>
      {addLanguage ? (
        <Modal show={addLanguage}>
          <Modal.Header closeButton onHide={() => setAddLanguage(!addLanguage)}>
            <Modal.Title>Add Language</Modal.Title>
          </Modal.Header>
          {!addLanguage && languageAddedResponse != null && showAlert ? (
            <Alert
              variant="success"
              onClose={() => setShowAlert(false)}
              dismissible>
              <Alert.Heading>Alert!</Alert.Heading>
              <p>{languageAddedResponse}</p>
            </Alert>
          ) : null}
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={addlanguageFunc}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Add language</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="language"
                  placeholder="Add language"
                />
                {languageAddedResponse ? (
                  <Form.Text>{languageAddedResponse}</Form.Text>
                ) : null}
              </Form.Group>

              {!loading ? (
                <Row style={{ justifyContent: 'center' }}>
                  <Button
                    style={{ marginRight: 10 }}
                    variant="primary"
                    type="submit">
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setAddLanguage(!addLanguage)}>
                    Cancel
                  </Button>
                </Row>
              ) : (
                  <Spinner animation="border" variant="primary" />
                )}
            </Form>
          </Modal.Body>
        </Modal>
      ) : null}
    </Container>
  );
};
export default LanguageType;
