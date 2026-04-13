import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CatalogPage from './pages/CatalogPage'
import ConfiguratorPage from './pages/ConfiguratorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="configurator/:id" element={<ConfiguratorPage />} />
      </Route>
    </Routes>
  )
}

export default App
