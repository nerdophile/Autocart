import React, {useEffect, useState} from 'react';
import './App.scss';
import {Redirect, Route, Switch} from "react-router";
import Panel from "./Components/Container/Panel/Panel";
import Login from "./Components/Container/Login/Login";
import SnackbarContext from "./Context/SnackbarContext";
import Snackbar from "@material-ui/core/Snackbar";
import firebase from './FirebaseConfig';
import Customer from "./Components/Container/Customer/Customer";
import CustomerCart from "./Components/Container/Customer/CustomerCart/CustomerCart";

function App() {
	const [user, setUser] = useState('true');

	const [snackbar, setSnackbar] = useState(false);
	const [message, setMessage] = useState('');
	useEffect(() => {
		const sub = firebase.auth().onAuthStateChanged((user) => {
			setUser(user);
		});
		return () => {
			sub();
		}
	},);

	return (
		<div className="App">
			<Switch>
				<Route path={"/panel"} render={() => {
					return <SnackbarContext.Provider value={{snackbar, setSnackbar, message, setMessage}}>
						{user ? <Panel/> : <Login/>}
					</SnackbarContext.Provider>
				}}/>
				<Route exact={true} path={"/customer"} render={() => {
					return <Customer/>
				}}/>

				<Route path={"/login"} render={() => {
					return user ? <Panel/> : <Login/>
				}}/>

				<Route exact={true} path="/customer/:barcode">
					<CustomerCart/>
				</Route>
				<Redirect to={"/login"}/>
			</Switch>

			<Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
					  open={snackbar}
					  autoHideDuration={2000}
					  message={message}
					  onClose={() => {
						  setSnackbar(false)
					  }}/>
		</div>
	);
}

export default App;
