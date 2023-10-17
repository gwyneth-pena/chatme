import { AuthContextProvider } from './utils/AuthContext';
import { ChatContextProvider } from './utils/ChatContext';
import Routes from './routes/Routes';

function App() {

  return (
    <>
    <AuthContextProvider>
      <ChatContextProvider>
        <Routes/>
      </ChatContextProvider>
    </AuthContextProvider>
    </>
  );
}

export default App;
