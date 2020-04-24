import React, {useState} from 'react';
import './Product.modules.scss'
import SearchBox from "../../../UI/SearchBox/SearchBox";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableItem from "../../../UI/TableItem/TableItem";
import Empty from "../../../UI/Empty/Empty";
import AddElement from "../../../UI/AddElement/AddElement";
import AddProduct from "./AddProduct/AddProduct";

const GetProducts = gql`
    query GetProducts($searchValue: String!) {
        Products(order_by: {createdAt: asc}, where: {name: {_ilike:$searchValue }}) {
            barcode
            categoryId
            id
            name
            price
            weight
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

	const {data: products, error: usersError, loading: usersLoading, refetch} = useQuery(GetProducts, {
		variables: {
			searchValue: `%${value}%`
		}
	});

	if (usersError) {
		console.log(usersError);
		return usersError;
	} else {
		return (
			<div className="container-main">
				<SearchBox placeholder={"Search Products"}
						   value={value}
						   onChangeSearch={(value) => {
							   onChangeSearch(value)
						   }}
				/>

				<AddProduct modalState={addModal} setModal={setAddModal} refetch={refetch} setEditData={setEditData}
							editData={editData}/>

				<div className="container-box " style={{minHeight: '40rem'}}>
					<AddElement title={'Products'}
								value={value}
								onClick={(e) => {
									setAddModal(true)
								}}/>

					{usersLoading ?
						<div className="spinner-container h-50">
							<CircularProgress size={40} thickness={4}/>
						</div> :
						products.Products.length > 0 ? products.Products.map((element) => {
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
