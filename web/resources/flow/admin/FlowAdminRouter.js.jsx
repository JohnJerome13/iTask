/**
 * Sets up the routing for all Flow views.
 *
 * NOTE: As an example, we've included two other Route Components that protect a given
 * path: LoginRoute and RoleRoute
 *
 * LoginRoute simply checks if the user is logged in and if NOT, it redirects
 * them to the login page.
 *
 * RoleRoute protects the path to make sure the user is A) logged in and B) has
 * role matching the path=/admin/flows.
 */

// import primary libraries
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';
import YTRoute from '../../../global/components/routing/YTRoute.js.jsx';

// import flow views
import AdminCreateFlow from './views/AdminCreateFlow.js.jsx';
import AdminFlowList from './views/AdminFlowList.js.jsx';
import AdminSingleFlow from './views/AdminSingleFlow.js.jsx';
import AdminUpdateFlow from './views/AdminUpdateFlow.js.jsx';

class FlowAdminRouter extends Binder {
  constructor(props) {
    super(props);
  }

  render() {
    let singleFlowPath = this.props.location.pathname.replace('/update', '');
    return (
      <Switch>
        <YTRoute
          breadcrumbs={[{display: 'Dashboard', path: '/admin'}, {display: 'All flows', path: null }]}
          component={AdminFlowList}
          exact
          path="/admin/flows"
          role="admin"
        />
        <YTRoute
          breadcrumbs={[{display: 'Dashboard', path: '/admin'}, {display: 'All flows', path: '/admin/flows'}, {display: 'New ', path: null}]}
          component={AdminCreateFlow}
          exact
          path="/admin/flows/new"
          role="admin"
        />
        <YTRoute
          breadcrumbs={[{display: 'Dashboard', path: '/admin'}, {display: 'All flows', path: '/admin/flows'}, {display: 'Flow details', path: null}]}
          component={AdminSingleFlow}
          exact
          path="/admin/flows/:flowId"
          role="admin"
        />
        <YTRoute
          breadcrumbs={[{display: 'Dashboard', path: '/admin'}, {display: 'All flows', path: '/admin/flows'}, {display: 'Flow Details', path: singleFlowPath}, {display: 'Update', path: null}]}
          component={AdminUpdateFlow}
          exact
          path="/admin/flows/:flowId/update"
          role="admin"
        />
      </Switch>
    )
  }
}

export default FlowAdminRouter;
