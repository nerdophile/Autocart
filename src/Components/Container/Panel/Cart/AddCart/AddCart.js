import './AddCart.scss';

import React, {useContext, useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import close from '../../../../../Assests/Images/cross.png';
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import Input from "../../../../UI/Input/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackbarContext from "../../../../../Context/SnackbarContext";
import PrimaryButton from "../../../../UI/PrimaryButton/PrimaryButton";


const InsertCart = gql`
    mutation InsertCart($barcode: String!, $name: String!) {
        insert_Cart(objects: {barcode: $barcode,  name: $name}) {
            affected_rows
        }
    }
`;

const UpdateCart = gql`
    mutation updateCart($barcode: String!, $name: String!, $id: Int!) {
        update_Cart(where: {id: {_eq: $id}}, _set: {barcode: $barcode,  name: $name}) {
            affected_rows
        }
    }
`;

const AddProduct = (props) => {

	const [name, setName] = useState(props.editData ? props.editData.name : '');
	const [barcode, setBarcode] = useState(props.editData ? props.editData["barcode"] : '');


	const [mutationLoading, setMutationLoading] = useState(false);

	const [insertUser] = useMutation(InsertCart);
	const [updateUser] = useMutation(UpdateCart);
	// const [updateUserDisabled] = useMutation(UpdateUserDisabled);

	const {setSnackbar, setMessage} = useContext(SnackbarContext);

	const clearState = () => {
		setName('');
		setBarcode('');

	};

	useEffect(() => {
		if (props.editData) {
			setName(props.editData.name);
			setBarcode(props.editData["barcode"]);

		}

	}, [props.editData]);


	const onSave = () => {
		setMutationLoading(true);
		insertUser({
			variables: {
				name,
				barcode,
			}
		}).then((data) => {
			setMessage("Cart Inserted Successfully");
			setSnackbar(true);
			props.refetch();
			clearState();
			props.setEditData(null);
			props.setModal(false);
			setMutationLoading(false);
		}).catch((error) => {
			console.log(error.message.includes('Uniqueness'));
			if (error.message.includes('Uniqueness')) {
				setMessage("Barcode is already in use, Please a try a different one");
			} else {
				setMessage("Some Error Occurred");
			}
			setSnackbar(true);
			setMutationLoading(false);
		})
	};


	const onEdit = () => {
		setMutationLoading(true);
		updateUser({
			variables: {
				name,
				barcode,
				id: props.editData.id
			}
		}).then((data) => {
			setMessage("Cart Updated Successfully");
			setSnackbar(true);
			props.refetch();
			clearState();
			props.setEditData(null);
			props.setModal(false);
			setMutationLoading(false);
		}).catch((error) => {
			console.log(error.message);
			if (error.message.includes('Uniqueness violation')) {
				setMessage("Barcode is already in use, Please a try a different one");
			} else {
				setMessage("Some Error Occurred");
			}
			setSnackbar(true);
			setMutationLoading(false);
		})
	};

	return (
		<ReactModal isOpen={props.modalState}
					className="add__modal Modal__main"
					onRequestClose={() => {
						clearState();

						props.setEditData(null);
						props.setModal(false);
					}}
					overlayClassName="Overlay"
		>
			<div className="close">
				<img src={close} alt="Close"
					 className="close__img close__img-user"
					 onClick={() => {
						 clearState();
						 props.setEditData(null);
						 props.setModal(false);
					 }}/>
			</div>
			<div className="add__modal__content">
				<p className="add__modal__header">{props.editData ? 'Edit Cart' : 'Add Cart'}</p>
				<div className="add__modal__input-container">
					<Input placeholder={"Name"}
						   label
						   type={"text"}
						   value={name}
						   onChange={(e) => {
							   setName(e)
						   }}
					/>

					<Input placeholder={"Barcode"}
						   label
						   type={"number"}
						   value={barcode}
						   onChange={(e) => {
							   setBarcode(e)
						   }}
					/>
				</div>

				{
					props.editData ?

						(!mutationLoading ? <div className="w-40 margin-auto" style={{marginTop: "2em"}}>
							<PrimaryButton label="Edit"
										   loading={mutationLoading}
										   disabled={!(name && barcode)}
										   active
										   onClick={() => {
											   onEdit();
										   }}/>

						</div> : <div className="spinner-container" style={{marginTop: "3em"}}>
							<CircularProgress size={40} thickness={4}/>
						</div>)
						:
						<div className="w-40 margin-auto" style={{marginTop: "2em"}}>
							<PrimaryButton label="Save"
										   disabled={!(name && barcode)}
										   loading={mutationLoading}
										   active
										   onClick={() => {
											   onSave();
										   }}/>
						</div>
				}
			</div>


		</ReactModal>
	);
};

export default AddProduct;
