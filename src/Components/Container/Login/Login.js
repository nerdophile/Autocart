import React, {useState} from 'react';
import './Login.modules.scss';
import firebase from "../../../FirebaseConfig";
import Snackbar from "@material-ui/core/Snackbar";
import {useHistory} from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";

const Login = props => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showSnackBar, setSnackbar] = useState(false);
	const [message, setMessage] = useState('Update Successful');

	const history = useHistory();

	const onClickHandler = () => {
		setLoading(true);
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((user) => {
				setLoading(false);
				history.push('/panel');
			}).catch((error) => {
			setLoading(false);
			setSnackbar(true);
			setMessage(error.message);
		})
	};


	return (
		<div className="login">
			<div className="login__main">
				<p className="login__title">autocart</p>
				<p className="login__subtitle">Please do login to continue</p>
				<input type="email"
					   className="login__input"
					   value={email}
					   onChange={(event => {
						   setEmail(event.target.value);
					   })}
					   name="email"
					   aria-label="email"
					   placeholder="EMAIL"/>

				<input type="password"
					   name="password"
					   value={password}
					   aria-label="password"
					   onChange={(event => {
						   setPassword(event.target.value);
					   })}
					   placeholder="PASSWORD"
					   className="login__input"/>

				<div className="d-flex justify-content-center" style={{width: '30%'}}>

					{loading ? <CircularProgress size={40} thickness={4.5}
						color={"secondary"}/> :
						<button
							type="button"
							className="login__button"
							disabled={!(email && password)}
							onClick={onClickHandler}
						>LOG IN</button>}

					{/*<PrimaryButton*/}
					{/*	active={true}*/}
					{/*	loading={loading}*/}
					{/*	disabled={!(email && password)}*/}
					{/*	onClick={onClickHandler}*/}
					{/*	label="L O G I N"/>*/}
				</div>
				{showSnackBar &&
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={showSnackBar}
					autoHideDuration={2000}
					message={message}
					onClose={() => {
						setSnackbar(false)
					}}
				/>}
			</div>


		</div>
	);
};


export default Login;
