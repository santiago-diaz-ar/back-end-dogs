const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "dogs",
    {
      id: {
        type: DataTypes.UUID, // UUID => identificador unico universal
        primaryKey: true, // clave primaria
        defaultValue: DataTypes.UUIDV4, //valor por defecto
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Opción para definir que el campo debe ser único
        validate: {
          notEmpty: true, // Validaci. asegurarse de que el campo no esté vacío
        },
      },
      height: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        validate: {
          isArrayWithNumbers: function (value) {
            // Definir la validación personalizada
            // Verificar que el valor sea un array y que solo contenga números
            if (!Array.isArray(value)) {
              throw new Error('El campo "height" debe ser un array.');
            }
            for (const precio of value) {
              if (typeof precio !== "number") {
                throw new Error(
                  'El campo "max height o min height" solo debe contener números.'
                );
              }
            }
          },
        },
      },
      weight: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        validate: {
          isArrayWithNumbers: function (value) {
            // Definir la validación personalizada
            // Verificar que el valor sea un array y que solo contenga números
            if (!Array.isArray(value)) {
              throw new Error('El campo "weight" debe ser un array.');
            }
            for (const precio of value) {
              if (typeof precio !== "number") {
                throw new Error(
                  'El campo "max weight o min weight" solo debe contener números.'
                );
              }
            }
          },
        },
      },
      life_span: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true, // Validación para solo numeros
        },
      },
      image: {
        type: DataTypes.STRING(500),
      },
    },
    { timestamps: false } // no me  agrega las filas createAt y updatedAt por defecto en la tabla
  );
};
