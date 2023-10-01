import Efecto from "../models/Efectos.js";

const statusEfecto = async (req,res) => {

    const efectos = await Efecto.findAll({});

    return res.status(200).json(efectos);

}

const cambioStatus = async (req,res) => {
    
    const { id } = req.params;

    const efecto = await Efecto.findByPk(id);

    efecto.activo = !efecto.activo
    
    await efecto.save();

    return res.status(200).json({msg: true});

}

export {
    statusEfecto,
    cambioStatus
}