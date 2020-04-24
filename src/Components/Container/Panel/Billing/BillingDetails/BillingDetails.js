import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import gql from "graphql-tag";
import {useSubscription} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import Empty from "../../../../UI/Empty/Empty";

import './BillingDetails.scss';


const GetCartProductsByBarcode = gql`
    subscription GetCartProductsByBarcode($barcode: String!) {
        CartProducts(where: {Cart: {barcode: {_eq: $barcode}}}, order_by: {createdAt: asc}) {
            id
            Product {
                id
                name
                price
                weight
                Category {
                    id
                    name
                }
            }
        }
    }
`;

const BillingDetails = (props) => {

	const {barcode} = useParams();
	console.log(barcode);

	const {data: products, error: productsError, loading: productsLoading} = useSubscription(GetCartProductsByBarcode, {
		variables: {
			barcode
		}
	});

	const [weightSum, setWeightSum] = useState(0);
	const [priceSum, setPriceSum] = useState(0);


	useEffect(() => {
		let sumOfWeight = 0;
		let sumOfPrice = 0;
		!productsLoading && products['CartProducts'].forEach((element) => {
			sumOfWeight += Number(element["Product"].weight);
			sumOfPrice += Number(element["Product"].price);
		});
		setPriceSum(sumOfPrice);
		setWeightSum(sumOfWeight);
	}, [products, productsLoading]);


	return (
		<div className="container-main">
			<div className="container-box billing">
				{productsLoading ?
					<div className="spinner-container h-50">
						<CircularProgress size={40} thickness={4}/>
					</div> :
					products['CartProducts'].length > 0 ?
						<>
							<p className="billing__title">Cart #{products['CartProducts'][0].id}</p>

							<div className="billing__table-container">
								<p className="billing__table-title">PRODUCT</p>
								<p className="billing__table-title">WEIGHT</p>
								<p className="billing__table-title">CATEGORY</p><p
								className="billing__table-title">PRICE</p>
							</div>

							{
								products['CartProducts'].map((product, index) => {
									return (<div className="billing__table-container"
												 key={index + new Date().toISOString()}>
										<p className="billing__table-item">{product["Product"].name}</p>
										<p className="billing__table-item">{product["Product"].weight}</p>
										<p className="billing__table-item">{product["Product"]["Category"].name}</p>
										<p className="billing__table-item">{product["Product"].price}</p>
									</div>)
								})
							}

							<hr className="billing__rule"/>
							<div className="billing__total-root ">
								<div className="billing__total-container">
									<p className="billing__table-title">WEIGHT : </p>
									<p className="billing__total">{weightSum} gm</p>
								</div>
								<div className="billing__total-container">
									<p className="billing__table-title">PRICE : </p>
									<p className="billing__total">{priceSum}</p>
								</div>
							</div>

							<div className="billing__total-root ">
								<button
									type="button"
									className="billing__button billing__button-active">clear cart
								</button>
								<button
									type="button"
									className="billing__button billing__button-inactive">payment
								</button>
							</div>

						</>
						: <Empty/>
				}
			</div>
		</div>
	);
};

export default BillingDetails;
