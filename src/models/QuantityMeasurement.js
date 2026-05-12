const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Equivalent of @Entity QuantityMeasurementEntity.java
const QuantityMeasurement = sequelize.define('QuantityMeasurement', {

    id: {
        type          : DataTypes.BIGINT,
        autoIncrement : true,
        primaryKey    : true,
    },

    // THIS quantity
    thisValue           : { type: DataTypes.DOUBLE,  allowNull: false, defaultValue: 0 },
    thisUnit            : { type: DataTypes.STRING,  allowNull: true  },
    thisMeasurementType : { type: DataTypes.STRING,  allowNull: true  },

    // THAT quantity
    thatValue           : { type: DataTypes.DOUBLE,  allowNull: false, defaultValue: 0 },
    thatUnit            : { type: DataTypes.STRING,  allowNull: true  },
    thatMeasurementType : { type: DataTypes.STRING,  allowNull: true  },

    // Operation
    operation           : { type: DataTypes.STRING,  allowNull: true  },

    // Result
    resultValue           : { type: DataTypes.DOUBLE,  allowNull: false, defaultValue: 0 },
    resultUnit            : { type: DataTypes.STRING,  allowNull: true  },
    resultMeasurementType : { type: DataTypes.STRING,  allowNull: true  },
    resultString          : { type: DataTypes.STRING,  allowNull: true  },

    // Error tracking
    isError      : { type: DataTypes.BOOLEAN, defaultValue: false },
    errorMessage : { type: DataTypes.STRING,  allowNull: true     },

}, {
    tableName  : 'quantity_measurements',
    timestamps : true,   // adds createdAt and updatedAt — equivalent of @PrePersist / @PreUpdate
});

module.exports = QuantityMeasurement;
