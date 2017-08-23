export const addTodo = ({ dispatch }, text) => {
  dispatch({
    type: 'ADD_TODO',
    payload: {
      text
    }
  })
}
