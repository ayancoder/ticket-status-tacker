import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i class="fas fa-code"></i>Ticket Tracker</Link>
      </h1>
    </nav>
    )
}
