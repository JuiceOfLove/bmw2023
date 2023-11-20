import {Link, Outlet} from 'react-router-dom'

export function Layout() {
    return (
        <div>
            <header>
                <nav>
                    <Link to='/'>Home</Link>
                </nav>
            </header>
            <main><Outlet/></main>
        </div>
    )
}