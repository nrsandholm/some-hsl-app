import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter,
	Switch,
	Route as BrowserRoute,
  Link,
  useParams,
  Redirect,
} from 'react-router-dom';
import './index.css';
import { getStops } from './service';

const stops = getStops();

const App = () => (
	<BrowserRouter>
    <div className="App">
      <Switch>
        <BrowserRoute path="/stops/:stopId/routes">
          <Routes />
        </BrowserRoute>
        <BrowserRoute path="/stops">
          <Stops />
        </BrowserRoute>
        <BrowserRoute path="*">
          <Redirect to="/stops"/>;
        </BrowserRoute>
      </Switch>
    </div>
  </BrowserRouter>
);

const Stops = () => (
	<div className="Stops">
		{stops.map((stop) => {
      return <Stop key={stop.id} stop={stop} />
    })}
	</div>
);

const Stop = ({ stop }) => (
	<div className="Stop">
		<Link to={`/stops/${stop.id}/routes`}>{stop.name}</Link>
	</div>
);

const Routes = () => {
  const { stopId } = useParams();
  const stopIdInt = parseInt(stopId);
  const { routes } = stops.find(stop => stop.id === stopIdInt);

	return (
    <div className="Routes">
      <div>
        <Link to={`/`}>Stops</Link>
      </div>
      {routes.map((route) => {
          return <Route key={route.id} route={route} />
      })}
    </div>
  )
}

const Route = ({ route }) => (
  <div className="Route">
    <div>{route.id}</div>
    <div>{route.name}</div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
