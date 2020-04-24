import React from 'react';
import emptyImage from '../../../Assests/Images/empty.png'

const Empty = (props) => {
	return (
		<div className="spinner-container h-50 card-animation" style={{marginTop: "5em"}}>
			<img src={emptyImage} alt="No Data" style={{height: "15rem"}}/>
		</div>);
};

export default Empty;
