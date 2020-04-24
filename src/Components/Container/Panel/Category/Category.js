import React, {useState} from 'react';
import './Category.modules.scss';
import SearchBox from "../../../UI/SearchBox/SearchBox";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableItem from "../../../UI/TableItem/TableItem";
import Empty from "../../../UI/Empty/Empty";
import AddElement from "../../../UI/AddElement/AddElement";
import AddCategory from "./AddCategory/AddCategory";

const GetCategory = gql`
    query GetCategory($searchValue: String!) {
        Categories(order_by: {createdAt: asc}, where: {name: {_ilike:$searchValue }}) {
            id
            name
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

	const {data: categories, error: categoriesError, loading: usersLoading, refetch} = useQuery(GetCategory, {
		variables: {
			searchValue: `%${value}%`
		}
	});

	if (categoriesError) {
		console.log(categoriesError);
		return categoriesError;
	} else {
		return (
			<div className="container-main">
				<SearchBox placeholder={"Search Categories"}
						   value={value}
						   onChangeSearch={(value) => {
							   onChangeSearch(value)
						   }}
				/>

				<AddCategory modalState={addModal} setModal={setAddModal} refetch={refetch} setEditData={setEditData}
							 editData={editData}/>
				<div className="container-box " style={{minHeight: '40rem'}}>
					<AddElement title={'Categories'}
								value={value}
								onClick={(e) => {
									setAddModal(true)
								}}/>

					{usersLoading ?
						<div className="spinner-container h-50">
							<CircularProgress size={40} thickness={4}/>
						</div> :
						categories["Categories"].length > 0 ? categories["Categories"].map((element) => {
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
