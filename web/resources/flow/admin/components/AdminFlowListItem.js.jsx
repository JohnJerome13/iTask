// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import _ from 'lodash';
import { DateTime } from 'luxon';

const AdminFlowListItem = ({
  flow
}) => {
  return (
    <tr >
      <td><Link to={`/admin/flows/${flow._id}`}>{flow.name}</Link></td>
      <td>{DateTime.fromISO(flow.updated).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td className="u-textRight"><Link to={`/admin/flows/${flow._id}/update`}>Update</Link></td>
    </tr>
  )
}

AdminFlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default AdminFlowListItem;
