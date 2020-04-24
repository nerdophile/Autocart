import './AddCategory.scss';

import React, {useContext, useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import close from '../../../../../Assests/Images/cross.png';
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

import Input from "../../../../UI/Input/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackbarContext from "../../../../../Context/SnackbarContext";
import PrimaryButton from "../../../../UI/PrimaryButton/PrimaryButton";


const InsertCategory = gql`
    mutation InsertCategory($name: String!) {
        insert_Categories(objects: { name: $name}) {
            affected_rows
        }
    }
`;

const UpdateCategory = gql`
    mutation updateCategory( $name: String!, $id: Int!) {
        update_Categories(where: {id: {_eq: $id}}, _set: {name: $name}) {
            affected_rows
        }
    }
`;

const AddProduct = (props) => {

	const [name, setName] = useState(props.editData ? props.editData.name : '');


	const [mutationLoading, setMutationLoading] = useState(false);

	const [insertUser] = useMutation(InsertCategory);
	const [updateUser] = useMutation(UpdateCategory);
	// const [updateUserDisabled] = useMutation(UpdateUserDisabled);

	const {setSnackbar, setMessage} = useContext(SnackbarContext);

	const clearState = () => {
		setName('');

	};

	useEffect(() => {
		if (props.editData) {
			setName(props.editData.name);

		}

	}, [props.editData]);


	const onSave = () => {
		setMutationLoading(true);
		insertUser({
			variables: {
				name,
			}
		}).then((data) => {
			setMessage("Category Inserted Successfully");
			setSnackbar(true);
			props.refetch();
			clearState();
			props.setEditData(null);
			props.setModal(false);
			setMutationLoading(false);
		}).catch((error) => {
			console.log(error.message);

			setMessage("Some Error Occurred");

			setSnackbar(true);
			setMutationLoading(false);
		})
	};


	const onEdit = () => {
		setMutationLoading(true);
		updateUser({
			variables: {
				name,
				id: props.editData.id
			}
		}).then((data) => {
			setMessage("Category Updated Successfully");
			setSnackbar(true);
			props.refetch();
			clearState();
			props.setEditData(null);
			props.setModal(false);
			setMutationLoading(false);
		}).catch((error) => {
			console.log(error.message);
			setMessage("Some Error Occurred");
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
				<div className="margin-auto w-75">
					<Input placeholder={"Name"}
						   label
						   type={"text"}
						   value={name}
						   onChange={(e) => {
							   setName(e)
						   }}
					/>
				</div>

				{
					props.editData ?

						(!mutationLoading ? <div className="w-40 margin-auto" style={{marginTop: "2em"}}>
							<PrimaryButton label="Edit"
										   loading={mutationLoading}
										   disabled={!(name)}
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
										   disabled={!(name)}
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
