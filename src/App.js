import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Layer, Network } from "synaptic";

const createTrainingData = input => {
    const output = [0, 0];

    if (input % 2 === 0) output[0] = 1;
    if (input % 3 === 0) output[1] = 1;

    return { input, output };
};

const precise = x => Math.round(x * 100) / 100;

class App extends Component {
    constructor() {
        super();
        this.state = {
            testData: [],
            finished: false
        };
    }
    componentDidMount() {
        this.makeSomeLayers();
        this.buildMyNetwork();
        this.hitTheGym();

        setInterval(() => {
			console.log('');
            console.log(this.network.activate([1]));
            console.log(this.network.activate([2]));
            console.log(this.network.activate([3]));
            console.log(this.network.activate([4]));
            console.log(this.network.activate([5]));
        }, 500);
    }

    makeSomeLayers() {
        this.inputLayer = new Layer(1);
        this.hiddenLayer = new Layer(4);
        this.outputLayer = new Layer(2);

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

    hitTheGym() {
        const learningRate = 0.001;
        for (let i = 0; i < 100000; i++) {
            const { input, output } = createTrainingData(i % 10);
            this.network.activate([input]);
            this.network.propagate(learningRate, output);
        }
		window.requestAnimationFrame(this.hitTheGym.bind(this))
    }

    render() {
        const testData = Array(20)
            .fill()
            .map((_, i) => i);
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to the sleuthy goose!</h1>
                </header>
                {/* <table>
                    {testData.map((input, index) => (
                        <tr key={index}>
                            <td>{input}</td>
                            {this.network &&
                                this.network
                                    .activate([input])
                                    .map((neuron, index) => (
                                        <td key={index} style={{ width: 300 }}>
                                            {precise(neuron)}
                                        </td>
                                    ))}
                        </tr>
                    ))}
                </table> */}
            </div>
        );
    }
}

export default App;
