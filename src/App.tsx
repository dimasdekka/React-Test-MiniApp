import { RouterProvider } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'
import router from './router'

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </AuthProvider>
  )
}
