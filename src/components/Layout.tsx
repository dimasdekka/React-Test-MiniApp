import { Outlet } from 'react-router'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast'

export default function Layout() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navbar />
      <main className="md:ml-64 pt-24 px-4 sm:px-8 pb-12 min-h-screen">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#191c1e',
            color: '#fffbff',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          },
        }}
      />
    </div>
  )
}
