import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Language from './screens/language';
function App() {
  return (
    <Container style={{ backgroundColor: '#F5F5F5', display: 'flex', maxWidth: "1800px" }}>
      <Language />
    </Container>
  );
}

export default App;
