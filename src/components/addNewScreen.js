import React, {useState} from 'react';
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
const AddNewScreen = ({getAllScreens, selectedPlatform, ipAdress}) => {
  const [addScreen, setAddScreen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [validated, setValidated] = useState(false);
  const [loading, setloading] = useState(false);
  const [screenAddedResponse, setScreenAddedResponse] = useState(null);
  const addlanguageFunc = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    let tempScreen = event.target.elements.Screen.value;
    setloading(true);
    const response = await axios.post(ipAdress + '/add_screen_admin', {
      screen_name: tempScreen,
      platform: selectedPlatform.type,
    });
    setloading(false);
    if (response) {
      if (response.data.success) {
        console.log('sucess', response);
        // setAddScreen(!addScreen);
        setScreenAddedResponse(response.data.data);
        event.target.reset();
        setloading(true);
        await getAllScreens();
        setloading(false);
      }
      setValidated(false);
      console.log('fail', response);
      setScreenAddedResponse(response.data.data);
    }
  };
  return (
    <Container>
      <Button
        onClick={() => {
          setAddScreen(!addScreen);
          setScreenAddedResponse(null);
        }}
        variant="success">
        {addScreen ? 'Cancel' : 'Add Screen'}
      </Button>
      {addScreen ? (
        <Modal show={addScreen} onHide={() => setAddScreen(!addScreen)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Screen</Modal.Title>
          </Modal.Header>
          {!addScreen && screenAddedResponse != null && showAlert ? (
            <Alert
              variant="success"
              onClose={() => setShowAlert(false)}
              dismissible>
              <Alert.Heading>Alert!</Alert.Heading>
              <p>{screenAddedResponse}</p>
            </Alert>
          ) : null}
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={addlanguageFunc}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Add Screen {' (' + selectedPlatform.type + ')'}
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="Screen"
                  placeholder="Add Screen"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
                {screenAddedResponse ? (
                  <Form.Text>{screenAddedResponse}</Form.Text>
                ) : null}
              </Form.Group>

              {!loading ? (
                <Row style={{justifyContent: 'center'}}>
                  <Button
                    style={{marginRight: 10}}
                    variant="primary"
                    type="submit">
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setAddScreen(!addScreen)}>
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
export default AddNewScreen;
