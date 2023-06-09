
export const logOut = (req,res) =>{
    req.session.destroy((error) => {
        if(error){
            console.error(error)
            res.status(500).send('erreur de bdd')
        }else{
            res.redirect('/')
        }

    })
}