import { plantConstants } from '../_constants';

export function plant(state = {plant:[],loading:false,searchCount:0}, action) {
  switch (action.type) {
    case plantConstants.LOADING:
      return {
        loading: true,
        searchCount:state.searchCount
      };
    case plantConstants.RESET:
        return {
            searchCount: 0
        };  
    case plantConstants.GETPLANTSEARCHLIST:
      return {
        plantList: action.plant,
        loading:false,
        searchCount:state.searchCount+1
      };
    case plantConstants.CLEAR:
        return {
            plantList : [],
            searchCount:state.searchCount
        }
    default:
      return state
  }
}