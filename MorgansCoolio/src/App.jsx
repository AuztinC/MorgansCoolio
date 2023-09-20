import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom'

function Monster( { monsters, deleteMonster, updateMonster }){
  const [updating, setUpdating] = useState(false)
  const id = useParams().id*1
  const monster = monsters.find(mon => mon.id === id)
  const navigate = useNavigate()

  function handleDelete(){
    deleteMonster( id )
    navigate('/')
  }

  function handleUpdate(ev){
    ev.preventDefault()
    const updatedMonster = {
      name: ev.target.name.value,
      level: ev.target.level.value,
      attribute: ev.target.attribute.value,
      attack: ev.target.attack.value,
      defense: ev.target.defense.value
    }
    updateMonster( id, updatedMonster )
    ev.target.name.value = ""
    ev.target.level.value = ""
    ev.target.attribute.value = ""
    ev.target.attack.value = ""
    ev.target.defense.value = ""
  }

  if(!monster){
    return null
  }
  return (<>
    <div className='monsterCont'>
      <p>Name: { monster.name }</p>
      <p>Level: { monster.level }</p>
      <p>Attribute: { monster.attribute }</p>
      <p>Attack: { monster.attack }</p>
      <p>Defense: { monster.defense }</p>
    </div>
    {
      updating ? <>
      <form onSubmit={handleUpdate}>
          <label htmlFor="name">Name:<input type="text" name="name" id="name" required/></label>
          <label htmlFor="level">Level:<input type="number" name="level" id="level" required/></label>
          <label htmlFor="attribute">Attribute:<input type="text" name="attribute" id="attribute" required/></label>
          <label htmlFor="attack">Attack:<input type="number" name="attack" id="attack" required/></label>
          <label htmlFor="defense">Defense:<input type="number" name="defense" id="defense" required/></label>
          <button type='submit'>Submit</button>
          <button onClick={()=>setUpdating(!updating)}>Cancel</button>
      </form>
      </>
        : <>
        <button onClick={()=>setUpdating(!updating)}>Update Monster</button>
        <button onClick={()=>handleDelete()}>Delete Monster</button>
        </>
    }
  </>)
}

function Monsters( { monsters, createMonster }){
  const [createForm, setCreateForm] = useState(false)

  function handleCreate(ev){
    ev.preventDefault()
    const monster = {
      name: ev.target.name.value,
      level: ev.target.level.value,
      attribute: ev.target.attribute.value,
      attack: ev.target.attack.value,
      defense: ev.target.defense.value
    }
    createMonster( monster )
    ev.target.name.value = ""
    ev.target.level.value = ""
    ev.target.attribute.value = ""
    ev.target.attack.value = ""
    ev.target.defense.value = ""
    setCreateForm(false)
  }
  return (<>
    {
      createForm ?<>
      <form onSubmit={handleCreate}>
        <label htmlFor="name">Name:<input type="text" name="name" id="name" required/></label>
        <label htmlFor="level">Level:<input type="number" name="level" id="level" required/></label>
        <label htmlFor="attribute">Attribute:<input type="text" name="attribute" id="attribute" required/></label>
        <label htmlFor="attack">Attack:<input type="number" name="attack" id="attack" required/></label>
        <label htmlFor="defense">Defense:<input type="number" name="defense" id="defense" required/></label>
      <button type='submit'>Submit</button>
      </form>
      <button onClick={()=>setCreateForm(false)}>Cancel</button>
      </>
      :
      <button onClick={()=>setCreateForm(true)}>Create Monster</button>
    }
    <div id='mainCont'>
    {
      monsters.map((mon)=>{
        return (<>
        <div  className='monsterCont' key={mon.id}>
          <Link to={`/duel_monsters/${mon.id}`} >
              <p>Monster: { mon.name }</p>
              <p>Level: { mon.level }</p>
              <p>Attribute: { mon.attribute }</p>
              <p>Attack: { mon.attack }</p>
              <p>Defense: { mon.defense }</p>
          </Link>
        </div>
      </>)
      })
    }
 </div>
 </>)
}

function App() {
  const [monsters, setMonsters] = useState([])

  useEffect(()=>{
    getMonsters()
  }, [])

  async function getMonsters(){
    const response = await axios.get('http://localhost:3000/api/duel_monsters')
    setMonsters(response.data)
  }

  async function createMonster( monster ){
    const response = await axios.post(`http://localhost:3000/api/duel_monsters`, monster )
    setMonsters([...monsters, response.data])
  }

  async function deleteMonster( id ){
    await axios.delete(`http://localhost:3000/api/duel_monsters/${ id }`)
    setMonsters(monsters.filter(mon => mon.id !== id ? mon : null))
  }

  async function updateMonster( id, updatedMonster ){
    const response = await axios.put(`http://localhost:3000/api/duel_monsters/${ id }`, updatedMonster )
    setMonsters(monsters.map(mon=> mon.id !== response.data.id ? mon : response.data))
  }




  return (
    <>
    <Link to={'/'}> Home </Link>

      <Routes>
        <Route path='/' element={ <Monsters createMonster={createMonster} monsters={ monsters }/> } />
        <Route path='/duel_monsters/:id' element={ <Monster updateMonster={updateMonster} deleteMonster={deleteMonster} monsters={monsters}/> } />
      </Routes>
    </>
  )
}

export default App
