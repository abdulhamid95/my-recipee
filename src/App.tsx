import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Register from './pages/register';
import Login from './pages/login';
import AppTabs from './appTabs';
import Menu from './components/Menu/menu';
import AuthContextProvider from './context/AuthContext';


const App: React.FC = () => (
  <IonApp>
    <AuthContextProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/account/register">
            <Register />
          </Route>
          <Route exact path="/account/login">
            <Login />
          </Route>
          <Route path="/my-recipe">
            <IonSplitPane contentId="menu">
              <Menu />
              <IonRouterOutlet id="menu">
                <AppTabs /> 
              </IonRouterOutlet>
            </IonSplitPane>
          </Route>
          <Redirect exact path="/" to="/my-recipe/all-posts" />
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthContextProvider>
  </IonApp>
);

export default App;
