import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { plantActions } from '../_actions';
import './Home.css';
import { alertActions } from '../_actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.autoSuggectRef = React.createRef();
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            searchCount: 0
        }
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.clearInter = setInterval(() => {
            this.props.resetSearchCount();
            this.props.successMessage("Your time is reset");
        }, 60000)
    }

    componentWillUnmount() {
        clearInterval(this.clearInter);
    }

    searchPlants = (e) => {
        this.setState({
            plantName: e.target.value
        })
        if (this.state.user.name == 'Luke Skywalker' || this.props.searchCount < 15) {
            this.props.getPlants(e.target.value)
        } else {
            this.props.errorMessage('Only 15 search per min')
        }
    }

    handleClickOutside = (event) => {
        if (this.autoSuggectRef.current && !this.autoSuggectRef.current.contains(event.target)) {
            this.props.closePlants();
        }
    }
    openPlant = (e, plant) => {
        delete plant.keys;
        this.setState({
            detailPlant: plant,
            plantName: plant.name
        })
        this.props.closePlants();
    }

    render() {
        let user = this.state.user;
        let platList = this.props.plantList ? this.props.plantList : [];
        platList.sort((a, b) => {
            return a.population - b.population
        });
        let plantListWithKey = platList.map((value, index) => {
            return { ...value, keys: index }
        })
        plantListWithKey.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (b.name < a.name) {
                return 1;
            }
            return 0;
        });

        let loading = this.props.loading;
        let detailPlant = this.state.detailPlant;
        let plantName = this.state.plantName;
        return (
            <>
                <div className="row header-section">
                    <div className="col-md-4 search-count">Search Count : {this.props.searchCount}</div>
                    <div className="col-md-4"></div>
                    <div className="col-md-4"><span className="col-md-2">Hi {user.name}!</span><Link to="/login">Logout</Link></div>
                </div>
                <div className="row container-section">
                    {/* <h1>Hi {user.name}!</h1> */}
                    <div className="col-md-4">

                        <div className="auto-suggect-list" ref={this.autoSuggectRef}>
                            <div className="form-group"><label htmlFor="PlantSearch">Plant Search</label>
                                <input type="text" className="form-control" id="PlantSearch" onChange={(e) => this.searchPlants(e)} ref={"removeinput"} value={(plantName && plantName) ? plantName : ''} />{loading && loading == true ? (<span className="loading-img"><img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" /></span>) : null}
                                {platList && platList.length != 0 ? (
                                    <ul>
                                        {
                                            plantListWithKey.map((value, index) => {
                                                return (<li onClick={(e) => this.openPlant(e, value)} key={'plantlist' + index}><span className="population-percent" style={{ width: (((value.population != 'unknown' ? (value.keys + 1) : 0) * 100) / plantListWithKey.length) + '%' }}></span>{value.name} - {value.population}</li>)
                                            })
                                        }

                                    </ul>) : null}
                            </div>
                        </div>
                    </div>
                    {detailPlant && detailPlant.length != 0 ? (
                        <div className="plant-result col-md-8">
                            <table className="table">
                                <tbody>
                                    {
                                        Object.keys(detailPlant).map((value, index) => (
                                            <tr key={index}>
                                                <td>{
                                                    value.replace("_", " ").toUpperCase()
                                                }</td>
                                                <td>{detailPlant[value]}</td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            </>
        );
    }

}

function mapState(state) {
    const { authentication, plant } = state;
    const { user } = authentication;
    const { plantList, loading, searchCount } = plant;
    return { user, plantList, loading, searchCount };
}
const actionCreators = {
    getPlants: plantActions.getPlants,
    closePlants: plantActions.clearPlants,
    resetSearchCount: plantActions.resetSearchCount,
    errorMessage: alertActions.error,
    successMessage: alertActions.success
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };