import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
// import Biodata from './pages/Biodata'
// import Screening from './pages/Screening'
import DataRemaja from './pages/DataRemaja'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/biodata" element={<Biodata />} />
        <Route path="/screening" element={<Screening />} /> */}
        <Route path="/data-kunjungan" element={<DataRemaja />} />
      </Routes>
    </Router>
  )
}

export default App
