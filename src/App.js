import { Route, Switch ,BrowserRouter as Router} from 'react-router-dom'
import Dashboard from './components/SpacexDashboard/index.js'
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Dashboard} />
        </Switch>
      </Router>
       {/* <h1>Hello Romal!</h1> */}
    </>
  );
}

export default App;
