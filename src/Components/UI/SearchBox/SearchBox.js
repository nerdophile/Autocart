import React from 'react';
import './SearchBox.modules.scss';
import search from '../../../Assests/Images/search-icon.png'

const SearchBox = (props) => {
	let timeout;

	const onChangeSearch = (value) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			props.onChangeSearch(value);
		}, 300);
	};

	return (
		<div className="searchBox">
			<div className="searchBox__icon">
				<img src={search} style={{width: '1.5rem'}} alt="search"/>
			</div>

			<input className="searchBox__search"
				   type="search" name={props.placeholder}
				   aria-label={props.placeholder}
				   onChange={(event) => {
					   onChangeSearch(event.target.value)
				   }}
				   placeholder={props.placeholder}/>
		</div>
	);
};

export default SearchBox;
