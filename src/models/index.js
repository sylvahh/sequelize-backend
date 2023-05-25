import fs from 'fs'
import path from 'path'

let models = {}
export function registerModels (sequelize) {
    const thisFile = path.basename(__filename); // index.js
    const modelFiles = fs.readdirSync(__dirname)
    const filterModelFiles = modelFiles.filter(file => { // filter throw files 
        return file !== thisFile && file.slice(-3) === '.js';
    })

    for (const file of filterModelFiles) {
        const model = require(path.join(__dirname, file)).default(sequelize)
        models[model.name] = model
    }

    Object.keys(models).forEach(modelName => {// loop throw models key
        if (models[modelName].associate) {
            models[modelName].associate(models)
        }
    })

    models.sequelize = sequelize

}

export default models