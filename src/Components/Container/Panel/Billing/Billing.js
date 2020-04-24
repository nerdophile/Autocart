import React from 'react';
import './Billing.modules.scss'
import scan from '../../../../Assests/Images/scan.png';


const Billing = (props) => {
	return (

		<div className="container-main">
			<div className="container-box scan">
				<>
					<img src={scan}
						 className="scan__image"
						 alt="Scan the Qr to continue"/>
					<p className="scan__text">Scan barcode to start billing</p>
				</>
			</div>
		</div>
	);
};

export default Billing;

