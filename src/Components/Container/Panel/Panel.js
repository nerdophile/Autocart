import React from 'react';
import "./Panel.modules.scss";
import {Redirect, Route, Switch} from "react-router";

import Nav from "./Nav/Nav";
import Billing from "./Billing/Billing";
import Product from "./Product/Product";
import Cart from "./Cart/Cart";
import Category from "./Category/Category";
import BillingDetails from "./Billing/BillingDetails/BillingDetails";
import Payment from "./Billing/Payment/Payment";


const Panel = (props) => {
	return (
		<div className="panel">
			<div className="panel__nav ">
				<Nav/>
			</div>
			<div className="panel__main box-shadow-sm ">

				<Switch>
					<Route exact={true} path="/panel/billing">
						<Billing/>
					</Route>

					<Route exact={true} path="/panel/billing/:barcode">
						<BillingDetails/>
					</Route>

					<Route exact={true} path="/panel/payment/:barcode">
						<Payment/>
					</Route>

					<Route exact={true} path="/panel/products">
						<Product/>
					</Route>
					<Route exact={true} path="/panel/cart">
						<Cart/>
					</Route>
					<Route exact={true} path="/panel/category">
						<Category/>
					</Route>


					<Redirect to="/panel/billing"/>
				</Switch>

			</div>
		</div>


	);
};

export default Panel;
