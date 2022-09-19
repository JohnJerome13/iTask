/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';
import * as noteActions from '../../note/noteActions';
import * as userActions from '../../user/userActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';
import NoteForm from '../../note/components/NoteForm.js.jsx';
import TaskCheck from '../../task/components/TaskCheck.js.jsx';
import TaskApproval from '../../task/components/TaskApproval.js.jsx';

class SingleTask extends Binder {
	constructor(props) {
		super(props);
		this.state = {
			showNoteForm: false,
			note: _.cloneDeep(this.props.defaultNote.obj),
			selectedTask: {},
			// NOTE: We don't want to actually change the store's defaultItem, just use a copy
			noteFormHelpers: {},
			/**
			 * NOTE: formHelpers are useful for things like radio controls and other
			 * things that manipulate the form, but don't directly effect the state of
			 * the task
			 */
		};
		this._bind(
			'_handleFormChange',
			'_handleNoteSubmit',
			'_handleCheckChange',
			'_handleApproveButton',
			'_handleRejectButton'
		);
	}

	componentDidMount() {
		const { dispatch, match } = this.props;
		dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
		dispatch(noteActions.fetchDefaultNote());
		dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
		dispatch(userActions.fetchListIfNeeded());
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, taskStore, match } = this.props;

		dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
		const selectedTask = taskStore.selected.getItem();

		this.setState({
			note: _.cloneDeep(nextProps.defaultNote.obj),
			selectedTask: selectedTask,
		});
	}

	_handleCheckChange(e) {
		const { dispatch } = this.props;
		const { selectedTask } = this.state;

		var selectedTaskUpdated = {
			...selectedTask,
			complete: e.currentTarget.checked,
			status: e.currentTarget.checked === true ? 'awaiting_approval' : 'open',
		};

		dispatch(taskActions.sendUpdateTask(selectedTaskUpdated)).then(
			(taskRes) => {
				if (taskRes.success) {
					taskRes.item.complete
						? alert('Task marked as completed. Please wait for approval.')
						: alert('Task has been unmarked.');

					this.setState({
						selectedTask: selectedTaskUpdated,
					});
				} else {
					alert('ERROR - Check logs');
				}
			}
		);
	}

	_handleApproveButton() {
		const { dispatch } = this.props;
		const { selectedTask } = this.state;

		var selectedTaskUpdated = {
			...selectedTask,
			status: 'approved',
		};

		dispatch(taskActions.sendUpdateTask(selectedTaskUpdated)).then(
			(taskRes) => {
				if (taskRes.success) {
					taskRes.item.status === 'approved' &&
						alert('Task completion approved!');
					this.setState({
						selectedTask: selectedTaskUpdated,
					});
				} else {
					alert('ERROR - Check logs');
				}
			}
		);
	}

	_handleRejectButton() {
		const { dispatch } = this.props;
		const { selectedTask } = this.state;

		var selectedTaskUpdated = {
			...selectedTask,
			complete: false,
			status: 'open',
		};

		dispatch(taskActions.sendUpdateTask(selectedTaskUpdated)).then(
			(taskRes) => {
				if (taskRes.success) {
					taskRes.item.status === 'open' && alert('Task completion rejected!');
					this.setState({
						selectedTask: selectedTaskUpdated,
					});
				} else {
					alert('ERROR - Check logs');
				}
			}
		);
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

	_handleNoteSubmit(e) {
		e.preventDefault();
		const { defaultNote, dispatch, match, user } = this.props;
		let newNote = { ...this.state.note, _user: user._id };
		newNote._task = match.params.taskId;
		dispatch(noteActions.sendCreateNote(newNote)).then((noteRes) => {
			if (noteRes.success) {
				dispatch(noteActions.invalidateList('_task', match.params.taskId));
				this.setState({
					showNoteForm: false,
					note: _.cloneDeep(defaultNote.obj),
				});
			} else {
				alert('ERROR - Check logs');
			}
		});
	}

	render() {
		const { showNoteForm, note, formHelpers, selectedTask } = this.state;

		const { defaultNote, taskStore, match, noteStore, noteData, user } =
			this.props;
		/**
		 * use the selected.getItem() utility to pull the actual task object from the map
		 */

		// get the taskList meta info here so we can reference 'isFetching'
		const noteList =
			noteStore.lists && noteStore.lists._task
				? noteStore.lists._task[match.params.taskId]
				: null;

		/**
		 * use the reducer getList utility to convert the all.items array of ids
		 * to the actual note objetcs
		 */

		const noteListItems = noteStore.util.getList('_task', match.params.taskId);

		const isEmpty =
			!selectedTask || !selectedTask._id || taskStore.selected.didInvalidate;

		const isFetching = taskStore.selected.isFetching;

		const isNoteListEmpty = !noteListItems || !noteList;

		const isNoteListFetching =
			!noteListItems || !noteList || noteList.isFetching;

		const isNewNoteEmpty = !note;

		return (
			<TaskLayout>
				<h3> Single Task </h3>
				{isEmpty ? (
					isFetching ? (
						<h2>Loading...</h2>
					) : (
						<h2>Empty.</h2>
					)
				) : (
					<div style={{ opacity: isFetching ? 0.5 : 1 }}>
						<TaskCheck
							task={selectedTask}
							taskLabel={selectedTask.name}
							handleFormChange={(e) =>
								this._handleCheckChange(e, match.params.taskId)
							}
							singleTask={true}
						/>
						<TaskApproval
							user={user}
							task={selectedTask}
							handleApproveButton={this._handleApproveButton}
							handleRejectButton={this._handleRejectButton}
						/>
						<p> {selectedTask.description}</p>
						<Link
							className='yt-btn x-small bordered'
							to={`${this.props.match.url}/update`}
						>
							Edit
						</Link>
						<hr />
						{isNoteListEmpty ? (
							isNoteListFetching ? (
								<h2>Loading...</h2>
							) : (
								<h2>Empty.</h2>
							)
						) : (
							<div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
								<h4 style={{ fontWeight: 'bold' }}>Comments</h4>
								<ul>
									{noteData.map((note, i) => {
										var date = new Date(note.created);

										const dateTimeFormat = (date) => {
											var dateStr =
												(date.getMonth() > 8
													? date.getMonth() + 1
													: '0' + (date.getMonth() + 1)) +
												'/' +
												(date.getDate() > 9
													? date.getDate()
													: '0' + date.getDate()) +
												'/' +
												date.getFullYear();

											var hours = date.getHours();
											var minutes = date.getMinutes();
											var ampm = hours >= 12 ? 'pm' : 'am';
											hours = hours % 12;
											hours = hours ? hours : 12; // the hour '0' should be '12'
											minutes = minutes < 10 ? '0' + minutes : minutes;
											var strTime = hours + ':' + minutes + ' ' + ampm;

											return `${dateStr} @ ${strTime}`;
										};

										return (
											<li key={note._id + i} style={{ marginBlock: '15px' }}>
												<p style={{ fontWeight: 'bold', fontSize: 'large' }}>
													{note.userData &&
														`${note.userData.firstName} ${note.userData.lastName}`}
												</p>
												<span
													style={{
														color: '#8c8c8c',
														fontSize: 'small',
														marginTop: -210,
													}}
												>
													{dateTimeFormat(date)}
												</span>
												<p>{note.content}</p>
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{!isNewNoteEmpty && showNoteForm ? (
							<div>
								<NoteForm
									note={note}
									cancelAction={() =>
										this.setState({
											showNoteForm: false,
											note: _.cloneDeep(defaultNote.obj),
										})
									}
									formHelpers={formHelpers}
									formTitle='Create Comment'
									formType='create'
									// cancelLink={`/notes`}
									handleFormChange={this._handleFormChange}
									handleFormSubmit={this._handleNoteSubmit}
								/>
							</div>
						) : (
							<button
								className='yt-btn'
								onClick={() => this.setState({ showNoteForm: true })}
							>
								Add comment
							</button>
						)}
					</div>
				)}
			</TaskLayout>
		);
	}
}

SingleTask.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStoreToProps = (store, ownProps) => {
	/**
	 * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
	 * differentiated from the React component's internal state
	 */
	const noteStore = store.note.util.getList(
		'_task',
		ownProps.match.params.taskId
	);
	const userStore = store.user.util.getList();

	let noteList = [];

	if (noteStore && userStore) {
		var noteData;
		var userData;
		noteStore.map((note) => {
			var userList = userStore.map((user) => {
				return note._user === user._id && { ...user };
			});

			userData = userList.find((data) => data._id === note._user);
			noteData = {
				...note,
				userData,
			};
			noteList.push(noteData);
		});
	}

	return {
		defaultNote: store.note.defaultItem,
		user: store.user.loggedIn.user,
		taskStore: store.task,
		noteStore: store.note,
		userStore: store.user,
		noteData: noteList,
	};
};

export default withRouter(connect(mapStoreToProps)(SingleTask));
