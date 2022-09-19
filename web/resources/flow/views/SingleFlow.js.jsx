/**
 * View component for /flows/:flowId
 *
 * Displays a single flow from the 'byId' map in the flow reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as flowActions from '../flowActions';
import * as taskActions from '../../task/taskActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import FlowLayout from '../components/FlowLayout.js.jsx';
import TaskForm from '../../task/components/TaskForm.js.jsx';
import TaskCheck from '../../task/components/TaskCheck.js.jsx';
import TaskApproval from '../../task/components/TaskApproval.js.jsx';

class SingleFlow extends Binder {
	constructor(props) {
		super(props);
		this.state = {
			showTaskForm: false,
			task: _.cloneDeep(this.props.defaultTask.obj),
			taskListItems: [],
			// NOTE: We don't want to actually change the store's defaultItem, just use a copy
			taskFormHelpers: {},
			/**
			 * NOTE: formHelpers are useful for things like radio controls and other
			 * things that manipulate the form, but don't directly effect the state of
			 * the task
			 */
		};
		this._bind(
			'_handleFormChange',
			'_handleTaskSubmit',
			'_handleCheckChange',
			'_handleApproveButton',
			'_handleRejectButton'
		);
	}

	componentDidMount() {
		const { dispatch, match } = this.props;
		dispatch(flowActions.fetchSingleIfNeeded(match.params.flowId));
		dispatch(taskActions.fetchDefaultTask());
		dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, match } = this.props;
		dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));

		var taskListItems = Object.values(nextProps.taskStore.byId);

		this.setState({
			task: _.cloneDeep(nextProps.defaultTask.obj),
			taskListItems: taskListItems,
		});
	}

	_handleCheckChange(e, taskId) {
		const { dispatch } = this.props;
		const { taskListItems } = this.state;

		var taskListItemsUpdated = taskListItems.map((data) => {
			return data._id === taskId
				? {
						...data,
						complete: e.currentTarget.checked,
						status:
							e.currentTarget.checked === true ? 'awaiting_approval' : 'open',
				  }
				: { ...data };
		});
		this.setState({
			taskListItems: taskListItemsUpdated,
		});

		var userData = taskListItemsUpdated.find((data) => data._id === taskId);

		dispatch(taskActions.sendUpdateTask(userData)).then((taskRes) => {
			if (taskRes.success) {
				taskRes.item.complete
					? alert('Task marked as completed. Please wait for approval.')
					: alert('Task has been unmarked.');
			} else {
				alert('ERROR - Check logs');
			}
		});
	}

	_handleApproveButton(e, taskId) {
		const { dispatch } = this.props;
		const { taskListItems } = this.state;

		var taskListItemsUpdated = taskListItems.map((data) => {
			return data._id === taskId
				? {
						...data,
						status: 'approved',
				  }
				: { ...data };
		});

		this.setState({
			taskListItems: taskListItemsUpdated,
		});

		var userData = taskListItemsUpdated.find((data) => data._id === taskId);

		dispatch(taskActions.sendUpdateTask(userData)).then((taskRes) => {
			if (taskRes.success) {
				taskRes.item.status === 'approved' &&
					alert('Task completion approved!');
			} else {
				alert('ERROR - Check logs');
			}
		});
	}

	_handleRejectButton(e, taskId) {
		const { dispatch } = this.props;
		const { taskListItems } = this.state;

		var taskListItemsUpdated = taskListItems.map((data) => {
			return data._id === taskId
				? {
						...data,
						complete: false,
						status: 'open',
				  }
				: { ...data };
		});
		this.setState({
			taskListItems: taskListItemsUpdated,
		});

		var userData = taskListItemsUpdated.find((data) => data._id === taskId);

		dispatch(taskActions.sendUpdateTask(userData)).then((taskRes) => {
			if (taskRes.success) {
				taskRes.item.status === 'open' && alert('Task completion rejected!');
			} else {
				alert('ERROR - Check logs');
			}
		});
	}

	_handleFormChange(e) {
		/**
		 * This let's us change arbitrarily nested objects with one pass
		 */
		let newState = _.update(this.state, e.target.name, () => {
			return e.target.value;
		});
		this.setState({ newState });
	}

	_handleTaskSubmit(e) {
		e.preventDefault();
		const { defaultTask, dispatch, match } = this.props;
		const { taskListItems } = this.state;

		let newTask = { ...this.state.task, complete: false };

		newTask._flow = match.params.flowId;
		dispatch(taskActions.sendCreateTask(newTask)).then((taskRes) => {
			if (taskRes.success) {
				let taskListItemsUpdated = [...taskListItems, taskRes.item];

				dispatch(taskActions.invalidateList('_flow', match.params.flowId));

				this.setState({
					showTaskForm: false,
					task: _.cloneDeep(defaultTask.obj),
					taskListItems: taskListItemsUpdated,
				});
			} else {
				alert('ERROR - Check logs');
			}
		});
	}

	render() {
		const { showTaskForm, task, formHelpers, taskListItems } = this.state;
		const { defaultTask, flowStore, match, taskStore, user } = this.props;

		/**
		 *
		 * use the selected.getItem() utility to pull the actual flow object from the map
		 */
		const selectedFlow = flowStore.selected.getItem();

		// get the taskList meta info here so we can reference 'isFetching'
		const taskList =
			taskStore.lists && taskStore.lists._flow
				? taskStore.lists._flow[match.params.flowId]
				: null;

		/**
		 * use the reducer getList utility to convert the all.items array of ids
		 * to the actual task objetcs
		 */

		const isFlowEmpty =
			!selectedFlow || !selectedFlow._id || flowStore.selected.didInvalidate;

		const isFlowFetching = flowStore.selected.isFetching;

		const isTaskListEmpty = !taskListItems || !taskList;

		const isTaskListFetching =
			!taskListItems || !taskList || taskList.isFetching;

		const isNewTaskEmpty = !task;

		var completedTask = 0;

		taskListItems.map((task, i) => {
			task.complete === true && task.status === 'approved' && completedTask++;
		});

		return (
			<FlowLayout>
				<h3> Single Flow </h3>
				{isFlowEmpty ? (
					isFlowFetching ? (
						<h2>Loading...</h2>
					) : (
						<h2>Empty.</h2>
					)
				) : (
					<div style={{ opacity: isFlowFetching ? 0.5 : 1 }}>
						<h1> {selectedFlow.name}</h1>
						<p> {selectedFlow.description}</p>
						<Link
							className='yt-btn x-small bordered'
							to={`${this.props.match.url}/update`}
						>
							Edit
						</Link>
						<hr />
						{isTaskListEmpty ? (
							isTaskListFetching ? (
								<h2>Loading...</h2>
							) : (
								<h2>Empty.</h2>
							)
						) : (
							<div style={{ opacity: isTaskListFetching ? 0.5 : 1 }}>
								<h3> Ongoing Tasks </h3>
								<ul style={{ listStyle: 'none' }}>
									{taskListItems.length > 0 &&
										taskListItems.map((task, i) => {
											return (
												task.status !== 'approved' && (
													<li
														key={task._id + i}
														style={{ marginBottom: '35px' }}
													>
														<TaskCheck
															task={task}
															taskLabel={task.name}
															handleFormChange={(e) =>
																this._handleCheckChange(e, task._id)
															}
															handleFormSubmit={this._handleTaskSubmit}
														/>
														<div style={{ marginLeft: 25 }}>
															<TaskApproval
																user={user}
																task={task}
																handleApproveButton={(e) =>
																	this._handleApproveButton(e, task._id)
																}
																handleRejectButton={(e) =>
																	this._handleRejectButton(e, task._id)
																}
															/>
														</div>
														<div style={{ marginLeft: 25 }}>
															<p>Decription: {task.description}</p>

															<Link
																className='yt-btn x-small bordered'
																to={`/tasks/${task._id}`}
															>
																Comment
															</Link>
														</div>
													</li>
												)
											);
										})}
								</ul>
							</div>
						)}
						{!isNewTaskEmpty && showTaskForm ? (
							<div>
								<TaskForm
									task={task}
									cancelAction={() =>
										this.setState({
											showTaskForm: false,
											task: _.cloneDeep(defaultTask.obj),
										})
									}
									formHelpers={formHelpers}
									formTitle='Create Task'
									formType='create'
									handleFormChange={this._handleFormChange}
									handleFormSubmit={this._handleTaskSubmit}
								/>
							</div>
						) : (
							<button
								className='yt-btn'
								onClick={() => this.setState({ showTaskForm: true })}
							>
								Add new task
							</button>
						)}

						<div
							style={{
								opacity: isTaskListFetching ? 0.5 : 1,
								margin: '30px 0',
							}}
						>
							<hr />
							<h3> Completed Tasks </h3>
							{completedTask > 0 ? (
								<ul style={{ listStyle: 'none' }}>
									{taskListItems.map((task, i) => {
										return (
											task.complete === true &&
											task.status === 'approved' && (
												<li key={task._id + i} style={{ marginBottom: '35px' }}>
													<TaskCheck
														task={task}
														cancelAction={() =>
															this.setState({
																showTaskForm: false,
																task: _.cloneDeep(defaultTask.obj),
															})
														}
														formHelpers={formHelpers}
														formType='create'
														taskLabel={task.name}
														handleFormChange={(e) =>
															this._handleCheckChange(e, task._id)
														}
													/>
													<span style={{ fontStyle: 'italic' }}>
														{task.status === 'awaiting_approval' &&
															'(Awaiting admin approval)'}
													</span>
													<div style={{ marginLeft: 25 }}>
														<p>Decription: {task.description}</p>
														<Link
															className='yt-btn x-small bordered'
															to={`/tasks/${task._id}`}
														>
															Comment
														</Link>
													</div>
												</li>
											)
										);
									})}
								</ul>
							) : (
								<p>List is empty.</p>
							)}
						</div>
					</div>
				)}
			</FlowLayout>
		);
	}
}

SingleFlow.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */
	return {
		user: store.user.loggedIn.user,
		defaultTask: store.task.defaultItem,
		flowStore: store.flow,
		taskStore: store.task,
	};
};

export default withRouter(connect(mapStoreToProps)(SingleFlow));
