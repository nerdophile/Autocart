import './CustomerCart.modules.scss';
import React, {useEffect, useState} from 'react';

import {useParams} from "react-router";
import gql from "graphql-tag";
import {useSubscription} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import Empty from "../../../../UI/Empty/Empty";


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


const CustomerCart = (props) => {

	const {barcode} = useParams();
	console.log(barcode);

	const {data: products, error: productsError, loading: productsLoading} = useSubscription(GetCartProductsByBarcode, {
		variables: {
			barcode
		}
	});

	const [priceSum, setPriceSum] = useState(0);

	useEffect(() => {
		let sumOfPrice = 0;
		!productsLoading && products['CartProducts'].forEach((element) => {
			sumOfPrice += Number(element["Product"].price);
		});
		setPriceSum(sumOfPrice);
	}, [products, productsLoading]);


	return (
		<div className="cust">
			<div className="cust__main">
				{!productsLoading ?
					<>
						<div className="cust__header" style={{marginBottom: "2em"}}>
							<p className="cust__my-cart">My Cart</p>
							<p className="cust__total-price">{priceSum}/-</p>
						</div>

						{
							products['CartProducts'].map((product, index) => {
								return (<div className="cust__card"
											 key={index + new Date().toISOString()}>
									<p className="cust__card-subtitle">product</p>
									<p className="cust__card-detail">{product["Product"].name.toLowerCase()}</p>
									<div className="cust__header w-75">
										<div>
											<p className="cust__card-subtitle">price</p>
											<p className="cust__card-detail">{product["Product"].price}</p>
										</div>
										<div>
											<p className="cust__card-subtitle">weight</p>
											<p className="cust__card-detail">{product["Product"].weight}</p>
										</div>
									</div>
								</div>)
							})
						}
					</>

					:
					<div className="spinner-container h-50">
						<CircularProgress size={40} thickness={4}/>
					</div>
				}
			</div>

		</div>
	);
};

export default CustomerCart;
