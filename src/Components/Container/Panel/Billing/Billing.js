import React, {useState} from 'react';
import './Billing.modules.scss'
import Webcam from "./Webcam/Webcam";
import {useHistory} from "react-router";
import scan from '../../../../Assests/Images/scan.png';
import PrimaryButton from "../../../UI/PrimaryButton/PrimaryButton";

const Billing = (props) => {
	const history = useHistory();

	const [showScanner, setShowScanner] = useState(false);
	const appendMessage = message => {
		console.log(message);
		history.push(`/panel/billing/${message}`);
	};


	return (

		<div className="container-main">
			<div className="container-box scan">
				<> {showScanner ?
					<Webcam appendMessage={appendMessage} blue={true}/>
					: <>
						<img src={scan}
							 className="scan__image"
							 alt="Scan the Qr to continue"/>
						<p className="customer__text">Scan barcode to start billing</p>
					</>
				}
					<div className="w-25">
						<PrimaryButton label={showScanner ? 'exit' : `scan`}
									   active={true}
									   onClick={() => {
										   setShowScanner(!showScanner)
									   }}/>
					</div>
				</>
			</div>
		</div>
	);
};

export default Billing;

