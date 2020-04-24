import React, {useState} from 'react';
import './App.scss';
import {Redirect, Route, Switch} from "react-router";
import Panel from "./Components/Container/Panel/Panel";
import Login from "./Components/Container/Login/Login";
import SnackbarContext from "./Context/SnackbarContext";
import Snackbar from "@material-ui/core/Snackbar";

function App() {
	// const [user, setUser] = useState(null);

	const [snackbar, setSnackbar] = useState(false);
	const [message, setMessage] = useState('');
	// useEffect(() => {
	// 	const sub = firebase.auth().onAuthStateChanged((user) => {
	// 		console.log(user);
	// 		setUser(user);
	// 	});
	// 	return () => {
	// 		sub();
	// 	}
	// }, []);

	return (
		<div className="App">
			<Switch>
				<Route path={"/panel"} render={() => {
					return <SnackbarContext.Provider value={{snackbar, setSnackbar, message, setMessage}}>
						<Panel/>
					</SnackbarContext.Provider>
				}}/>

				<Route path={"/login"} render={() => {
					return <Login/>
				}}/>
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
