import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Layer, Network } from "synaptic";

const createTrainingData = () => {
    const input = Math.floor(Math.random() * 512);
    const output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    if (input % 2 === 0) output[0] = 1;
    if (input % 3 === 0) output[1] = 1;
    if (input % 4 === 0) output[2] = 1;
    if (input % 5 === 0) output[3] = 1;
    if (input % 6 === 0) output[4] = 1;
    if (input % 7 === 0) output[5] = 1;
    if (input % 8 === 0) output[6] = 1;
    if (input % 9 === 0) output[7] = 1;
    if (input % 10 === 0) output[8] = 1;
    if (input % 11 === 0) output[9] = 1;
    if (input % 12 === 0) output[10] = 1;

    return { input: binarise(input).concat(ternarise(input)), output };
};

const binarise = dec =>
    (dec >>> 0)
        .toString(2)
        .padStart(9, "0")
        .split("")
        .map(digit => parseInt(digit, 2));

const ternarise = dec =>
    (dec >>> 0)
        .toString(3)
        .padStart(9, "0")
        .split("")
        .map(digit => parseInt(digit, 3));

const precise = x => Math.round(x * 100) / 100;

class App extends Component {
    constructor() {
        super();
        this.state = {
            testData: [],
            finished: false,
            superspeed: true
        };
    }

    componentDidMount() {
        this.makeSomeLayers();
        this.buildMyNetwork();
        this.hitTheGym();

        setInterval(this.forceUpdate.bind(this), 50);
    }

    makeSomeLayers() {
        this.inputLayer = new Layer(18);
        this.hiddenLayer = new Layer(18);
        this.outputLayer = new Layer(11);

        this.inputLayer.project(this.hiddenLayer);
        this.hiddenLayer.project(this.outputLayer);
    }

    buildMyNetwork() {
        this.network = new Network({
            input: this.inputLayer,
            hidden: [this.hiddenLayer],
            output: this.outputLayer
        });
    }

    doLoads(cb) {
        if (this.state.superspeed) {
            window.requestAnimationFrame(cb);
        } else {
            setTimeout(cb, 500);
        }
    }

    hitTheGym() {
        const learningRate = 0.01;
        for (let i = 0; i < 1000; i++) {
            const { input, output } = createTrainingData();
            this.network.activate(input);
            this.network.propagate(learningRate, output);
        }
        this.doLoads(this.hitTheGym.bind(this));
    }

    render() {
        if (!this.network) return null;

        const testData = Array(50)
            .fill()
            .map((_, i) => binarise(i).concat(ternarise(i)))
            .map(n => this.network.activate(n));

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to the sleuthy goose!</h1>
                </header>
                <table>
                    <tbody>
                        <tr>
                            <th>n</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                            <th>9</th>
                            <th>10</th>
                            <th>11</th>
                            <th>12</th>
                        </tr>
                        {testData.map((timestables, n) => (
                            <tr
                                key={n}
                                style={{
                                    fontSize: 9
                                }}
                            >
                                <td>{n}</td>
                                {timestables.map((result, index) => (
                                    <td
                                        style={{
                                            width: 75,
                                            backgroundColor: `rgba(255, 100, 100, ${1 -
                                                Math.abs(
                                                    result - (n % (index + 2))
                                                )})`
                                        }}
                                    >
                                        {precise(result)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
