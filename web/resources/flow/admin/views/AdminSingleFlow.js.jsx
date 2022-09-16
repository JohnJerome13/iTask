/**
 * View component for /admin/flows/:flowId
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
import * as flowActions from '../../flowActions';

// import global components
import Binder from '../../../../global/components/Binder.js.jsx';
import Breadcrumbs from '../../../../global/components/navigation/Breadcrumbs.js.jsx';

// import resource components
import AdminFlowLayout from '../components/AdminFlowLayout.js.jsx';


class AdminSingleFlow extends Binder {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(flowActions.fetchSingleIfNeeded(match.params.flowId));
  }

  render() {
    const { location, flowStore } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual flow object from the map
     */
    const selectedFlow = flowStore.selected.getItem();

    const isEmpty = (
      !selectedFlow
      || !selectedFlow._id
      || flowStore.selected.didInvalidate
    );

    const isFetching = (
      flowStore.selected.isFetching
    )

    return (
      <AdminFlowLayout>
        <Breadcrumbs links={location.state.breadcrumbs} />
        <h3> Single Flow </h3>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <h1> { selectedFlow.name }
            </h1>
            <hr/>
            <p> <em>Other characteristics about the Flow would go here.</em></p>
            <br/>
            <Link to={`${this.props.match.url}/update`}> Update Flow </Link>
          </div>
        }
      </AdminFlowLayout>
    )
  }
}

AdminSingleFlow.propTypes = {
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
  )(AdminSingleFlow)
);
