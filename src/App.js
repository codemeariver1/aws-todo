import logo from './logo.svg'
import './App.css'
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify'
import awsconfig from './aws-exports'
import { withAuthenticator, Button } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'

Amplify.configure(awsconfig)
API.configure(awsconfig)

function updateTodo(todo, newDesc) {
  todo['description'] = newDesc
  todo['createdAt'] = undefined
  todo['updatedAt'] = undefined
  todo['owner'] = undefined
  API.graphql(graphqlOperation(mutations.updateTodo, {input: todo})).catch(err => console.log(err))
}

function deleteTodo(todo) {
  API.graphql(graphqlOperation(mutations.deleteTodo, {input:{'id':todo['id']}}))
}

function App({ user, signOut }) {

  const allTodos = API.graphql(graphqlOperation(queries.listTodos))
  console.log(allTodos)

  /*const oneTodo = API.graphql(graphqlOperation(queries.getTodo, {id:"64c62c89-f72a-4ad3-9bc5-ba624d0b68a9"})).then(function(todo) {
    updateTodo(todo['data']['getTodo'], "new desc")
    deleteTodo(todo['data']['getTodo'])
  })
  console.log(oneTodo)*/

  const filteredTodos = API.graphql(graphqlOperation(queries.listTodos, {filter:{'name':{eq:"app"}}})).catch(err => console.log(err))
  console.log(filteredTodos)

  /*Auth.currentAuthenticatedUser({
    bypassCache: false
  }).then(function(user) {
    console.log("User: " + JSON.stringify(user))
  })
  const todo = {name: user['username'], description: "new todo"}
  const newTodo = API.graphql(graphqlOperation(mutations.createTodo, {input: todo})).catch(err => console.log(err))*/

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. Happy Hacking Bois!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> 
        <Button onClick={signOut}>Sign Out</Button>
      </header>
    </div>
  )
}

export default withAuthenticator(App, {includeGreetings: true})
//export default App;
