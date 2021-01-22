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
    </>
  );
}

export default App;
