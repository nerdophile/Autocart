import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import ApolloClient from 'apollo-client'
import {InMemoryCache} from "apollo-cache-inmemory";
import {setContext} from "apollo-link-context";
import {createHttpLink} from "apollo-link-http";
import {ApolloProvider} from '@apollo/react-hooks';
import {split} from 'apollo-link';
import {WebSocketLink} from "apollo-link-ws";
import {getMainDefinition} from 'apollo-utilities';
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import ReactModal from 'react-modal';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: "#5f8ff1",
			main: "#4B6EBC",
			dark: "#30497a",
		},
		secondary: {
			main: "#FFFFFF"
		}
	}
});
// http:

const cache = new InMemoryCache();
const httpLink = createHttpLink({
	uri: `https://autocart.herokuapp.com/v1/graphql`
});

const wsLink = new WebSocketLink({
	uri: `wss://autocart.herokuapp.com/v1/graphql`,
	options: {
		reconnect: true,
		timeout: 30000,
		connectionParams: {
			headers: {
				'x-hasura-admin-secret': 'autocart@2020'
			}
		}
	}
});

const link = split(
	({query}) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);

const authLink = setContext((_, {headers}) => {
	return {
		headers: {
			...headers,
			'x-hasura-admin-secret': 'autocart@2020'
		}
	}
});

const rootEl = document.getElementById("root");
ReactModal.setAppElement(rootEl);

const client = new ApolloClient({
	cache: cache,
	link: authLink.concat(link)
});

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<App/>
			</ThemeProvider>
		</ApolloProvider>
	</BrowserRouter>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
