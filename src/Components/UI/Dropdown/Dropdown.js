import React from 'react';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {makeStyles} from "@material-ui/styles";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		width: '30%',
		height: '3rem'
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

function Dropdown(props) {
	const classes = useStyles();
	const [labelWidth, setLabelWidth] = React.useState(0);
	const inputLabel = React.useRef(null);


	React.useEffect(() => {
		setLabelWidth(inputLabel.current['offsetWidth']);
	}, []);


	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
				{props.label}
			</InputLabel>
			<Select
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined"
				value={props.value}
				onChange={(event) => {
					props.onChange(event.target.value);
				}}
				labelWidth={labelWidth}>

				{
					props.array.map((element, index) => {
						return (<MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>)
					})
				}

			</Select>
		</FormControl>
	);
}

export default Dropdown;
