import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
