import React from 'react';
import './Nav.modules.scss';
import {NavLink} from "react-router-dom";
import firebase from "../../../../FirebaseConfig";
import {useHistory} from "react-router";


const Nav = (props) => {
	const history = useHistory();
	const logout = () => {
		firebase.auth().signOut().then((data) => {
			history.push('/login');
		})
	};

	return (
		<div className="nav">
			<div className="nav__logo">
				<NavLink to="/panel">
					<p className="nav__logo">autocart</p>
				</NavLink>
			</div>

			<div className="nav__items">

				<NavLink to="/panel/billing"
						 activeClassName="nav__item-selected">
					<p>Billing</p>
				</NavLink>
				<NavLink to="/panel/products" activeClassName="nav__item-selected">
					<p>Products</p>
				</NavLink>
				<NavLink to="/panel/cart" activeClassName="nav__item-selected">
					<p>Cart</p>
				</NavLink>
				<NavLink to="/panel/category" activeClassName="nav__item-selected">
					<p>Category</p>
				</NavLink>

			</div>

			<p className="nav__sign-out"
			   onClick={logout}

			>sign out</p>
		</div>
	);
};


export default Nav;
