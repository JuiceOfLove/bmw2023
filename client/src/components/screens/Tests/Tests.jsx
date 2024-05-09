import React from 'react'
import { Link } from 'react-router-dom'

const Tests = () => {
  return (
    <div>
        <Link to="/tests/create">создать</Link>
        <Link to="/tests/compc">создать комп</Link>
        <Link to="/tests/send">Отправить</Link>
        <Link to="/tests/list">Список</Link>

    </div>
  )
}

export default Tests