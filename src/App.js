import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Layer, Network } from "synaptic";

class App extends Component {
	constructor() {
		super();
		this.state = {
			outputs: [],
			finished: false
		};
	}
	componentDidMount() {
		this.makeSomeLayers();
		this.buildMyNetwork();
		this.hitTheGym();
	}

	makeSomeLayers() {
		this.inputLayer = new Layer(2);
		this.hiddenLayer = new Layer(3);
		this.outputLayer = new Layer(1);

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
		const learningRate = 0.02;
		for (let i = 0; i < 100; i++) {
			this.network.activate([0, 0]);
			this.network.propagate(learningRate, [0]);

			this.network.activate([0, 1]);
			this.network.propagate(learningRate, [1]);

			this.network.activate([1, 0]);
			this.network.propagate(learningRate, [1]);

			this.network.activate([1, 1]);
			this.network.propagate(learningRate, [0]);
		}
		this.setState(
			{
				finished: true,
				outputs: [
					[0, 0],
					[0, 1],
					[1, 0],
					[1, 1],
				]
			},
			() => {
				requestAnimationFrame(this.hitTheGym.bind(this));
			}
		);
	}

	render() {
		const { finished, outputs } = this.state;
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to the sleuthy goose!</h1>
				</header>
				Beginning... <br />
				{finished ? "Finished!" : ""} <br />
				<table>
						{outputs.map((output, index) => (
							<tr key={index}>
								<td>{output}</td>
								<td>{this.network.activate(output)}</td>
							</tr>
						))}
				</table>
			</div>
		);
	}
}

export default App;
