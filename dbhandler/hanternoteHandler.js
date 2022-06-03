const mysql = require("mysql2/promise");
const ih = require('./installHandler');
const th = require('./trapHandler');

const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";

class hanternoteHandler {
    constructor(){
        this.db_setting = {
            host: "localhost",
            user: "root",
            password: "JjqKwzHd5RnA",
            database: "mydb"       
        };
    } 
 
    async getHanternoteAll(user_id) {
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "SELECT * FROM hanternote, install WHERE hanternote.hanternote_id = install.hanternote_id and install.user_id = ?";
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

    async getHanternoteRecord(hanternote_id) {
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "SELECT * FROM hanternote WHERE hanternote_id = ?";
            const [rows, fields] = await connection.execute(query, [hanternote_id]);
            const res = rows;
            logger.debug("res:" + res);
                
            await connection.end();
            logger.debug("closed db");
            return res;

        } catch(error) {
            logger.debug(error);
        }
    }

    async addHnaternote(trap_id, name, result, extension_unit_id, memo){
        try {
            logger.debug("call getTrapIndividual");
            const trap_handler = new th();
            const trap = await trap_handler.getTrapIndividual(trap_id);
            logger.debug("result:" + trap);
            
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "INSERT INTO hanternote (name, extension_unit_id, start, last, memo, result) VALUES (?, ?, ?, ?, ?, ?)";
            const [rows, fields] = await connection.execute(query, [name, extension_unit_id, trap[0]["start"], trap[0]["last"], memo, result]);
            const res = rows;
            logger.debug("res:" + res);
            logger.debug(JSON.stringify(res));

            const hanternote_id = res.insertId;
                
            await connection.end();
            logger.debug("closed db");

            // update install
            logger.debug("call setHanternoteId");
            const install_handler = new ih();
            const res_install = await install_handler.setHanternoteId(trap[0]["trap_id"], hanternote_id);
            logger.debug("result:" + res_install);

            return res;

        } catch(error) {
            logger.debug(error);
        }
    }


    async updateHanternoteIndividual(hanternote_id, extension_unit_id, name, memo, result) {
        try {
            const connection = await mysql.createConnection(this.db_setting);
            logger.debug("connected db");

            const query = "UPDATE hanternote SET name = ?, extension_unit_id = ?, memo = ?, result = ? WHERE hanternote_id = ?";
            const [rows, fields] = await connection.execute(query, [name, extension_unit_id, memo, result, hanternote_id]);
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

module.exports = hanternoteHandler;