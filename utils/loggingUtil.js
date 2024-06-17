
const logTypes = {
    INFO: 'INFO',
    ERROR: 'ERROR'
}

class LoggingUtil{

    constructor(){

    }

    writeInfo(functionName, message){
        this.writeLog(logTypes.INFO, functionName, message);
    }

    writeError(functionName, message, error){
        this.writeLog(logTypes.ERROR, functionName, message, error);
    }

    writeLog(type, functionName, message, error=null) {
        const logger = {
            app: 'DavidMarkSeidelServer',
            type: logTypes[type],
            functionName: functionName,
            message: message,
        }
        if(error){
            logger.error = error;
        }
        console.log(logger)
    }


}

const loggingUtil = new LoggingUtil();

module.exports = loggingUtil;