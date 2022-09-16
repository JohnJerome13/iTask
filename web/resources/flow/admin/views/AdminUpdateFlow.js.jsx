/**
 * View component for /admin/flows/:flowId/update
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
import * as flowActions from '../../flowActions';

// import global components
import Binder from '../../../../global/components/Binder.js.jsx';
import Breadcrumbs from '../../../../global/components/navigation/Breadcrumbs.js.jsx';

// import resource components
import AdminFlowForm from '../components/AdminFlowForm.js.jsx';
import AdminFlowLayout from '../components/AdminFlowLayout.js.jsx';

class AdminUpdateFlow extends Binder {
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
        history.push(`/admin/flows/${flowRes.item._id}`)
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
      <AdminFlowLayout>
        <Breadcrumbs links={location.state.breadcrumbs} />
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <AdminFlowForm
            flow={flow}
            cancelLink={`/admin/flows/${flow._id}`}
            formHelpers={formHelpers}
            formTitle="Update Flow"
            formType="update"
            handleFormChange={this._handleFormChange}
            handleFormSubmit={this._handleFormSubmit}
          />
        }
      </AdminFlowLayout>
    )
  }
}

AdminUpdateFlow.propTypes = {
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
  )(AdminUpdateFlow)
);
