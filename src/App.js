
import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/header/Header';
import Home from './components/Home';
import Team from './components/Team';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {

  return (
    <Fragment>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
