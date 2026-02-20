import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppProvider from './app-provider'
import './App.css'
import LoginPage from './pages/auth/Login'
import  { PageGuard, AuthGuard } from './routes/auth-guard'
import '@ant-design/v5-patch-for-react-19';
import { appRoutesCollection } from './routes'

function App() {


  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to={"/login"} />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Routes */}

            <Route element={<AuthGuard />}>
              {
                appRoutesCollection.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PageGuard authority={route.permissions} >
                        {route.element}
                      </PageGuard>
                    }
                  />
                ))
              }

            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </>
  )
}

export default App
