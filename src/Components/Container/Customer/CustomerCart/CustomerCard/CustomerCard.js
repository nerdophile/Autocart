import './CustomerCard.modules.scss';
import deleteIcon from '../../../../../Assests/Images/delete.svg';
import React, {useContext, useState} from 'react';
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";
import SnackbarContext from "../../../../../Context/SnackbarContext";
import CircularProgress from "@material-ui/core/CircularProgress";

const DeleteProductFromCart = gql`
    mutation DeleteProductFromCart($id: Int!) {
        delete_CartProducts(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }
`

const CustomerCard = (props) => {

	const [warning, setWarning] = useState(false);
	const [deleteProductFromCart] = useMutation(DeleteProductFromCart)

	const [queryLoading, setQueryLoading] = useState(false);
	const {setSnackbar, setMessage} = useContext(SnackbarContext);
	const deleteProduct = () => {
		setQueryLoading(true);
		deleteProductFromCart({
			variables: {
				id: props.product.id
			}
		}).then((data) => {
			setQueryLoading(false);
			setSnackbar(true);
			setMessage(`Product deleted from cart successfully`);
		});
	}

	return (
		<div className="card"
		>
			{!warning ? <>
					<div className="card__header w-75">
						<div>
							<p className="card__subtitle">product </p>
							<p className="card__detail">{props.product["Product"].name.toLowerCase()}</p>
						</div>

						<img src={deleteIcon} alt="Delete"
							 onClick={() => {
								 setWarning(true)
							 }}
							 className="card__delete"/>
					</div>

					<div className="card__header w-75">
						<div>
							<p className="card__subtitle">price</p>
							<p className="card__detail">{props.product["Product"].price}</p>
						</div>
						<div>
							<p className="card__subtitle">weight</p>
							<p className="card__detail">{props.product["Product"].weight}</p>
						</div>
					</div>
				</> :
				<>
					{queryLoading ?

						<div className="spinner-container h-`">
							<CircularProgress
								size={40}
								thickness={4}/>
						</div>
						:
						<>
							<p className="card__warning">are you sure you want to delete this product ?</p>
							<div className="d-flex justify-content-between">
								<p/>
								<div className="d-flex justify-content-between" style={{marginTop: "2em"}}>
									<p className="card__warning-button__yes"
									   onClick={() => {
										   deleteProduct();
									   }}
									>yes </p>
									<p className="card__warning-button__no"
									   onClick={() => {
										   setWarning(false)
									   }}>no</p>
								</div>
							</div>
						</>
					}
				</>
			}
		</div>
	);
}

export default CustomerCard;
