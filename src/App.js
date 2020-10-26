import React, {useState, Component} from "react";
import RacingBarChart from "./RacingBarChart";
import "./App.css";
import axios from 'axios';
import moment from 'moment';

const API_URL = 'https://disease.sh/v3/covid-19/historical?lastdays=30';


class App extends Component {
    state = {
        loaded: false,
        data: [],
        date: '',
        timeDelay: 500
    }

    componentDidMount() {
        this.getDataCovid();
    }

    getDataCovid() {
        axios.get(API_URL)
            .then(response => response.data)
            .then((data) => {
                // console.log('data: ', data);
                this.setData(data);
            })
    }

    setData(data) {
        let getRandomColor = () => {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        let jsonColor = {};
        const dataCountry = {};
        for (const value of data) {
            // console.log('data: ', value);
            if (!jsonColor[value['country']]) {
                jsonColor[value['country']] = getRandomColor();
            }
            // console.log('data.timeline.case: ', value.timeline.cases);
            for (let key in value.timeline.cases) {
                // console.log('key: ', key);
                let cases = value.timeline.cases[key]
                // console.log('cases: ', cases);
                if (!dataCountry[key]) {
                    dataCountry[key] = [];
                }
                let newData = {value: cases, name: value['country'], color: jsonColor[value['country']]}
                dataCountry[key].push(newData);
            }
        }
        this.setState({loaded: true, running: true})
        this.intervalData(dataCountry);
    }

    async intervalData(dataCountry) {
        const {timeDelay} = this.state;
        for (let key in dataCountry) {
            this.setState({data: dataCountry[key], date: key});
            await new Promise((rev) => {
                setTimeout(() => {
                    rev();
                }, timeDelay)
            })
        }
    }

    render() {
        const {loaded, date, data} = this.state;
        if (!loaded) {
            return (<div style={{padding: 30}}>loading...</div>)
        } else {
            return (
                <React.Fragment>
                    <div loaded={true}></div>
                    <h1 style={{marginBottom: "5px"}}>Covid Global Cases</h1>
                    <span style={{marginBottom: "10px"}}>Date: {moment(date, 'MM/D/YYYY').format('DD/MM/YYYY')}</span>
                    {/*<button onClick={() => {window.location.reload(false);}}>refresh</button>*/}
                    <RacingBarChart data={data} maxShow={30} heightBar={30}/>
                </React.Fragment>
            );
        }
    }
}

export default App;
