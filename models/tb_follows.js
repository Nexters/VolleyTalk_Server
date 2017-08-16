module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_follows', {
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    followtype: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    typeseq: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'tb_userinfos',
        key: 'userid'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tb_follows'
  });
};
