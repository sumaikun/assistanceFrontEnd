import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import routes from './routes'


import VueProgressBar from 'vue-progressbar'
import VueSweetalert2 from 'vue-sweetalert2'

import 'sweetalert2/dist/sweetalert2.min.css';

//Apollo and connections
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { split , from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error'

import 'vue2-dropzone/dist/vue2Dropzone.min.css'


Vue.use(VueSweetalert2);

Vue.use(VueProgressBar);


// You should use an absolute URL here
const options = {
  httpUri: process.env.VUE_GRAPHQL_HTTP_ENDPOINT || 'http://localhost:8008/graphql',
  //wsUri:   process.env.GRAPHQL_WS_ENDPOINT  || 'ws://localhost:7001/graphql',
};

let link = new HttpLink({
  uri: options.httpUri,
});

// Create the subscription websocket link if available
if (options.wsUri) {
  const wsLink = new WebSocketLink({
    uri:     options.wsUri,
    options: {
      reconnect: true,
    },
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription';
      },
      wsLink,
      link,
  );
}


const authLink = setContext((_, { headers }) => {
  //eslint-disable-next-line
  console.log("here we go")
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('authorization_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorHandler = onError(({ networkError, graphQLErrors }) => {
  //eslint-disable-next-line
  console.log("error interceptor",{ graphQLErrors, networkError})

  //eslint-disable-next-line
  //console.log("graph error", graphQLErrors[0].path[0])
  
  /*if (networkError && networkError.statusCode === 401) {
    window.location = '/login'
  }*/

  if( (graphQLErrors && graphQLErrors[0].message === "Unathorized"  
  || graphQLErrors[0].message === "Authorization header not found."
  || graphQLErrors[0].message === "TokenExpiredError")
   &&  graphQLErrors[0].path[0] != "login"
   &&  graphQLErrors[0].path[0] != "createDonation")
  {
    //eslint-disable-next-line
    console.log("Reset the system")
    localStorage.clear()
    alert("Credenciales vencidas")
    window.location = '/login'
  }

})



export const cache = new InMemoryCache();

// Create the apollo client instance
const apolloClient = new ApolloClient({
  link: from([
    errorHandler,
    authLink.concat(link)    
    ]),
  cache,
  connectToDevTools: true,
});


/*
const apolloClient = new ApolloClient({
  uri: "http://localhost:8008/graphql"
})*/

Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  router: routes,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
