import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import AddNewlanguageType from '../components/addLanguageType';
import AddNewScreen from '../components/addNewScreen';
import AddNewWord from '../components/addNewWord';
import MainFilter from '../components/MainFilter';
import WordList from '../components/WordList';
import axios from 'axios';
import MobileOrWeb from '../components/mobileOrWeb';
// const ipAdress = 'https://cloud.myopulence.com/live/api/translate';
const ipAdress = 'http://192.168.75.204:8000/api';
//ceasar local 
// const ipAdress = 'http://192.168.75.161:8000'
const Language = () => {
  const [allSacreens, setAllScreens] = useState(null);
  const [allLanguage, setAllLanguage] = useState(null);
  const [listData, setListdata] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedScreen, setSelectedSreen] = useState({
    id: null,
    screen_name: 'All',
    reg_date: '2021-04-20 16:35:01',
  });
  const [selectedPlatform, setSelectedPlatform] = useState({
    id: 1,
    type: 'Mobile',
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const useefctFuncOnly = async () => {
      setLoading(true);
      await getAllScreens();
      await getAllLanguages();
      await getWords();
      setSelectedLanguage(null);
      setSelectedSreen({
        id: null,
        screen_name: 'All',
        reg_date: '2021-04-20 16:35:01',
      });
      setLoading(false);
      // if (screenReponse) {
      //   setAllScreens(screenReponse);
      // }
      // if (languageResponse) {
      //   setAllLanguage(languageResponse);
      // }
    };
    useefctFuncOnly();
  }, [0, selectedPlatform]);
  const getAllScreens = async () => {
    const response = await axios.post(ipAdress + '/get_screen_admin', {
      platform: selectedPlatform.type,
    });

    if (response) {
      if (response.data) {
        if (response.data.success) {
          console.log('all screens  : ', response.data.data);
          setAllScreens(response.data.data);

          return response.data.data;
        }
      }
    }
  };
  const getAllLanguages = async () => {
    const response = await axios.post(ipAdress + '/get_language_types_admin');
    if (response) {
      if (response.data) {
        if (response.data.success) {
          setAllLanguage(response.data.data);
          if (selectedLanguage) {
            setSelectedLanguage(response.data.data[selectedLanguage.id]);
          }

          return response.data.data;
        }
      }
    }
  };
  const getWords = async data => {
    // setLoading(true);
    if (!data) {
      data = {
        word_id: 0,
        screenId: selectedScreen.id,
        language_id: 1,
      };
    }
    data.platform = selectedPlatform.type;
    let formData = new FormData();
    formData.append('word_id', data.word_id);
    formData.append('screenId', data.screenId);
    formData.append('language_id', data.language_id);
    formData.append('platform', data.platform);

    const response = await axios(
      ipAdress + '/get_translate_language_words_admin',
      {
        method: 'post',
        data: formData,
      },
    );
    // setLoading(false);
    console.log('response get words:', response);
    if (response) {
      if (response.data) {
        if (response.data.success) {
          setListdata(response.data.data);
          return response.data.data;
        }
      }
    }
  };
  return (
    <Container style={styles.mainContainer}>
      {loading ? (
        <div
          style={{
            position: 'fixed',
            overflow: 'show',
            margin: 'auto',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background:
              'radial-gradient(rgba(20, 20, 20,.8), rgba(0, 0, 0, .8))',
          }}>
          <Spinner
            style={{
              position: 'fixed',
              margin: 'auto',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,

            }}
            animation="border"
            variant="primary"
          />
        </div>
      ) : null}

      <div style={{ display: 'flex', }}>
        <div style={styles.divSpace}>
          <MobileOrWeb
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={txt => setSelectedPlatform(txt)}
          />
        </div>
        <div style={styles.divSpace}>
          <AddNewScreen
            selectedPlatform={selectedPlatform}
            getAllScreens={() => getAllScreens()}
            ipAdress={ipAdress}
          />
        </div>
        <div style={styles.divSpace}>
          <AddNewlanguageType
            getAllLanguages={() => getAllLanguages()}
            ipAdress={ipAdress}
          />
        </div>

        <div style={styles.divSpace}>
          <AddNewWord
            getWords={data => getWords(data)}
            getAllScreens={() => getAllScreens()}
            allSacreens={allSacreens}
            getAllLanguages={() => getAllLanguages()}
            selectedLanguage={selectedLanguage}
            selectedPlatform={selectedPlatform}
            ipAdress={ipAdress}
          />
        </div>
      </div>

      <div style={styles.divSpace}>
        <WordList
          allSacreens={allSacreens}
          allLanguage={allLanguage}
          getWords={data => getWords(data)}
          listData={listData}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          getAllLanguages={() => getAllLanguages()}
          selectedScreen={selectedScreen}
          setSelectedSreen={txt => setSelectedSreen(txt)}
          ipAdress={ipAdress}
        />
      </div>
    </Container>
  );
};
export default Language;

const styles = {
  mainContainer: {
    backgroundColor: "#343a40",
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid',
    marginTop: '20px',
    boxShadow: '10px 10px 10px #9e9e9e',
    maxWidth: 2500,
  },
  divSpace: {
    margin: '10px',

  },
};
