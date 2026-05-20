import LandingPage from './pages/LandingPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
       <LandingPage />

       <Toaster position="bottom-right" />
    </>
  );
}

export default App;
