/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { TextInput } from '../../../global/components/forms';

const NoteForm = ({
	cancelAction,
	cancelLink,
	formHelpers,
	formTitle,
	formType,
	handleFormChange,
	handleFormSubmit,
	note,
}) => {
	// set the button text
	const buttonText =
		formType === 'create' ? 'Create Comment' : 'Update Comment';

	// set the form header
	const header = formTitle ? (
		<div className='formHeader'>
			<h2> {formTitle} </h2>
			<hr />
		</div>
	) : (
		<div />
	);

	return (
		<div className='yt-container'>
			<div className='yt-row center-horiz'>
				<div className='form-container -slim'>
					<form
						name='noteForm'
						className='note-form'
						onSubmit={handleFormSubmit}
					>
						{header}
						<TextInput
							change={handleFormChange}
							label='Content'
							name='note.content'
							placeholder='Content (required)'
							required={true}
							value={note.content}
						/>
						<div className='input-group'>
							<div className='yt-row space-between'>
								{!cancelAction ? (
									<Link className='yt-btn link' to={cancelLink}>
										Cancel
									</Link>
								) : (
									<button className='yt-btn link' onClick={cancelAction}>
										Cancel
									</button>
								)}
								<button className='yt-btn ' type='submit'>
									{buttonText}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

NoteForm.propTypes = {
	cancelAction: PropTypes.func,
	cancelLink: PropTypes.string.isRequired,
	formHelpers: PropTypes.object,
	formTitle: PropTypes.string,
	formType: PropTypes.string.isRequired,
	handleFormChange: PropTypes.func.isRequired,
	handleFormSubmit: PropTypes.func.isRequired,
	note: PropTypes.object.isRequired,
};

NoteForm.defaultProps = {
	cancelLink: '/notes',
	formHelpers: {},
	formTitle: '',
};

export default NoteForm;
