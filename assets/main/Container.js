import React, { createContext, useContext } from 'react';

const createContainer = useHook => {
	const Context = createContext(null)

	const Provider = props => {
		const value = useHook(props.initialState);
		return <Context.Provider value={value}>{props.children}</Context.Provider>
	}

	const useContainer = () => {
		const value = useContext(Context)
		if (value === null) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return { Provider, useContainer }
}

export default createContainer;
