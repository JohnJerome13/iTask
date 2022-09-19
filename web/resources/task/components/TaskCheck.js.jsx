/**
 * Reusable stateless form component for Task
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { CheckboxInput } from '../../../global/components/forms';

const TaskCheck = ({
	taskLabel,
	handleFormChange,
	handleFormSubmit,
	task,
	singleTask,
}) => {
	return (
		<CheckboxInput
			change={handleFormChange}
			label={taskLabel}
			name='task.complete'
			value={task.complete}
			isApproved={task.status}
			singleTask={singleTask}
		/>
	);
};

TaskCheck.propTypes = {
	singleTask: PropTypes.bool,
	taskLabel: PropTypes.string.isRequired,
	handleFormChange: PropTypes.func.isRequired,
	task: PropTypes.object.isRequired,
};

TaskCheck.defaultProps = {
	cancelLink: '/tasks',
	formHelpers: {},
	formTitle: '',
};

export default TaskCheck;
