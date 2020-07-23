import React, { useState, useEffect } from "react";
import api from "./services/api";
import Notifications, { notify } from "react-notify-toast";
import Select from "./components/Select";

import "./App.css";

const MYCOLOR = { background: "#1992d7", text: "#FFFFFF" };
const DETALHES = "_DETALHES";
const TIPO_FONTE = [
	{ value: "fonte-Rowdies", nome: "Rowdies" },
	{ value: "fonte-Lexend", nome: "Lexend Zetta" },
	{ value: "fonte-Ranchers", nome: "Ranchers" },
	{ value: "fonte-Lobster", nome: "Lobster" },
	{ value: "fonte-Jura", nome: "Jura" },
];
const TIPO_COR = [
	{ value: "cor-azul", nome: "Azul" },
	{ value: "cor-vermelho", nome: "Vermelho" },
	{ value: "cor-verde", nome: "Verde" },
	{ value: "cor-branco", nome: "Branco" },
	{ value: "cor-preto", nome: "Preto" },
];

function App() {
	const [raca, setRaca] = useState("");
	const [listaRaca, setListaRaca] = useState([]);
	const [nome, setNome] = useState("");
	const [fonte, setFonte] = useState("");
	const [cor, setCor] = useState("");
	const [imagem, setImagem] = useState(require("./assets/img/imagens-lobos.jpg"));
	const [data, setData] = useState("");
	const [hora, setHora] = useState("");

	useEffect(() => {
		async function listagemRaca() {
			const response = await api.get(`/breeds/list/all`);
			const nomeRaca = response.data.message;
			const objeto = Object.keys(nomeRaca).map((chave) => ({ nome: chave, value: chave }));
			setListaRaca(objeto);
		}

		const detalhes = localStorage.getItem(DETALHES);
		const dados = JSON.parse(detalhes);

		if (dados) {
			setImagem(dados.imagem);
			setRaca(dados.raca);
			setNome(dados.nome);
			setCor(dados.cor);
			setFonte(dados.fonte);
			setData(dados.data);
			setHora(dados.hora);
		}

		listagemRaca();
	}, []);

	function salvarStorage() {
		const horas = new Date().getHours() + ":" + String(new Date().getMinutes()).padStart(2, "0");
		const datas = new Date().toLocaleDateString();
		setData(datas);
		setHora(horas);

		localStorage.setItem(DETALHES, JSON.stringify({ raca, nome, fonte, cor, data: datas, hora: horas, imagem }));
		notify.show("Dados salvos com sucesso!", "custom", 4000, MYCOLOR);
	}

	async function buscarImagem(valor) {
		setRaca(valor);
		const response = await api.get(`breed/${valor}/images/random`);
		setImagem(response.data.message.toString());
		setData("");
	}

	return (
		<div className="container">
			<Notifications />
			<div className="row mt-5 jumbotron">
				<div className=" col-lg-6 d-flex flex-column justify-content-lg-between">
					<h1 className="display-3 text-center">DOG API</h1>
					<div>
						<div className="form-group">
							<label>Raça</label>
							<Select
								value={raca}
								onChange={(e) => {
									buscarImagem(e.target.value);
									setData("");
								}}
								lista={listaRaca}
							/>
						</div>
						<div className="form-group">
							<label>Nome do seu cachorrinho</label>
							<input
								className="form-control"
								type="text"
								placeholder="Ex: Lully"
								value={nome}
								onChange={(e) => {
									setNome(e.target.value);
								}}
							/>
						</div>
						<div className="form-group">
							<label>Escolha a fonte do texto</label>
							<Select
								value={fonte}
								lista={TIPO_FONTE}
								onChange={(e) => {
									setFonte(e.target.value);
									setData("");
								}}
							/>
						</div>
						<div className="form-group ">
							<label>Escolha a cor do texto</label>
							<Select
								value={cor}
								lista={TIPO_COR}
								onChange={(e) => {
									setCor(e.target.value);
									setData("");
								}}
							/>
						</div>
					</div>
				</div>
				<div className="col-lg-6 d-flex align-items-center flex-column justify-content-around ">
					<div className="w-100">
						<div className="card text-white w-100">
							<img className="card-img imagem-tamanho" src={imagem} alt="Card image" />
							<div className="card-img-overlay d-flex flex-column justify-content-end  ">
								<span className={`card-title fonte ${cor} ${fonte}`}>{nome === "" ? "Nome do Cachorro" : "Nome:" + nome}</span>
								<p className={`card-text fonte ${cor} ${fonte}`}>{raca === "" ? "Raça do Cachorro" : "Raça:" + raca}</p>
								<p className={`card-text fonte ${cor} ${fonte}`}>{data === "" ? "" : `Salvo em:   ${data}   às   ${hora}`}</p>
							</div>
						</div>
					</div>
					<button className="btn btn-primary btn-lg w-100 p-2 m-2" onClick={salvarStorage}>
						Salvar
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
