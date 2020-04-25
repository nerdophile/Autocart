import React, {useState} from 'react';
import './Customer.modules.scss';
import Webcam from "../Panel/Billing/Webcam/Webcam";
import {useHistory} from "react-router";
import scan from '../../../Assests/Images/scan-white.png';

const Customer = (props) => {

	const history = useHistory();

	const [showScanner, setShowScanner] = useState(false);
	const appendMessage = message => {
		console.log(message);
		history.push(`/customer/${message}`);
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
							 className="scan__image"
							 alt="Scan the Qr to continue"/>
						<p className="scan__text">Scan barcode to view your cart</p>
					</>
				}
					<div className="w-25" style={{minWidth: "max-content"}}>
						<button
							type="button"
							className="customer__button"
							onClick={() => {
								setShowScanner(!showScanner)
							}}>{showScanner ? 'exit' : `scan`}
						</button>
					</div>
				</>
			</div>
		</div>
	);
};

export default Customer;
