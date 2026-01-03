import './mainlayout.css'
import type { ReactNode } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="overall-main-layout-container">
       <Header/>
       {children}
       <Footer/>
    </div>
  )
}

export default MainLayout