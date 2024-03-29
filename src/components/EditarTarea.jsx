import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../Styles/App.css";
import { useForm } from "react-hook-form";
import { editarTarea, obtenerTareas } from "../helpers/queries";
import { useParams } from "react-router-dom";

const EditarTarea = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [tarea, setTarea] = useState(null);

  useEffect(() => {
    const cargarTarea = async () => {
      try {
        const tareas = await obtenerTareas();
        const tareaData = tareas.find((t) => t._id === id);
        if (tareaData) {
          setTarea(tareaData);
          setValue("texto", tareaData.texto);
          setValue("completada", tareaData.completada);
        } else {
          console.error("No se pudo obtener la tarea");
        }
      } catch (error) {
        console.error("Error al obtener la tarea:", error);
      }
    };

    cargarTarea();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const nuevaTarea = { ...tarea, ...data };
      const response = await editarTarea(nuevaTarea, id);
      if (response.ok) {
        Swal.fire({
          title: "Tarea editada",
          text: "La tarea ha sido editada correctamente",
          icon: "success",
        });
      } else {
        throw new Error("Error al editar la tarea");
      }
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al editar la tarea. Por favor, inténtalo de nuevo más tarde.",
        icon: "error",
      });
    }
  };

  if (!tarea) {
    return <p>Cargando...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container p-4">
      <div className="body container text-center fw-bold rounded">
        Editar Tarea
      </div>
      <div className="m-3">
        <label htmlFor="texto" className="form-label text-center">
          Texto de la tarea
        </label>
        <input
          type="text"
          className="form-control"
          id="texto"
          {...register("texto", { required: "Este campo es obligatorio" })}
        />
        {errors.texto && <p className="text-danger">{errors.texto.message}</p>}
      </div>
      <div className="m-3">
        <label htmlFor="completada" className="form-label">
          Completada
        </label>
        <select
          className="form-select"
          id="completada"
          {...register("completada")}
        >
          <option value={true}>Sí</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="d-flex justify-content-center">
        <button type="submit" className="btn btn-warning">
          Guardar
        </button>
      </div>
    </form>
  );
};

export default EditarTarea;