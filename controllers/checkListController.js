import CheckList from "../models/CheckList.js";

const guardarSolicitud = async (req, res) => {

    const { titulo, estado, prioridad, tipo, de, fechaSolicitud, descripcion } = req.body;

    if ( !titulo ) {
        return res.status(400).json({ msg: 'Error al guardar' });
    }

    try {
        
        await CheckList.create({
            titulo,
            estado,
            prioridad,
            tipo,
            de,
            fechaSolicitud,
            descripcion
        });

        return res.status(200).json({ msg: 'Solicitud de soporte agregada correctamente' });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al guardar la solicitud' });
    }

}

const editarSolicitud = async (req, res) => {

    const {
        titulo,
        estado,
        prioridad,
        tipo,
        de,
        fechaSolicitud,
        descripcion
    } = req.body;

    const { id } = req.params;

    if ( !id ){ 
        return res.status(404).json({ msg: 'Error guardando la actualización de solicitud' });
    }

    try {
        
        const solicitud = await CheckList.findByPk( id );

        if ( !solicitud ) {
            return res.status(404).json({ msg: 'No existe solicitud' });
        }

        solicitud.titulo = titulo;
        solicitud.estado = estado;
        solicitud.prioridad = prioridad;
        solicitud.tipo = tipo;
        solicitud.de = de;
        solicitud.fechaSolicitud = fechaSolicitud;
        solicitud.descripcion = descripcion;

        await solicitud.save();

        return res.status(200).json({ msg: 'Solicitud guardada correctamente' });

    } catch (error) {
        
        console.log(error);
        return res.status(400).json({ msg: 'Error actualizando la solicitud, intente nuevamente' });

    }
    
}

const respuestaSolicitud = async (req,res) => {

    const { id } = req.params;

    const { fechaRespuesta, status, descripcion, titulo } = req.body;

    if ( !id ){ 
        return res.status(404).json({ msg: 'Error dando respuesta a la solicitud' });
    }

    try {
        
        const solicitud = await CheckList.findByPk(id);

        solicitud.fechaRespuesta = fechaRespuesta;
        solicitud.status = status;
        solicitud.descripcion = descripcion;
        solicitud.titulo = titulo;

        await solicitud.save();

        return res.status(200).json({ msg: 'Solicitud respondida correctamente' });

    } catch (error) {
        
        console.log(error);
        return res.status(400).json({ msg: 'Error actualizando la solicitud, intente nuevamente' });

    }

}

const obtenerSolicitudes = async (req,res) => {

    try {

        const offset = parseInt(req.params.offset) ? (parseInt(req.params.offset) || 0) * 20 : 0;
        
        const solicitudes = await CheckList.findAll({
            offset,
            limit:  parseInt(req.params.offset) ? 20 : 100000,
            order: [[ 'fechaSolicitud', 'DESC' ]]
        });

        const cant = await CheckList.findAll();

        return res.status(200).json({solicitudes, cantPag: Math.ceil(cant.length / 20)});

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error' });
    }

}

const obtenerSolicitudId = async (req, res) => {

    const { id } = req.params;

    if ( !id ) {
        return res.status(400).json({ msg: 'Error al encontrar solicitud' });
    }

    try {
        
        const solicitud = await CheckList.findByPk(id);

        return res.status(200).json(solicitud);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al encontrar solicitud' });
    }

}

export {
    editarSolicitud,
    guardarSolicitud,
    obtenerSolicitudes,
    respuestaSolicitud,
    obtenerSolicitudId
}