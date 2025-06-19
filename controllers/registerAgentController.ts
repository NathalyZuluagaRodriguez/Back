import { Request, Response } from "express";
import usuarioServi from "../services/UserServices";
import Agent from "../Dto/AgentsDto";

const registerAgent = async (req: Request, res: Response) => {
    console.log("BODY recibido:", req.body);

    try {
        const { name_person, last_name, email, phone, password, realEstateId , roleId  } = req.body;

        if (
            !name_person?.trim() ||
            !last_name?.trim() ||
            !phone?.trim() ||
            !email?.trim() ||
            !password?.trim() ||
            realEstateId  === undefined ||
            roleId  === undefined
        ) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }


        const agente = new Agent(name_person, last_name, email, phone, password, realEstateId , roleId );
        const result = await usuarioServi.registerAgent(agente);

        return res.status(201).json({
            message: "Agente registrado con éxito",
            agente: {
                name_person,
                last_name,
                email,
                phone,
                realEstateId ,
                roleId 
            }
        });
    } catch (error: any) {
        console.error("Error registrando agente:", error);
        return res.status(500).json({ error: error.message || "Error al registrar agente" });
    }
};

export default registerAgent;