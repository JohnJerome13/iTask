/**
 * All Flow CRUD actions
 *
 * Actions are payloads of information that send data from the application
 * (i.e. Yote server) to the store. They are the _only_ source of information
 * for the store.
 *
 * NOTE: In Yote, we try to keep actions and reducers dealing with CRUD payloads
 * in terms of 'item' or 'items'. This keeps the action payloads consistent and
 * aides various scoping issues with list management in the reducers.
 */

// import api utility
import apiUtils from '../../global/utils/api'

const shouldFetchSingle = (state, id) => {
  /**
   * This is helper method to determine whether we should fetch a new single
   * user object from the server, or if a valid one already exists in the store
   *
   * NOTE: Uncomment console logs to help debugging
   */
  // console.log("shouldFetch single");
  const { byId, selected } = state.flow;
  if(selected.id !== id) {
    // the "selected" id changed, so we _should_ fetch
    // console.log("Y shouldFetch - true: id changed");
    return true;
  } else if(selected.isFetching) {
    // "selected" is already fetching, don't do anything
    // console.log("Y shouldFetch - false: isFetching");
    return false;
  } else if(!byId[id] && !selected.error) {
    // the id is not in the map, fetch from server
    // however, if the api returned an error, then it SHOULDN'T be in the map
    // so re-fetching it will result in an infinite loop
    // console.log("Y shouldFetch - true: not in map");
    return true;
  } else if(new Date().getTime() - selected.lastUpdated > (1000 * 60 * 5)) {
    // it's been longer than 5 minutes since the last fetch, get a new one
    // console.log("Y shouldFetch - true: older than 5 minutes");
    // also, don't automatically invalidate on server error. if server throws an error,
    // that won't change on subsequent requests and we will have an infinite loop
    return true;
  } else {
    // if "selected" is invalidated, fetch a new one, otherwise don't
    // console.log("Y shouldFetch - " + selected.didInvalidate + ": didInvalidate");
    return selected.didInvalidate;
  }
}

export const INVALIDATE_SELECTED_FLOW = "INVALIDATE_SELECTED_FLOW"
export function invalidateSelected() {
  return {
    type: INVALIDATE_SELECTED_FLOW
  }
}

export const fetchSingleIfNeeded = (id) => (dispatch, getState) => {
  if (shouldFetchSingle(getState(), id)) {
    return dispatch(fetchSingleFlowById(id))
  } else {
    return dispatch(returnSingleFlowPromise(id)); // return promise that contains flow
  }
}

export const returnSingleFlowPromise = (id) => (dispatch, getState) => {
  /**
   * This returns the object from the map so that we can do things with it in
   * the component.
   *
   * For the "fetchIfNeeded()" functionality, we need to return a promised object
   * EVEN IF we don't need to fetch it. this is because if we have any .then()'s
   * in the components, they will fail when we don't need to fetch.
   */
  return new Promise((resolve, reject) => {
    resolve({
      type: "RETURN_SINGLE_FLOW_WITHOUT_FETCHING"
      , id: id
      , item: getState().flow.byId[id]
      , success: true
    })
  });
}

export const REQUEST_SINGLE_FLOW = "REQUEST_SINGLE_FLOW";
function requestSingleFlow(id) {
  return {
    type: REQUEST_SINGLE_FLOW
    , id
  }
}

export const RECEIVE_SINGLE_FLOW = "RECEIVE_SINGLE_FLOW";
function receiveSingleFlow(json) {
  return {
    type: RECEIVE_SINGLE_FLOW
    , id: json.flow ? json.flow._id : null
    , item: json.flow
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function fetchSingleFlowById(flowId) {
  return dispatch => {
    dispatch(requestSingleFlow(flowId))
    return apiUtils.callAPI(`/api/flows/${flowId}`)
      .then(json => dispatch(receiveSingleFlow(json)))
  }
}

export const ADD_SINGLE_FLOW_TO_MAP = "ADD_SINGLE_FLOW_TO_MAP";
export function addSingleFlowToMap(item) {
  return {
    type: ADD_SINGLE_FLOW_TO_MAP
    , item
  }
}

export const SET_SELECTED_FLOW = "SET_SELECTED_FLOW";
export function setSelectedFlow(item) {
  return {
    type: SET_SELECTED_FLOW
    , item
  }
}


export const REQUEST_DEFAULT_FLOW = "REQUEST_DEFAULT_FLOW";
function requestDefaultFlow(id) {
  return {
    type: REQUEST_DEFAULT_FLOW
  }
}

export const RECEIVE_DEFAULT_FLOW = "RECEIVE_DEFAULT_FLOW";
function receiveDefaultFlow(json) {
  return {
    error: json.message
    , defaultObj: json.defaultObj
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVE_DEFAULT_FLOW
  }
}

export function fetchDefaultFlow() {
  return dispatch => {
    dispatch(requestDefaultFlow())
    return apiUtils.callAPI(`/api/flows/default`)
      .then(json => dispatch(receiveDefaultFlow(json)))
  }
}


export const REQUESTFLOW_SCHEMA = "REQUESTFLOW_SCHEMA";
function requestFlowSchema(id) {
  return {
    type: REQUESTFLOW_SCHEMA
  }
}

export const RECEIVEFLOW_SCHEMA = "RECEIVEFLOW_SCHEMA";
function receiveFlowSchema(json) {
  return {
    error: json.message
    , schema: json.schema
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVEFLOW_SCHEMA
  }
}

export function fetchFlowSchema() {
  return dispatch => {
    dispatch(requestFlowSchema())
    return apiUtils.callAPI(`/api/flows/schema`)
      .then(json => dispatch(receiveFlowSchema(json)))
  }
}


export const REQUEST_CREATE_FLOW = "REQUEST_CREATE_FLOW";
function requestCreateFlow(flow) {
  return {
    type: REQUEST_CREATE_FLOW
    , flow
  }
}

export const RECEIVE_CREATE_FLOW = "RECEIVE_CREATE_FLOW";
function receiveCreateFlow(json) {
  return {
    type: RECEIVE_CREATE_FLOW
    , id: json.flow ? json.flow._id : null
    , item: json.flow
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function sendCreateFlow(data) {
  return dispatch => {
    dispatch(requestCreateFlow(data))
    return apiUtils.callAPI('/api/flows', 'POST', data)
      .then(json => dispatch(receiveCreateFlow(json)))
  }
}

export const REQUEST_UPDATE_FLOW = "REQUEST_UPDATE_FLOW";
function requestUpdateFlow(flow) {
  return {
    id: flow ? flow._id : null
    , flow
    , type: REQUEST_UPDATE_FLOW
  }
}

export const RECEIVE_UPDATE_FLOW = "RECEIVE_UPDATE_FLOW";
function receiveUpdateFlow(json) {
  return {
    type: RECEIVE_UPDATE_FLOW
    , id: json.flow ? json.flow._id : null
    , item: json.flow
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function sendUpdateFlow(data) {
  return dispatch => {
    dispatch(requestUpdateFlow(data))
    return apiUtils.callAPI(`/api/flows/${data._id}`, 'PUT', data)
      .then(json => dispatch(receiveUpdateFlow(json)))
  }
}

export const REQUEST_DELETE_FLOW = "REQUEST_DELETE_FLOW";
function requestDeleteFlow(id) {
  return {
    type: REQUEST_DELETE_FLOW
    , id
  }
}

export const RECEIVE_DELETE_FLOW = "RECEIVE_DELETE_FLOW";
function receiveDeleteFlow(id, json) {
  return {
    id
    , error: json.message
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVE_DELETE_FLOW
  }
}

export function sendDelete(id) {
  return dispatch => {
    dispatch(requestDeleteFlow(id))
    return apiUtils.callAPI(`/api/flows/${id}`, 'DELETE')
      .then(json => dispatch(receiveDeleteFlow(id, json)))
  }
}


/**
 * FLOW LIST ACTIONS
 */

const findListFromArgs = (state, listArgs) => {
  /**
   * Helper method to find appropriate list from listArgs.
   *
   * Because we nest flowLists to arbitrary locations/depths,
   * finding the correct list becomes a little bit harder
   */
  // let list = Object.assign({}, state.flow.lists, {});
  let list = { ...state.flow.lists }
  for(let i = 0; i < listArgs.length; i++) {
    list = list[listArgs[i]];
    if(!list) {
      return false;
    }
  }
  return list;
}

const shouldFetchList = (state, listArgs) => {
  /**
   * Helper method to determine whether to fetch the list or not from arbitrary
   * listArgs
   *
   * NOTE: Uncomment console logs to help debugging
   */
  // console.log("shouldFetchList with these args ", listArgs, "?");
  const list = findListFromArgs(state, listArgs);
  // console.log("LIST in question: ", list);
  if(!list || !list.items) {
    // yes, the list we're looking for wasn't found
    // console.log("X shouldFetch - true: list not found");
    return true;
  } else if(list.isFetching) {
    // no, this list is already fetching
    // console.log("X shouldFetch - false: fetching");
    return false
  } else if(new Date().getTime() - list.lastUpdated > (1000 * 60 * 5)) {
    // yes, it's been longer than 5 minutes since the last fetch
    // console.log("X shouldFetch - true: older than 5 minutes");
    return true;
  } else {
    // maybe, depends on if the list was invalidated
    // console.log("X shouldFetch - " + list.didInvalidate + ": didInvalidate");
    return list.didInvalidate;
  }
}

export const fetchListIfNeeded = (...listArgs) => (dispatch, getState) => {
  if(listArgs.length === 0) {
    // If no arguments passed, make the list we want "all"
    listArgs = ["all"];
  }
  if(shouldFetchList(getState(), listArgs)) {
    return dispatch(fetchList(...listArgs));
  } else {
    return dispatch(returnFlowListPromise(...listArgs));
  }
}

export const returnFlowListPromise = (...listArgs) => (dispatch, getState) => {
  /**
   * This returns the list object from the reducer so that we can do things with it in
   * the component.
   *
   * For the "fetchIfNeeded()" functionality, we need to return a promised object
   * EVEN IF we don't need to fetch it. This is because if we have any .then()'s
   * in the components, they will fail when we don't need to fetch.
   */

  // return the array of objects just like the regular fetch
  const state = getState();
  const listItemIds = findListFromArgs(state, listArgs).items
  const listItems = listItemIds.map(id => state.flow.byId[id]);

  return new Promise((resolve) => {
    resolve({
      list: listItems
      , listArgs: listArgs
      , success: true
      , type: "RETURN_FLOW_LIST_WITHOUT_FETCHING"
    })
  });
}

export const REQUEST_FLOW_LIST = "REQUEST_FLOW_LIST"
function requestFlowList(listArgs) {
  return {
    type: REQUEST_FLOW_LIST
    , listArgs
  }
}

export const RECEIVE_FLOW_LIST = "RECEIVE_FLOW_LIST"
function receiveFlowList(json, listArgs) {
  return {
    type: RECEIVE_FLOW_LIST
    , listArgs
    , list: json.flows
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export const ADD_FLOW_TO_LIST = "ADD_FLOW_TO_LIST";
export function addFlowToList(id, ...listArgs) {
  // console.log("Add flow to list", id);
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: ADD_FLOW_TO_LIST
    , id
    , listArgs
  }
}

export const REMOVE_FLOW_FROM_LIST = "REMOVE_FLOW_FROM_LIST"
export function removeFlowFromList(id, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ['all'];
  }
  return {
    type: REMOVE_FLOW_FROM_LIST
    , id
    , listArgs
  }
}

export function fetchList(...listArgs) {
  return dispatch => {
    if(listArgs.length === 0) {
      // default to "all" list if we don't pass any listArgs
      listArgs = ["all"];
    }
    dispatch(requestFlowList(listArgs))
    /**
     * determine what api route we want to hit
     *
     * NOTE: use listArgs to determine what api call to make.
     * if listArgs[0] == null or "all", return list
     *
     * if listArgs has 1 arg, return "/api/flows/by-[ARG]"
     *
     * if 2 args, additional checks required.
     *  if 2nd arg is a string, return "/api/flows/by-[ARG1]/[ARG2]".
     *    ex: /api/flows/by-category/:category
     *  if 2nd arg is an array, though, return "/api/flows/by-[ARG1]-list" with additional query string
     *
     * TODO:  make this accept arbitrary number of args. Right now if more
     * than 2, it requires custom checks on server
     */
    let apiTarget = "/api/flows";
    if(listArgs.length == 1 && listArgs[0] !== "all") {
      apiTarget += `/by-${listArgs[0]}`;
    } else if(listArgs.length == 2 && Array.isArray(listArgs[1])) {
      // length == 2 has it's own check, specifically if the second param is an array
      // if so, then we need to call the "listByValues" api method instead of the regular "listByRef" call
      // this can be used for querying for a list of flows given an array of flow id's, among other things
      apiTarget += `/by-${listArgs[0]}-list?`;
      // build query string
      for(let i = 0; i < listArgs[1].length; i++) {
        apiTarget += `${listArgs[0]}=${listArgs[1][i]}&`
      }
    } else if(listArgs.length == 2) {
      // ex: ("author","12345")
      apiTarget += `/by-${listArgs[0]}/${listArgs[1]}`;
    } else if(listArgs.length > 2) {
      apiTarget += `/by-${listArgs[0]}/${listArgs[1]}`;
      for(let i = 2; i < listArgs.length; i++) {
        apiTarget += `/${listArgs[i]}`;
      }
    }
    return apiUtils.callAPI(apiTarget).then(
      json => dispatch(receiveFlowList(json, listArgs))
    )
  }
}

/**
 * LIST UTIL METHODS
 */
export const SET_FLOW_FILTER = "SET_FLOW_FILTER"
export function setFilter(filter, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: SET_FLOW_FILTER
    , filter
    , listArgs
  }
}

export const SET_FLOW_PAGINATION = "SET_FLOW_PAGINATION"
export function setPagination(pagination, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: SET_FLOW_PAGINATION
    , pagination
    , listArgs
  }
}

export const INVALIDATE_FLOW_LIST = "INVALIDATE_FLOW_LIST"
export function invalidateList(...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: INVALIDATE_FLOW_LIST
    , listArgs
  }
}
