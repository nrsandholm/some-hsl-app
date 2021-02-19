import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
  cache: new InMemoryCache(),
});

export const getStopsByLocationQuery = (lat, lon, radius) => {
  return gql`{
	  stopsByRadius(lat:${lat}, lon:${lon}, radius:${radius}) {
	    edges {
	      node {
	        stop {
	          gtfsId
	          name
	        }
	        distance
	      }
	    }
	  }
	}`;
};

export const getStopByIdQuery = (id) => {
  return gql`{
    stop (id: "${id}") {
      gtfsId
      name
      routes {
        gtfsId
        shortName
        longName
      }
    }
	}`;
};
