import './AddProduct.scss';

import React, {useContext, useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import close from '../../../../../Assests/Images/cross.png';
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";

import Input from "../../../../UI/Input/Input";
import Dropdown from "../../../../UI/Dropdown/Dropdown";
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackbarContext from "../../../../../Context/SnackbarContext";
import PrimaryButton from "../../../../UI/PrimaryButton/PrimaryButton";

const GetCategory = gql`
    query GetCategory {
        Categories(order_by: {createdAt: asc}) {
            id
            name
        }
    }
`;

const InsertProduct = gql`
    mutation InsertProduct($barcode: String!, $category: Int!, $name: String!, $price: Int!, $weight: String!) {
        insert_Products(objects: {barcode: $barcode, categoryId: $category, name: $name, price: $price, weight: $weight}) {
            affected_rows
        }
    }
`;

const UpdateProduct = gql`
    mutation updateProduct($barcode: String!, $category: Int!, $name: String!, $price: Int!, $weight: String!, $id: Int!) {
        update_Products(where: {id: {_eq: $id}}, _set: {barcode: $barcode, categoryId: $category, name: $name, price: $price, weight: $weight}) {
            affected_rows
        }
    }
`;

const AddProduct = (props) => {

	const [name, setName] = useState(props.editData ? props.editData.name : '');
	const [barcode, setBarcode] = useState(props.editData ? props.editData["barcode"] : '');
	const [weight, setWeight] = useState(props.editData ? props.editData.weight : '');
	const [price, setPrice] = useState(props.editData ? props.editData.price : '');
	const [category, setCategory] = useState(props.editData ? props.editData.categoryId : 1);

	const {data: categoryArray, loading: categoryLoading} = useQuery(GetCategory, {
		fetchPolicy: "no-cache",
	});

	const [mutationLoading, setMutationLoading] = useState(false);

	const [insertUser] = useMutation(InsertProduct);
	const [updateUser] = useMutation(UpdateProduct);
	// const [updateUserDisabled] = useMutation(UpdateUserDisabled);

	const {setSnackbar, setMessage} = useContext(SnackbarContext);

	const clearState = () => {
		setName('');
		setBarcode('');
		setWeight('');
		setPrice('');
		setCategory(1);
	};

	useEffect(() => {
		if (props.editData) {
			setName(props.editData.name);
			setBarcode(props.editData["barcode"]);
			setWeight(props.editData.weight);
			setPrice(props.editData.price);
			setCategory(props.editData.categoryId);
		}

	}, [props.editData]);


	const onSave = () => {
		setMutationLoading(true);
		insertUser({
			variables: {
				name,
				weight,
				barcode,
				price,
				category,
			}
		}).then((data) => {
			setMessage("Product Inserted Successfully");
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
				weight,
				barcode,
				price,
				category,
				id: props.editData.id
			}
		}).then((data) => {
			setMessage("Product Updated Successfully");
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
					className="add__product Modal__main"
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
			{categoryLoading ?
				<div className="spinner-container">
					<CircularProgress size={40} thickness={4}/>
				</div>
				: <div className="add__product__content">
					<p className="add__product__header">{props.editData ? 'Edit Product' : 'Add Product'}</p>
					<div className="add__product__input-container">
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
						<Input placeholder={"Weight (gm)"}
							   label
							   type={"number"}
							   value={weight}
							   onChange={(e) => {
								   setWeight(e)
							   }}
						/>
						<Input placeholder={"Price"}
							   label
							   type={"text"}
							   value={price}
							   onChange={(e) => {
								   setPrice(e)
							   }}
						/>


						<div style={{margin: "1.5em 0"}}>
							<Dropdown label={"Roles"}
									  onChange={(event) => {
										  setCategory(event)
									  }}
									  value={category}
									  array={categoryArray["Categories"]}
							/>
						</div>
					</div>


					{
						props.editData ?

							(!mutationLoading ? <div className="w-40 margin-auto">
								<PrimaryButton label="Edit"
											   loading={mutationLoading}
											   disabled={!(name && price && weight && barcode && category)}
											   active
											   onClick={() => {
												   onEdit();
											   }}/>

							</div> : <div className="spinner-container" style={{marginTop: "3em"}}>
								<CircularProgress size={40} thickness={4}/>
							</div>)
							:
							<div className="w-40 margin-auto">
								<PrimaryButton label="Save"
											   disabled={!(name && price && weight && barcode && category)}
											   loading={mutationLoading}
											   active
											   onClick={() => {
												   onSave();
											   }}/>
							</div>
					}

				</div>}


		</ReactModal>
	);
};

export default AddProduct;
