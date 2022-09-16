/**
 * All Note CRUD actions
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
  const { byId, selected } = state.note;
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

export const INVALIDATE_SELECTED_NOTE = "INVALIDATE_SELECTED_NOTE"
export function invalidateSelected() {
  return {
    type: INVALIDATE_SELECTED_NOTE
  }
}

export const fetchSingleIfNeeded = (id) => (dispatch, getState) => {
  if (shouldFetchSingle(getState(), id)) {
    return dispatch(fetchSingleNoteById(id))
  } else {
    return dispatch(returnSingleNotePromise(id)); // return promise that contains note
  }
}

export const returnSingleNotePromise = (id) => (dispatch, getState) => {
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
      type: "RETURN_SINGLE_NOTE_WITHOUT_FETCHING"
      , id: id
      , item: getState().note.byId[id]
      , success: true
    })
  });
}

export const REQUEST_SINGLE_NOTE = "REQUEST_SINGLE_NOTE";
function requestSingleNote(id) {
  return {
    type: REQUEST_SINGLE_NOTE
    , id
  }
}

export const RECEIVE_SINGLE_NOTE = "RECEIVE_SINGLE_NOTE";
function receiveSingleNote(json) {
  return {
    type: RECEIVE_SINGLE_NOTE
    , id: json.note ? json.note._id : null
    , item: json.note
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function fetchSingleNoteById(noteId) {
  return dispatch => {
    dispatch(requestSingleNote(noteId))
    return apiUtils.callAPI(`/api/notes/${noteId}`)
      .then(json => dispatch(receiveSingleNote(json)))
  }
}

export const ADD_SINGLE_NOTE_TO_MAP = "ADD_SINGLE_NOTE_TO_MAP";
export function addSingleNoteToMap(item) {
  return {
    type: ADD_SINGLE_NOTE_TO_MAP
    , item
  }
}

export const SET_SELECTED_NOTE = "SET_SELECTED_NOTE";
export function setSelectedNote(item) {
  return {
    type: SET_SELECTED_NOTE
    , item
  }
}


export const REQUEST_DEFAULT_NOTE = "REQUEST_DEFAULT_NOTE";
function requestDefaultNote(id) {
  return {
    type: REQUEST_DEFAULT_NOTE
  }
}

export const RECEIVE_DEFAULT_NOTE = "RECEIVE_DEFAULT_NOTE";
function receiveDefaultNote(json) {
  return {
    error: json.message
    , defaultObj: json.defaultObj
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVE_DEFAULT_NOTE
  }
}

export function fetchDefaultNote() {
  return dispatch => {
    dispatch(requestDefaultNote())
    return apiUtils.callAPI(`/api/notes/default`)
      .then(json => dispatch(receiveDefaultNote(json)))
  }
}


export const REQUESTNOTE_SCHEMA = "REQUESTNOTE_SCHEMA";
function requestNoteSchema(id) {
  return {
    type: REQUESTNOTE_SCHEMA
  }
}

export const RECEIVENOTE_SCHEMA = "RECEIVENOTE_SCHEMA";
function receiveNoteSchema(json) {
  return {
    error: json.message
    , schema: json.schema
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVENOTE_SCHEMA
  }
}

export function fetchNoteSchema() {
  return dispatch => {
    dispatch(requestNoteSchema())
    return apiUtils.callAPI(`/api/notes/schema`)
      .then(json => dispatch(receiveNoteSchema(json)))
  }
}


export const REQUEST_CREATE_NOTE = "REQUEST_CREATE_NOTE";
function requestCreateNote(note) {
  return {
    type: REQUEST_CREATE_NOTE
    , note
  }
}

export const RECEIVE_CREATE_NOTE = "RECEIVE_CREATE_NOTE";
function receiveCreateNote(json) {
  return {
    type: RECEIVE_CREATE_NOTE
    , id: json.note ? json.note._id : null
    , item: json.note
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function sendCreateNote(data) {
  return dispatch => {
    dispatch(requestCreateNote(data))
    return apiUtils.callAPI('/api/notes', 'POST', data)
      .then(json => dispatch(receiveCreateNote(json)))
  }
}

export const REQUEST_UPDATE_NOTE = "REQUEST_UPDATE_NOTE";
function requestUpdateNote(note) {
  return {
    id: note ? note._id : null
    , note
    , type: REQUEST_UPDATE_NOTE
  }
}

export const RECEIVE_UPDATE_NOTE = "RECEIVE_UPDATE_NOTE";
function receiveUpdateNote(json) {
  return {
    type: RECEIVE_UPDATE_NOTE
    , id: json.note ? json.note._id : null
    , item: json.note
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function sendUpdateNote(data) {
  return dispatch => {
    dispatch(requestUpdateNote(data))
    return apiUtils.callAPI(`/api/notes/${data._id}`, 'PUT', data)
      .then(json => dispatch(receiveUpdateNote(json)))
  }
}

export const REQUEST_DELETE_NOTE = "REQUEST_DELETE_NOTE";
function requestDeleteNote(id) {
  return {
    type: REQUEST_DELETE_NOTE
    , id
  }
}

export const RECEIVE_DELETE_NOTE = "RECEIVE_DELETE_NOTE";
function receiveDeleteNote(id, json) {
  return {
    id
    , error: json.message
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVE_DELETE_NOTE
  }
}

export function sendDelete(id) {
  return dispatch => {
    dispatch(requestDeleteNote(id))
    return apiUtils.callAPI(`/api/notes/${id}`, 'DELETE')
      .then(json => dispatch(receiveDeleteNote(id, json)))
  }
}


/**
 * NOTE LIST ACTIONS
 */

const findListFromArgs = (state, listArgs) => {
  /**
   * Helper method to find appropriate list from listArgs.
   *
   * Because we nest noteLists to arbitrary locations/depths,
   * finding the correct list becomes a little bit harder
   */
  // let list = Object.assign({}, state.note.lists, {});
  let list = { ...state.note.lists }
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
    return dispatch(returnNoteListPromise(...listArgs));
  }
}

export const returnNoteListPromise = (...listArgs) => (dispatch, getState) => {
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
  const listItems = listItemIds.map(id => state.note.byId[id]);

  return new Promise((resolve) => {
    resolve({
      list: listItems
      , listArgs: listArgs
      , success: true
      , type: "RETURN_NOTE_LIST_WITHOUT_FETCHING"
    })
  });
}

export const REQUEST_NOTE_LIST = "REQUEST_NOTE_LIST"
function requestNoteList(listArgs) {
  return {
    type: REQUEST_NOTE_LIST
    , listArgs
  }
}

export const RECEIVE_NOTE_LIST = "RECEIVE_NOTE_LIST"
function receiveNoteList(json, listArgs) {
  return {
    type: RECEIVE_NOTE_LIST
    , listArgs
    , list: json.notes
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export const ADD_NOTE_TO_LIST = "ADD_NOTE_TO_LIST";
export function addNoteToList(id, ...listArgs) {
  // console.log("Add note to list", id);
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: ADD_NOTE_TO_LIST
    , id
    , listArgs
  }
}

export const REMOVE_NOTE_FROM_LIST = "REMOVE_NOTE_FROM_LIST"
export function removeNoteFromList(id, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ['all'];
  }
  return {
    type: REMOVE_NOTE_FROM_LIST
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
    dispatch(requestNoteList(listArgs))
    /**
     * determine what api route we want to hit
     *
     * NOTE: use listArgs to determine what api call to make.
     * if listArgs[0] == null or "all", return list
     *
     * if listArgs has 1 arg, return "/api/notes/by-[ARG]"
     *
     * if 2 args, additional checks required.
     *  if 2nd arg is a string, return "/api/notes/by-[ARG1]/[ARG2]".
     *    ex: /api/notes/by-category/:category
     *  if 2nd arg is an array, though, return "/api/notes/by-[ARG1]-list" with additional query string
     *
     * TODO:  make this accept arbitrary number of args. Right now if more
     * than 2, it requires custom checks on server
     */
    let apiTarget = "/api/notes";
    if(listArgs.length == 1 && listArgs[0] !== "all") {
      apiTarget += `/by-${listArgs[0]}`;
    } else if(listArgs.length == 2 && Array.isArray(listArgs[1])) {
      // length == 2 has it's own check, specifically if the second param is an array
      // if so, then we need to call the "listByValues" api method instead of the regular "listByRef" call
      // this can be used for querying for a list of notes given an array of note id's, among other things
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
      json => dispatch(receiveNoteList(json, listArgs))
    )
  }
}

/**
 * LIST UTIL METHODS
 */
export const SET_NOTE_FILTER = "SET_NOTE_FILTER"
export function setFilter(filter, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: SET_NOTE_FILTER
    , filter
    , listArgs
  }
}

export const SET_NOTE_PAGINATION = "SET_NOTE_PAGINATION"
export function setPagination(pagination, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: SET_NOTE_PAGINATION
    , pagination
    , listArgs
  }
}

export const INVALIDATE_NOTE_LIST = "INVALIDATE_NOTE_LIST"
export function invalidateList(...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: INVALIDATE_NOTE_LIST
    , listArgs
  }
}
