import React, { useEffect } from 'react';
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import './App.css';
import { useState } from 'react';

const GET_LOCATIONS = gql`
  query GetAttiributes {
    attributes {
      id
      name
      type
      placeholder
      options
    }
  }
`;

const ADD_ATTRIBUTE = gql`
  mutation addAttribute($input: AttributeAddInput){
    addAttribite(input: $input) {
      id
      name
      type
      placeholder
      options
    }
  }
`;

const UPDATE_ATTRIBUTE = gql`
mutation UpdateAttribute($input: AttributeUpdateInput!) {
  updateAttribute(input: $input) {
    id
    name
    type
    placeholder
    options
  }
}
`;

const DELETE_ATTRIBUTE = gql`
  mutation DeleteAttribute($deleteAttributeId: String!) {
    deleteAttribute(id: $deleteAttributeId) {
      id
      name
      type
      placeholder
      options
    }
  }
`;
export interface IState {
  id?: string;
  name: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

function App() {
  const { loading: getLoading, error: getError, data: getData } = useQuery(GET_LOCATIONS);
  const [attributeData, setAttributeData] = useState<IState[]>(getData?.attributes);
  const [addAttribute, { loading: addLoading, error: addError, data: addData }] = useMutation(ADD_ATTRIBUTE);
  const [removeAttribute, { loading: removeLoading, error: removeError, data: removeData }] = useMutation(DELETE_ATTRIBUTE);
  const [updateAttribute, { loading: updateLoading, error: updateError, data: updateData }] = useMutation(UPDATE_ATTRIBUTE);

  const [state, setState]: [IState, Function] = useState({
    id: "",
    name: "",
    type: "T",
    placeholder: "",
    options: []
  });

  useEffect(() => {
    setAttributeData(getData?.attributes);
  }, [getData]);

  const [tempOption, setTempOption]: [string, Function] = useState("")
  const renderTypeForm = () => {
    switch (state.type) {
      case "T":
        return <input type="text" onChange={(e) => {
          setState({
            ...state,
            placeholder: e.target.value
          })
        }} placeholder={`Enter placeholder for ${state.placeholder} `} value={state.placeholder} required />
      case "O":
        return (<>
          <input type="text"
            placeholder={`Add option for ${state.name}`}
            value={tempOption}
            onChange={(e) => {
              setTempOption(e.target.value)
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13 && tempOption !== "") {
                setState((prevState: IState) => {
                  const option = tempOption;
                  setTempOption("")
                  return {
                    ...prevState,
                    options: [...prevState.options as string[], option]
                  }
                })
              }
            }}
            required
          />
          <ul>
            {state.options?.map((option, index) => {
              return (
                <li key={index} value={option}>
                  <input type="text" value={option} onChange={(e) => {
                    setState((prevState: IState) => {
                      const options = prevState.options as string[];
                      options[index] = e.target.value;
                      return {
                        ...prevState,
                        options
                      }
                    });
                  }} />
                  &nbsp;
                  <button onClick={() => {
                    setState((preState: IState) => ({
                      ...preState,
                      options: (preState.options as string[]).filter((_, i) => i !== index)
                    }))
                  }}>❌</button>
                </li>
              )
            })}
          </ul>
        </>)
    }
  }

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={state.name}
          name="name"
          placeholder='Enter Name of attribute: '
          onChange={(e) => {
            setState({
              ...state,
              name: e.target.value
            });
          }}
        />
        <br />
        <input
          type="radio"
          name="type"
          checked={state.type === "T"}
          onChange={(e) => {
            setState({
              ...state,
              options: [],
              type: "T"
            });
          }}
        /> Text
        <input
          type="radio"
          name="type"
          checked={state.type === "O"}
          onChange={(e) => {
            setState({
              ...state,
              placeholder: "",
              type: "O"
            });
          }}
        /> Option
        <br />
        {renderTypeForm()}
        <br />
        <input type="submit" value="Submit" onClick={async () => {

          if (state.name === "") {
            alert("Please enter name");
            return;
          }
          if (state.type === "T" && state.placeholder === "") {
            alert("Please enter placeholder");
            return;
          }
          if (state.type === "O" && state.options?.length === 0) {
            alert("Please add options");
            return;
          }

          if (state.id === "") {
            const data = await addAttribute({
              variables: {
                input: {
                  name: state.name,
                  type: state.type,
                  placeholder: state.placeholder,
                  options: state.options
                }
              }
            });
            const { id,
              name,
              options,
              placeholder,
              type } = data.data.addAttribite;
            setAttributeData([...attributeData, {
              id,
              name,
              options,
              placeholder,
              type
            }]);
            debugger;
          } else {
            const data = await updateAttribute({
              variables: {
                input: state
              }
            });
            const {
              id,
              name,
              options,
              placeholder,
              type } = data.data.updateAttribite;
            setAttributeData(attributeData.map((attribute) => {
              if (attribute.id === id) {
                return {
                  id,
                  name,
                  options,
                  placeholder,
                  type
                }
              }
              return attribute;
            }));
            setState({
              id: "",
              name: "",
              type: "T",
              placeholder: "",
              options: []
            });
          }
        }} />
      </div>
      {getLoading === false ? <div className='attribute-data'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Placeholder</th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributeData?.map((attribute: IState) => {
              return (
                <tr>
                  <td>{attribute.name}</td>
                  <td>{attribute.type}</td>
                  <td>{attribute.placeholder}</td>
                  <td>{attribute.options?.join(", ")}</td>
                  <td>
                    <button onClick={() => {
                      setState({ name: attribute.name, type: attribute.type, placeholder: attribute.placeholder, options: attribute.options, id: attribute.id });
                    }} > 🖊</button>
                    &nbsp;&nbsp;
                    <button onClick={async () => {
                      const data = await removeAttribute({
                        variables: {
                          deleteAttributeId: attribute.id
                        }
                      });
                      const id = data.data.deleteAttribute.id;
                      setAttributeData(attributeData.filter((attribute) => attribute.id !== id));
                      setState({ ...state, id: "" });
                    }} >❌</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div> : <div>Loading...</div>}
    </div>
  );
}

export default App;
