const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "temperaments",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true, //clave primaria
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Opción para definir que el campo debe ser único
        validate: {
          notEmpty: true, // Validaci. asegurarse de que el campo no esté vacío
        },
      },
    },
    { timestamps: false } // no me  agrega las filas createAt y updatedAt por defecto en la tabla
  );
};
