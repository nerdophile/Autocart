import React, {useContext, useEffect, useState} from 'react';
import './Customer.modules.scss';
import Webcam from "../Panel/Billing/Webcam/Webcam";
import {useHistory} from "react-router";
import scan from '../../../Assests/Images/scan-white.png';
import gql from "graphql-tag/src";
import {useApolloClient} from "@apollo/react-hooks";
import SnackbarContext from "../../../Context/SnackbarContext";
import {CircularProgress} from "@material-ui/core";

const CheckCartBarcode = gql`
    query CartBarcodeCheck($barcode: String!) {
        Cart(where: {barcode: {_eq: $barcode}}) {
            id
            barcode
            name
        }
    }



`;

const Customer = (props) => {

	const client = useApolloClient();
	const history = useHistory();

	const [showScanner, setShowScanner] = useState(false);
	const [queryLoading, setQueryLoading] = useState(false);
	const {setSnackbar, setMessage} = useContext(SnackbarContext);


	useEffect(() => {

	})

	const appendMessage = (message) => {
		setQueryLoading(true);
		client.query({
			query: CheckCartBarcode,
			variables: {
				barcode: message
			}
		}).then(({data}) => {
			if (data['Cart'].length > 0) {
				setQueryLoading(false);
				return history.push(`/customer/${message}/${data['Cart'][0].id}`);
			} else {
				setQueryLoading(false);
				setSnackbar(true);
				setMessage(`Cart with that barcode doesn't exists`);
			}
		})
		// console.log(message);
	};

	return (
		<div className="customer">
			<div className="customer__main">
				<p className="customer__header">autocart</p>
				<> {showScanner ?
					<Webcam appendMessage={appendMessage}/>
					:
					<>
						<img src={scan}
							 className="customer__image"
							 alt="Scan the Qr to continue"/>
						<p className="scan__text">Scan cart to start your order.</p>
					</>
				}
					<div className="w-25" style={{minWidth: "max-content"}}>
						{!queryLoading ?
							<button
								type="button"
								className="customer__button"
								onClick={() => {
									setShowScanner(!showScanner)
								}}>{showScanner ? 'exit' : `scan`}
							</button> :
							<div className="spinner-container ">
								<CircularProgress
									color={"secondary"}
									size={40}
									thickness={4}/>
							</div>}
					</div>
				</>
			</div>
		</div>
	);
};

export default Customer;
