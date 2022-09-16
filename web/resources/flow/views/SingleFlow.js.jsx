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

class SingleFlow extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      showTaskForm: false 
      , task: _.cloneDeep(this.props.defaultTask.obj)
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      , taskFormHelpers: {}
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the task
       */
    }
    this._bind(
      '_handleFormChange'
      , '_handleTaskSubmit'
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
    this.setState({
      task: _.cloneDeep(nextProps.defaultTask.obj)
    })
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }


  _handleTaskSubmit(e) {
    e.preventDefault();
    const { defaultTask, dispatch, match } = this.props;
    let newTask = {...this.state.task}
    newTask._flow = match.params.flowId;
    dispatch(taskActions.sendCreateTask(newTask)).then(taskRes => {
      if(taskRes.success) {
        dispatch(taskActions.invalidateList('_flow', match.params.flowId));
        this.setState({
          showTaskForm: false
          , task: _.cloneDeep(defaultTask.obj)
        })
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { showTaskForm, task, formHelpers } = this.state;
    const { 
      defaultTask      
      , flowStore
      , match
      , taskStore 
    } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual flow object from the map
     */
    const selectedFlow = flowStore.selected.getItem();


    // get the taskList meta info here so we can reference 'isFetching'
    const taskList = taskStore.lists && taskStore.lists._flow ? taskStore.lists._flow[match.params.flowId] : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual task objetcs
     */
    const taskListItems = taskStore.util.getList("_flow", match.params.flowId);
    
    const isFlowEmpty = (
      !selectedFlow
      || !selectedFlow._id
      || flowStore.selected.didInvalidate
    );

    const isFlowFetching = (
      flowStore.selected.isFetching
    )

    const isTaskListEmpty = (
      !taskListItems
      || !taskList
    );

    const isTaskListFetching = (
      !taskListItems
      || !taskList
      || taskList.isFetching
    )


    const isNewTaskEmpty = !task;

    return (
      <FlowLayout>
        <h3> Single Flow </h3>
        { isFlowEmpty ?
          (isFlowFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFlowFetching ? 0.5 : 1 }}>
            <h1> { selectedFlow.name }
            </h1>
            <p> { selectedFlow.description }</p>
            <Link className="yt-btn x-small bordered" to={`${this.props.match.url}/update`}> Edit </Link>
            <hr/>
            { isTaskListEmpty ?
              (isTaskListFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <div style={{ opacity: isTaskListFetching ? 0.5 : 1 }}>
                <ul>
                  {taskListItems.map((task, i) =>
                    <li key={task._id + i}>
                      <h3>{task.name}</h3>
                      <p>{task.description}</p>
                    </li>
                  )}
                </ul>
              </div>
            }
            { !isNewTaskEmpty && showTaskForm ?
              <div>
                <TaskForm
                  task={task}
                  cancelAction={() => this.setState({showTaskForm: false, task: _.cloneDeep(defaultTask.obj)})}
                  formHelpers={formHelpers}
                  formTitle="Create Task"
                  formType="create"
                  handleFormChange={this._handleFormChange}
                  handleFormSubmit={this._handleTaskSubmit}
                />
              </div>
              : 
              <button className="yt-btn" onClick={() => this.setState({showTaskForm: true})}>Add new task</button>
            }
          </div>
        }
      </FlowLayout>
    )
  }
}

SingleFlow.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    defaultTask: store.task.defaultItem
    , flowStore: store.flow
    , taskStore: store.task
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleFlow)
);
