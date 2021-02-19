import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Switch,
  Route as BrowserRoute,
  Link,
  useParams,
  Redirect,
} from "react-router-dom";
import "./index.css";
import { client, getStopsByLocationQuery, getStopByIdQuery } from "./client";
import { ApolloProvider, useQuery } from "@apollo/client";

const useCoordinates = () => {
  const [coordinates, setCoordinates] = useState(null);

  if (!navigator.geolocation) {
    return {
      error: "Geolocation not supported!",
    };
  } else {
    useEffect(() => {
      function success(position) {
        setCoordinates(position.coords);
      }
      function error() {
        setCoordinates({ error: "Something went wrong!" });
      }

      const id = navigator.geolocation.watchPosition(success, error);
      return () => {
        navigator.geolocation.clearWatch(id);
      };
    });
  }

  return coordinates;
};

const App = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <div className="App">
        <Switch>
          <BrowserRoute path="/stops/:stopId/routes">
            <Routes />
          </BrowserRoute>
          <BrowserRoute path="/stops">
            <Coordinates />
          </BrowserRoute>
          <BrowserRoute path="*">
            <Redirect to="/stops" />;
          </BrowserRoute>
        </Switch>
      </div>
    </BrowserRouter>
  </ApolloProvider>
);

const Coordinates = () => {
  const coordinates = useCoordinates();

  if (coordinates == null) {
    return <div>Loading...</div>;
  }
  if (coordinates.error) {
    return <div>{coordinates.error}</div>;
  }

  return <Stops coordinates={coordinates} />;
};

const Stops = ({ coordinates }) => {
  const { loading, error, data } = useQuery(
    getStopsByLocationQuery(coordinates.latitude, coordinates.longitude, 500)
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }

  const nodes = data.stopsByRadius.edges.reduce((nodes, edge) => {
    const { node } = edge;
    return nodes.concat(node);
  }, []);

  return (
    <div className="Stops">
      {nodes.map((node) => {
        return (
          <Stop
            key={node.stop.gtfsId}
            stop={node.stop}
            distance={node.distance}
          />
        );
      })}
    </div>
  );
};

const Stop = ({ stop, distance }) => (
  <div className="Stop">
    <Link to={`/stops/${stop.gtfsId}/routes`}>{stop.name}</Link>
    <div>{distance}m</div>
  </div>
);

const Routes = () => {
  const { stopId } = useParams();

  const { loading, error, data } = useQuery(getStopByIdQuery(stopId));

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }

  const { routes } = data.stop;

  return (
    <div className="Routes">
      <div>
        <Link to={`/`}>Stops</Link>
      </div>
      {routes.map((route) => (
        <Route key={route.gtfsId} route={route} />
      ))}
    </div>
  );
};

const Route = ({ route }) => (
  <div className="Route">
    <div>{route.shortName}</div>
    <div>{route.longName}</div>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
