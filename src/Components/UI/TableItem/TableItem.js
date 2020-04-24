import React, {useState} from 'react';
import './TableItem.scss';
import {CircularProgress} from "@material-ui/core";
import ReactModal from 'react-modal';
import close from '../../../Assests/Images/cross.png';
import PrimaryButton from "../PrimaryButton/PrimaryButton";


const TableItem = (props) => {
	const [showModal, setModal] = useState(false);
	const rootEl = document.getElementById("root");
	ReactModal.setAppElement(rootEl);

	return (
		<div className="table-item card-animation" >
			<p className="table-item__name">{props.name}</p>

			<div className="table-item__actions" style={ (props.editNotViewable || props.deleteNotViewable) && {justifyContent: 'flex-end'}}>
				{!props.editNotViewable && <button className="btn-list" type="button"
												  onClick={() => {
													  props.setEditData(true, props.element)
												  }}
				>edit
				</button>}
				{!props.deleteNotViewable ?  props.deleteLoading && (props.deleteLoading && (props.deleteStatusId === props.element.id)) ?
					<CircularProgress size={20} thickness={3}/>
					: <button className="btn-list"  type="button"
							  onClick={() => {
								  setModal(true)
							  }}

					>delete</button> : <p/>}
			</div>

			<ReactModal isOpen={showModal}
						className="Delete__Modal Modal__main"
						onRequestClose={() => {
							setModal(false);
						}}
						overlayClassName="Overlay">
				<div className="close">
					<img src={close} alt="Close"
						 className="close__img"
						 onClick={() => setModal(false)}/>
				</div>

				<div className="Delete__Modal__content margin-auto">
					<p className="Delete__Modal-header">Do you really want to Delete ?</p>
					<div className="w-40 margin-auto" style={{marginTop: "3em"}}>
						<PrimaryButton label="Delete"
									   active
									   onClick={() => {
										   setModal(false);
										   props.onDelete(props.element.id);
									   }}/>
					</div>
				</div>
			</ReactModal>
		</div>
	);
};

export default TableItem;
