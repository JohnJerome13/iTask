/**
 * View component for /flows/:flowId/update
 *
 * Updates a single flow from a copy of the selcted flow
 * as defined in the flow reducer
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history, withRouter } from 'react-router-dom';

// import third-party libraries
import _ from 'lodash';

// import actions
import * as flowActions from '../flowActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import FlowForm from '../components/FlowForm.js.jsx';
import FlowLayout from '../components/FlowLayout.js.jsx';

class UpdateFlow extends Binder {
  constructor(props) {
    super(props);
    const { match, flowStore } = this.props;
    this.state = {
      flow: flowStore.byId[match.params.flowId] ?  _.cloneDeep(flowStore.byId[match.params.flowId]) : {}
      // NOTE: ^ we don't want to change the store, just make changes to a copy
      , formHelpers: {}
      /**
       * NOTE: formHelpers are useful for things like radio controls and other
       * things that manipulate the form, but don't directly effect the state of
       * the flow
       */
    }
    this._bind(
      '_handleFormChange'
      , '_handleFormSubmit'
    );
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(flowActions.fetchSingleIfNeeded(match.params.flowId))
  }

  componentWillReceiveProps(nextProps) {
    const { match, flowStore } = nextProps;
    this.setState({
      flow: flowStore.byId[match.params.flowId] ?  _.cloneDeep(flowStore.byId[match.params.flowId]) : {}
      // NOTE: ^ we don't want to actually change the store's flow, just use a copy
    })
  }

  _handleFormChange(e) {
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }

  _handleFormSubmit(e) {
    const { dispatch, history } = this.props;
    e.preventDefault();
    dispatch(flowActions.sendUpdateFlow(this.state.flow)).then(flowRes => {
      if(flowRes.success) {
        history.push(`/flows/${flowRes.item._id}`)
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const {
      location
      , match
      , flowStore
    } = this.props;
    const { flow, formHelpers } = this.state;

    const selectedFlow = flowStore.selected.getItem();

    const isEmpty = (
      !flow
      || !flow._id
    );

    const isFetching = (
      !flowStore.selected.id
      || flowStore.selected.isFetching
    )

    return  (
      <FlowLayout>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <FlowForm
            flow={flow}
            cancelLink={`/flows/${flow._id}`}
            formHelpers={formHelpers}
            formTitle="Update Flow"
            formType="update"
            handleFormChange={this._handleFormChange}
            handleFormSubmit={this._handleFormSubmit}
          />
        }
      </FlowLayout>
    )
  }
}

UpdateFlow.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    flowStore: store.flow
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(UpdateFlow)
);
