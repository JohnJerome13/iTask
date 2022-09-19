/**
 * Helper form component for rendering checkboxes
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';

// import components
import Binder from '../Binder.js.jsx';

class CheckboxInput extends Binder {
	constructor(props) {
		super(props);
		this.state = {
			isChecked: this.props.checked,
		};
		this._bind('_handleInputChange');
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.state.isChecked) {
			this.setState({ isChecked: !this.state.isChecked });
		}
	}

	_handleInputChange(e) {
		const event = e;
		const checked = e.target.checked;
		const value = checked;
		const name = e.target.name;
		event.target = Object.assign({}, e.target, {
			checked: checked,
			name: name,
			value: checked,
		});
		this.props.change(event);
	}

	render() {
		const {
			checked,
			disabled,
			helpText,
			label,
			name,
			required,
			value,
			isApproved,
			singleTask,
		} = this.props;
		return (
			<div
				className='input-group'
				style={{
					position: 'relative',
					display: 'inline-block',
					marginBottom: 0,
					verticalAlign: 'initial',
					marginBottom: 10,
				}}
			>
				<input
					checked={value}
					disabled={disabled}
					name={name}
					onChange={this._handleInputChange}
					required={required}
					type='checkbox'
					id={`checkbox-${label}`}
					style={{ marginRight: '5px', cursor: 'pointer' }}
					// value={value}
				/>
				<label htmlFor={`checkbox-${label}`}>
					{singleTask ? (
						<h1
							style={
								isApproved === 'approved'
									? {
											cursor: 'pointer',
											textDecoration: 'line-through',
									  }
									: { cursor: 'pointer' }
							}
						>
							{label}
						</h1>
					) : (
						<span
							style={
								isApproved === 'approved'
									? {
											fontSize: 'x-large',
											cursor: 'pointer',
											textDecoration: 'line-through',
									  }
									: { fontSize: 'x-large', cursor: 'pointer' }
							}
						>
							{label}
						</span>
					)}
				</label>
				<br />
				<small className='help-text'>
					<em>{helpText}</em>
				</small>
			</div>
		);
	}
}

CheckboxInput.propTypes = {
	change: PropTypes.func.isRequired,
	singleTask: PropTypes.bool,
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	helpText: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
	value: PropTypes.bool.isRequired,
};

CheckboxInput.defaultProps = {
	checked: false,
	disabled: false,
	helpText: '',
	label: '',
	required: false,
};

export default CheckboxInput;
