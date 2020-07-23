import React from "react";

function Select({ value, onChange, lista }) {
	return (
		<select className="form-control" value={value} onChange={onChange}>
			<option></option>
			{lista.map((item) => {
				return (
					<option key={item.nome} name={item.nome} value={item.value}>
						{item.nome}
					</option>
				);
			})}
		</select>
	);
}

export default Select;
