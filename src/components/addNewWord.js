import React, {useState, useEffect} from 'react';
import {
  Container,
  Form,
  Col,
  Button,
  FormControl,
  Spinner,
  Alert,
  Dropdown,
  Modal,
  Row,
} from 'react-bootstrap';
import axios from 'axios';
const AddNewWord = ({
  getWords,
  getAllScreens,
  allSacreens,
  getAllLanguages,
  selectedPlatform,
  ipAdress,
}) => {
  const [addWord, setAddWord] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [validated, setValidated] = useState(false);
  const [loading, setloading] = useState(false);
  const [wordAddedResponse, setWordAddedResponse] = useState(null);
  const [selectedScreen, setScreenSelected] = useState(null);
  const [screens, setScreens] = useState(allSacreens);
  console.log('allSacreens : ', allSacreens);
  useEffect(() => {
    const useffectFunOnly = async () => {
      await getAllScreens();
    };
    useffectFunOnly();
  }, [0]);

  const addWordFunc = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    // setValidated(true);
    let tempScreen = event.target.elements.Word.value;
    setloading(true);
    const response = await axios.post(ipAdress + '/add_new_word_admin', {
      english_string: tempScreen,
      screenId: selectedScreen.id,
      platform: selectedPlatform.type,
    });
    setloading(false);
    if (response) {
      if (response.data.success) {
        console.log('sucess', response);
        // setAddWord(!addWord);
        event.target.reset();
        setWordAddedResponse(response.data.data);
        // setScreenSelected(null);
        setloading(true);
        await getWords();
        await getAllLanguages();
        setloading(false);
      }
      // setValidated(false);
      setWordAddedResponse(response.data.data);
    }
  };
  const closeModal = () => {
    setAddWord(!addWord);
    setWordAddedResponse(null);
  };
  return (
    <Container>
      <Button
        onClick={() => {
          closeModal();
        }}
        variant="success">
        {addWord ? 'Cancel' : 'Add Word'}
      </Button>
      {addWord ? (
        <Modal show={addWord} onHide={() => closeModal()}>
          {!addWord && wordAddedResponse != null && showAlert ? (
            <Alert
              variant="success"
              onClose={() => setShowAlert(false)}
              dismissible>
              <Alert.Heading>Alert!</Alert.Heading>
              <p>{wordAddedResponse}</p>
            </Alert>
          ) : null}
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {addWord ? (
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedScreen
                    ? selectedScreen.screen_name
                    : 'Select Screen'}
                </Dropdown.Toggle>

                {allSacreens ? (
                  <Dropdown.Menu>
                    {Object.values(allSacreens).map((item, index) => {
                      if (item.id) {
                        return (
                          <Dropdown.Item
                            onClick={() => setScreenSelected(item)}>
                            {item.screen_name}
                          </Dropdown.Item>
                        );
                      }
                    })}
                  </Dropdown.Menu>
                ) : null}
              </Dropdown>
            ) : null}

            {addWord && selectedScreen ? (
              <Form noValidate validated={validated} onSubmit={addWordFunc}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>
                    Add Word{' '}
                    {selectedScreen ? 'to ' + selectedScreen.screen_name : null}
                    {' (' + selectedPlatform.type + ')'}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    type="text"
                    name="Word"
                    placeholder="Add Word"
                  />
                  {wordAddedResponse ? (
                    <Form.Text>{wordAddedResponse}</Form.Text>
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
                      variant="primary"
                      type="submit"
                      onClick={() => closeModal()}>
                      Cancel
                    </Button>
                  </Row>
                ) : (
                  <Spinner animation="border" variant="primary" />
                )}
              </Form>
            ) : null}
          </Modal.Body>
        </Modal>
      ) : null}
    </Container>
  );
};
export default AddNewWord;
