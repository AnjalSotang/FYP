module.exports = (sequelize, DataTypes) => {
    const BodyMeasurement = sequelize.define('BodyMeasurement', {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT, // could be a decimal (e.g. 182.5 lbs)
        allowNull: false,
      },
      bodyFat: {
        type: DataTypes.FLOAT, // % value, often a decimal like 18.3%
        allowNull: true,
      },
      chest: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      waist: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      hips: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      arms: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      shoulders: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thighs: {
        type: DataTypes.FLOAT,
        allowNull: true,
      }
    });
  
    return BodyMeasurement;
  };
  