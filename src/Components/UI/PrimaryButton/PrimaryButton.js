import React from 'react';
import {CircularProgress} from "@material-ui/core";
import './PrimaryButton.scss';

function PrimaryButton({disabled, label, loading, onClick, active}) {
	return (
		<div className="button__container">
			{loading ? <CircularProgress size={40} thickness={4.5}/> :
				<button
					type="button"
					className={ "button__primary " + (active ? "button__primary-active" : "button__primary-unselected")}
					disabled={disabled}
					onClick={onClick}>{label}</button>}
		</div>
	);
}

export default PrimaryButton;
