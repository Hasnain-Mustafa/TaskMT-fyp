import Landing from 'pages/Landing';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};
export default App;
