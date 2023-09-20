const pg = require('pg')
const client = new pg.Client('postgres://localhost/morgans_coolio_db')
const express = require('express')
const app = express()

app.use(express.json())

app.get('/api/duel_monsters', async(req,res,next)=>{
    try {
        const SQL = `
        SELECT * FROM duel_monsters
        `;
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/duel_monsters/:id', async(req,res,next)=>{
    try {
        const SQL = `
        SELECT * FROM duel_monsters WHERE id = $1
        `;
        const response = await client.query(SQL, [req.params.id])
        if(response.rows.length === 0){
            throw new Error("ID does not exist")
        }
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.delete('/api/duel_monsters/:id', async(req,res,next)=>{
    try {
        const SQL = `
        DELETE FROM duel_monsters WHERE id = $1
        `;
        await client.query(SQL, [req.params.id])
        console.log("deleteing..")
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

app.post('/api/duel_monsters', async(req,res,next)=>{
    try {
        // console.log(req.body)
        const SQL = `
        INSERT INTO duel_monsters VALUES ($1, $2, $3, $4, $5)
        `;
        console.log("adding...")
        const response = await client.query(SQL, [req.body.name, req.body.level, req.body.attribute, req.body.attack, req.body.defense])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.put('/api/duel_monsters/:id', async(req,res,next)=>{

    try {
        const SQL = `
        UPDATE duel_monsters
        SET name = $1, level = $2, attribute = $3, attack = $4, defense = $5
        WHERE id = $6
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.level, req.body.attribute, req.body.attack, req.body.defense, req.params.id])
        res.send(response.rows[0])
    } catch (error){
        next(error)
    }
})

app.get('*', (req,res,next)=>{
    res.status(404).send("route doesn't exists!")
})

app.get((err,req,res,next)=>{
    res.status(500).send(err.message)
})

const init = async()=>{
    await client.connect()
    console.log("connected to db")

    const SQL = `
    DROP TABLE IF EXISTS duel_monsters;
    CREATE TABLE duel_monsters(
        name VARCHAR(100),
        level INT,
        attribute VARCHAR(20),
        attack INT,
        defense INT,
        id SERIAL PRIMARY KEY
    );
    INSERT INTO duel_monsters (name, level, attribute, attack, defense) VALUES ('Blue-Eyes White Dragon', 8, 'Light', 3000, 2500);
    INSERT INTO duel_monsters (name, level, attribute, attack, defense) VALUES ('Red-Eyes Black Dragon', 7, 'Dark', 2400, 2000);
    INSERT INTO duel_monsters (name, level, attribute, attack, defense) VALUES ('Dark Magician', 7, 'Dark', 2500, 2100);
    `;
    await client.query(SQL)

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=>{
        console.log(`listening on port ${PORT}`)
    })
}
init()