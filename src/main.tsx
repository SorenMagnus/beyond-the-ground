import {createRoot} from 'react-dom/client';
import {lazy,Suspense} from 'react';
import './styles.css';
const App=lazy(()=>import('./App'));
const Prototype=lazy(()=>import('./Prototype'));
createRoot(document.getElementById('root')!).render(<Suspense fallback={<div className="boot">BEYOND THE GROUND<span>PREPARING YOUR FLIGHT</span></div>}>{new URLSearchParams(location.search).has('prototype')?<Prototype/>:<App/>}</Suspense>);
