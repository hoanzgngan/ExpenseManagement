import { useEffect, useState } from 'react'
import { getCategories } from '../api/categoryApi'

function Category() {
  const [list, setList] = useState([])

  useEffect(() => {
    getCategories().then((res) => {
      setList(res.data)
    })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Danh mục</h1>
      {list.map((c) => (
        <div key={c.CategoryID}>
          {c.CategoryName}
        </div>
      ))}
    </div>
  )
}

export default Category
