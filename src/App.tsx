import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import Shop from './Shop';

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Shop />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}
