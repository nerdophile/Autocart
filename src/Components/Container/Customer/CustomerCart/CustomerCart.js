import './CustomerCart.modules.scss';
import React, {useContext, useEffect, useState} from 'react';

import {useParams} from "react-router";
import gql from "graphql-tag";
import {useApolloClient, useMutation, useSubscription} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import Webcam from "../../Panel/Billing/Webcam/Webcam";
import CustomerCard from "./CustomerCard/CustomerCard";
import SnackbarContext from "../../../../Context/SnackbarContext";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import Empty from "../../../../UI/Empty/Empty";


const GetCartProductsByBarcode = gql`
    subscription GetCartProductsByBarcode($barcode: String!) {
        CartProducts(where: {Cart: {barcode: {_eq: $barcode}}}, order_by: {createdAt: desc}) {
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

const ProductBarcodeCheck = gql`
    query ProductBarcodeCheck($barcode: String!) {
        Products(where: {barcode: {_eq: $barcode}}) {
            id
            barcode
            name
        }
    }
`;

const GetCartProductAggregate = gql`
    query GetCartProductAggregate($cartId: Int!, $productId: Int!) {
        CartProducts_aggregate(where: {cartId: {_eq: $cartId}, productId: {_eq: $productId}}) {
            aggregate {
                count
            }
        }
    }
`;

const InsertProductToCart = gql`
    mutation InsertProductToCart($cartId: Int!, $productId: Int!) {
        insert_CartProducts(objects: {cartId: $cartId, productId: $productId}) {
            affected_rows
        }
    }
`;

const DeleteProductFromCart = gql`
    mutation InsertProductToCart($cartId: Int!, $productId: Int!) {
        delete_CartProducts(where:{productId: {_eq: $productId} , cartId: {_eq: $cartId}}) {
            affected_rows
        }
    }
`;

const CustomerCart = (props) => {

	const {barcode, id: cartId} = useParams();
	const [queryLoading, setQueryLoading] = useState(false);
	const {setSnackbar, setMessage} = useContext(SnackbarContext);

	const [insertProductToCart] = useMutation(InsertProductToCart)
	const [deleteProductFromCart] = useMutation(DeleteProductFromCart)

	const client = useApolloClient();

	const {data: products, loading: productsLoading} = useSubscription(GetCartProductsByBarcode, {
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


	const appendMessage = message => {
		setQueryLoading(true);
		client.query({
			query: ProductBarcodeCheck,
			variables: {
				barcode: message
			}
		}).then(({data: product}) => {
			if (product['Products'].length > 0) {
				client.query({
					query: GetCartProductAggregate,
					variables: {
						cartId,
						productId: product['Products'][0].id
					},
					fetchPolicy: "no-cache"
				}).then(({data: aggregate}) => {
					if (aggregate['CartProducts_aggregate']['aggregate']['count'] > 0) {
						// console.log('remove');
						deleteProductFromCart({
							variables: {
								cartId,
								productId: product['Products'][0].id
							}
						}).then((data) => {
							setQueryLoading(false);
							setSnackbar(true);
							setMessage(`Product deleted from cart successfully`);
						});
					} else {
						// console.log('insert');
						insertProductToCart({
							variables: {
								cartId,
								productId: product['Products'][0].id
							}
						}).then((data) => {
							setQueryLoading(false);
							setSnackbar(true);
							setMessage(`Product inserted to cart successfully`);
						});
					}
				})
			} else {
				setQueryLoading(false);
				setSnackbar(true);
				setMessage(`Product with that barcode doesn't exists`);
			}
		})
	};


	return (
		<div className="cust">
			<div className="cust__main">

				{!productsLoading ?
					<>
						<>
							<div className="cust__header" style={{marginBottom: "2em"}}>
								<p className="cust__my-cart">My Cart</p>
								<p className="cust__total-price">{priceSum}/-</p>
							</div>

							{queryLoading ?
								<div className="spinner-container " style={{minHeight: '200px'}}>
									<CircularProgress
										size={50}
										thickness={6}/>
								</div> :
								<Webcam appendMessage={appendMessage} blue={true}/>}
						</>

						{
							products['CartProducts'].map((product, index) => {
								return (
									<CustomerCard key={index + new Date().toISOString()}
												  product={product}
									/>
								)
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
