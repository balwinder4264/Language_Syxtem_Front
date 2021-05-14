import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Modal,
  Form,
  Alert,
  Table

} from 'react-bootstrap';
import axios from 'axios';
import MainFilter from './MainFilter';
import { BsPencilSquare } from 'react-icons/bs';
import "./wordlist.css"
const Wordlist = ({
  allSacreens,
  allLanguage,
  getWords,
  listData,
  getAllLanguages,
  selectedLanguage,
  setSelectedLanguage,
  selectedScreen,
  setSelectedSreen,
  ipAdress,
}) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [editWord, setEditWord] = useState(false);
  const [laoding, setLoading] = useState(null);
  const [validated, setValidated] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [wordAddedResponse, setWordAddedResponse] = useState(null);
  const [deployLoading, setDeployLoading] = useState(null);
  const [deployResponse, setDeployResponse] = useState(null);

  const filterScreen = async txt => {
    setSelectedSreen(txt);
    let language_id = 1;
    if (selectedLanguage) {
      language_id = selectedLanguage.id;
    }
    const data = {
      word_id: null,
      screenId: txt.id,
      language_id: language_id,
    };
    setLoading(true);
    const response = await getWords(data);
    setLoading(false);
    // if (response) {
    //   setListdata(response);
    // }
  };
  const filterLanguage = async txt => {
    console.log(' selectedScreen : ', selectedScreen);
    setSelectedLanguage(txt);
    let screen_id = null;
    if (selectedScreen) {
      screen_id = selectedScreen.id;
    }
    const data = {
      word_id: null,
      screenId: screen_id,
      language_id: txt.id,
    };
    setLoading(true);
    const response = await getWords(data);
    setLoading(false);
    // if (response) {
    //   setListdata(response);
    // }
  };
  const openModel = item => {
    setSelectedWord(item);
    console.log(selectedLanguage);
    setEditWord(!editWord);
    setValidated(false);
  };
  const addTraslation = async event => {
    console.log(selectedWord);
    let tempTranslatedWord = event.target.elements.translatedWord.value;
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    let data = {
      language_id: selectedLanguage.id,
      word_id: selectedWord.word_id,
      translation: tempTranslatedWord,
      screenId: selectedWord.screen_id,
    };
    setLoadingTranslation(true);
    const response = await axios.post(
      ipAdress + '/add_edit_translate_language_words_admin',
      data,
    );
    setLoadingTranslation(false);
    console.log("add translation response : ", response)
    if (response) {
      if (response.data) {
        if (response.data.success) {
          setWordAddedResponse(response.data);
          //  await getWords();
          // setEditWord(!editWord);
          let data1 = {
            word_id: null,
            screenId: selectedScreen.id,
            language_id: selectedLanguage.id,
          };
          setLoadingTranslation(true);
          await getWords(data1);
          const responseAllLanguage = await getAllLanguages();

          setLoadingTranslation(false);

          openModel();
          console.log('response : ', response);
          return response.data;
        }
      }
    }
  };

  const deploye_language_words = async () => {
    // selectedLanguage
    setDeployLoading(true);
    const response = await axios.post(
      ipAdress + '/deploy_new_language_version',
      selectedLanguage,
    );
    console.log(' deployResponse : ', response);
    if (response) {
      if (response.data) {
        setDeployResponse(response.data.data);
      }
    }
    const responseAllLanguage = await getAllLanguages();
    console.log('responseAllLanguage : ', responseAllLanguage);

    setDeployLoading(false);
  };
  console.log("wordAddedResponse :", wordAddedResponse)
  return (
    <Container style={styles.table, { maxWidth: 2500, }}>
      {deployResponse ? (
        <Alert
          variant="success"
          onClose={() => setDeployResponse(null)}
          dismissible>
          <Alert.Heading>Alert!</Alert.Heading>
          <p>{deployResponse}</p>
        </Alert>
      ) : null}

      <MainFilter
        allSacreens={allSacreens}
        allLanguage={allLanguage}
        filterScreen={txt => filterScreen(txt)}
        filterLanguage={txt => filterLanguage(txt)}
        selectedScreen={selectedScreen}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={txt => setSelectedLanguage(txt)}
      />
      {selectedLanguage ? (
        selectedLanguage.current_version != selectedLanguage.new_version ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {!deployLoading ? (
              <Button variant="danger" onClick={() => deploye_language_words()}>
                Deploy
              </Button>
            ) : (
                <Spinner animation="border" variant="primary" />
              )}
          </div>
        ) : null
      ) : null}
      <Table striped bordered hover variant="dark" className=" table table-fixed" >
        <thead >
          <tr>
            <th>#</th>
            <th>String</th>
            <th>Screen</th>
            {selectedLanguage ? (
              selectedLanguage.id != 1 ? (
                <>
                  <th>Translation</th>
                  <th>Edit</th>
                </>
              ) : null
            ) : null}
          </tr>
        </thead>

        {!laoding ? (
          listData && allSacreens ? (
            listData.map((item, index) => {

              // if (item.language_id == selectedLanguage.id) {
              return (
                <tbody >
                  <tr >
                    <td>{index}</td>
                    <td>{item.english_string}</td>
                    <td> {allSacreens[item.screen_id]
                      ? allSacreens[item.screen_id].screen_name
                      : null}</td>
                    {selectedLanguage ? (
                      selectedLanguage.id != 1 ? (
                        <>  <td> {item.translation ? item.translation : 'No data'}
                          {wordAddedResponse ? (

                            wordAddedResponse.data.word_id == item.word_id ? <Alert
                              variant="success"
                              onClose={() => setWordAddedResponse(null)}
                              dismissible>
                              <Alert.Heading>Alert!</Alert.Heading>
                              <p>{wordAddedResponse.data.message}</p>
                            </Alert> : null
                          ) : null}
                        </td>
                          <td style={{ color: "red" }}><BsPencilSquare onClick={() => openModel(item)} /></td>
                        </>
                      ) : null
                    ) : null}
                  </tr>
                </tbody>
              );
              // }
            })
          ) : null
        ) : (
            <Spinner animation="border" variant="primary" />
          )}
      </Table>
      <Modal show={editWord}>
        <Modal.Header closeButton onHide={() => setEditWord(!editWord)}>
          <Modal.Title>
            {selectedLanguage != null ? selectedLanguage.language : null}{' '}
            translation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={addTraslation}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ color: 'green', fontWeight: 'bold' }}>
                English Word/Sentence
              </Form.Label>
              <div style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>
                {selectedWord != null ? selectedWord.english_string : null}
              </div>
              <Form.Label>
                Enter{' '}
                {selectedLanguage != null ? selectedLanguage.language : null}{' '}
                translation
              </Form.Label>
              <Form.Control
                required
                defaultValue={selectedWord ? selectedWord.translation : null}
                as="textarea"
                rows={3}
                placeholder="type here"
                name="translatedWord"
              />
              <Row style={{ justifyContent: 'center', margin: 10 }}>
                {!loadingTranslation ? (
                  <Button
                    style={{ marginRight: 10, }}
                    variant="success"
                    type="submit">
                    Add
                  </Button>
                ) : (
                    <Spinner animation="border" variant="primary" />
                  )}
                <Button variant="danger" onClick={() => openModel()}>
                  Cancel
                </Button>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
export default Wordlist;
const styles = {
  table: {
    border: ' 1px solid',


  },
  tableheading: {
    color: 'red',
    fontWeight: 'bold',
  },
};


