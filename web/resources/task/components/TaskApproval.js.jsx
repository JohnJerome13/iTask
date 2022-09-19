/**
 * Reusable stateless form component for Task
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { TextAreaInput, TextInput } from '../../../global/components/forms';

const TaskApproval = ({
	user,
	task,
	handleApproveButton,
	handleRejectButton,
}) => {
	if (Object.keys(user).length !== 0) {
		return user.roles.includes('admin') &&
			task.status === 'awaiting_approval' ? (
			<div style={{ marginBottom: 10 }}>
				<button
					className='yt-btn success x-small '
					onClick={handleApproveButton}
					style={{ marginRight: 10 }}
				>
					Approve
				</button>
				<button className='yt-btn x-small ' onClick={handleRejectButton}>
					Reject
				</button>
			</div>
		) : (
			<span style={{ fontStyle: 'italic' }}>
				{task.status === 'awaiting_approval' && '(Awaiting admin approval)'}
			</span>
		);
	} else {
		return <p>User not signed in.</p>;
	}
};

TaskApproval.propTypes = {
	handleApproveButton: PropTypes.func.isRequired,
	handleRejectButton: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	task: PropTypes.object.isRequired,
};

TaskApproval.defaultProps = {};

export default TaskApproval;
