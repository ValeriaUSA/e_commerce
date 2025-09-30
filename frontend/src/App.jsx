import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import AppRoutes from './router/AppRouters'
// import Menu from './components/Menu/Menu'
import Header from './components/Header/Header.jsx'

function App() {

  return (
    <>
      <Header />
 
      {/* <Menu /> */}
      <AppRoutes />

    </>
  )
}

export default App