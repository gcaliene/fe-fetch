import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Search from './pages/Search';
import Match from './pages/Match';

function App() {
  return (
    <ChakraProvider>
      <Router basename="/fe-fetch">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/match" element={
            <ProtectedRoute>
              <Match />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
