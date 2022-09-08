

const formularioLogin = (req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        res.json({msg: "no hay"})
    }else{
        res.json({msg: "si hay"})
    }

}

export {
    formularioLogin
}