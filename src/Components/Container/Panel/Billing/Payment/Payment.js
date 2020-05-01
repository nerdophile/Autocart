import React, {useContext, useState} from 'react';
import './Payment.modules.scss';
import Input from "../../../../UI/Input/Input";
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";
import {useHistory, useParams} from "react-router";
import SnackbarContext from "../../../../../Context/SnackbarContext";
import CircularProgress from "@material-ui/core/CircularProgress";

const ClearCart = gql`
    mutation ClearCart($barcode: String!) {
        delete_CartProducts(where: { Cart: {barcode: {_eq: $barcode}}}) {
            affected_rows
        }
    }
`;

const Payment = (props) => {

	const [clearCartMutation] = useMutation(ClearCart);
	const {barcode} = useParams();
	const history = useHistory();

	const [mutationLoading, setMutationLoading] = useState(false);
	const {setSnackbar, setMessage} = useContext(SnackbarContext);


	const clearCart = () => {
		setMutationLoading(true);
		clearCartMutation({
			variables: {
				barcode
			}
		}).then(() => {
			setMessage("Payment Completed Successfully");
			setSnackbar(true);
			setMutationLoading(false);
			history.push('/panel/billing');
		}).catch((error) => {
			setMessage(error.message);
			setSnackbar(true);
			setMutationLoading(false);
		})
	};


	return (
		<div className="container-main">
			<div className="container-box payment">
				<div className="">
					<p className="add-element__title" style={{marginBottom: "1em"}}>Payment</p>
					<p className="payment__label">Debit/Credit Card</p>
					<Input/>
					<p className="payment__label">Cash</p>
					<Input/>
					<p className="payment__label">Upi (Paytm, google pay etc)</p>
					<Input/>
				</div>
				<div className="d-flex justify-content-center h-100">


					{!mutationLoading ? <>
							<button
								type="button"
								onClick={clearCart}
								className="billing__button billing__button-inactive">completed
							</button>
						</> :
						<div className="spinner-container ">
							<CircularProgress size={40} thickness={4}/>
						</div>
					}
				</div>
			</div>
		</div>
	);
}

export default Payment;
