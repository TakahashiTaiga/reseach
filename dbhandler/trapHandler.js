const mysql = require("mysql2/promise");
const ih = require('./installHandler');


const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

class trapHandler {
    constructor(){
        this.db_setting = {
            host: "localhost",
            user: "root",
            password: "JjqKwzHd5RnA",
            database: "mydb"       
        };
    } 
 
    async getTrapAll(user_id) {
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "SELECT trap.trap_id, trap.name, trap.state, trap.start, trap.last FROM trap, install WHERE trap.trap_id = install.trap_id and install.user_id = ?";
            const [rows, fields] = await connection.execute(query, [user_id]);
            const res = rows;
            logger.debug("res:" + res);
                
            await connection.end();
            logger.debug("closed db");
            return res;

        } catch(error) {
            logger.debug(error);
        }
    }

    async addTrap(user_id, extension_unit_id, name, memo){
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "INSERT INTO trap (extension_unit_id, name, memo) VALUES (?, ?, ?)";
            const [rows, fields] = await connection.execute(query, [extension_unit_id, name, memo]);
            const res = rows;
            logger.debug("res:" + res);
            logger.debug(JSON.stringify(res));

            const trap_id = res.insertId;
                
            await connection.end();
            logger.debug("closed db");

            // update install
            logger.debug("call setTrapId");
            const install_handler = new ih();
            const result = await install_handler.setTrapId(user_id, trap_id);
            logger.debug("result:" + result);

            return res;

        } catch(error) {
            logger.debug(error);
        }
    }

    async getTrapIndividual(trap_id) {
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "SELECT * FROM trap WHERE trap_id = ?";
            const [rows, fields] = await connection.execute(query, [trap_id]);
            const res = rows;
            logger.debug("res:" + res);
                
            await connection.end();
            logger.debug("closed db");
            return res;

        } catch(error) {
            logger.debug(error);
        }
    }

    async updateTrapIndividual(trap_id, extension_unit_id, name, memo) {
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            logger.debug(extension_unit_id, name, memo, trap_id);
            const query = "UPDATE trap SET extension_unit_id = ?, name = ?, memo = ? WHERE trap_id = ?";
            const [rows, fields] = await connection.execute(query, [extension_unit_id, name, memo, trap_id]);
            const res = rows;
            logger.debug("res:" + res);
                
            await connection.end();
            logger.debug("closed db");
            return res;

        } catch(error) {
            logger.debug(error);
        }
    }
}

module.exports = trapHandler;