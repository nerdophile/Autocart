import React, {useState} from 'react';
import './Cart.modules.scss';
import SearchBox from "../../../UI/SearchBox/SearchBox";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableItem from "../../../UI/TableItem/TableItem";
import Empty from "../../../UI/Empty/Empty";
import AddElement from "../../../UI/AddElement/AddElement";
import AddCart from "./AddCart/AddCart";

const GetCart = gql`
    query GetCart($searchValue: String!) {
        Cart(order_by: {createdAt: asc}, where: {name: {_ilike:$searchValue }}) {
            id
            name
            barcode
        }
    }


`;

const Product = (props) => {
	const [value, setValue] = useState('');
	const [addModal, setAddModal] = useState(false);
	const [editData, setEditData] = useState(null);
	const onChangeSearch = (value) => {
		setValue(value);
	};

	const {data: cart, error: cartError, loading: cartLoading, refetch} = useQuery(GetCart, {
		variables: {
			searchValue: `%${value}%`
		}
	});

	if (cartError) {
		console.log(cartError);
		return cartError;
	} else {
		return (
			<div className="container-main">
				<SearchBox placeholder={"Search Categories"}
						   value={value}
						   onChangeSearch={(value) => {
							   onChangeSearch(value)
						   }}
				/>
				<AddCart modalState={addModal} setModal={setAddModal} refetch={refetch} setEditData={setEditData}
						 editData={editData}/>

				<div className="container-box " style={{minHeight: '40rem'}}>
					<AddElement title={'Cart'}
								value={value}
								onClick={(e) => {
									setAddModal(true)
								}}/>

					{cartLoading ?
						<div className="spinner-container h-50">
							<CircularProgress size={40} thickness={4}/>
						</div> :
						cart['Cart'].length > 0 ? cart['Cart'].map((element) => {
							return <TableItem element={element}
											  deleteNotViewable={true}
											  key={element.id}
											  setEditData={(value, element) => {
												  setEditData(element);
												  setAddModal(true);
											  }}

											  name={element.name}/>
						}) : <Empty/>
					}
				</div>

			</div>
		);
	}
};

export default Product;
