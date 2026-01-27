import React from 'react';
import {NativeBaseProvider, ToastProvider} from 'native-base';
import Auth from './components/context/Auth';
import Logic from './components/context/Logic';
import Khuudasnuud from './pages';

function App() {
  return (
    <NativeBaseProvider>
      <ToastProvider>
        <Auth>
            <Logic>
                <Khuudasnuud />
            </Logic>
        </Auth>
      </ToastProvider>
    </NativeBaseProvider>
  );
}

export default App;
