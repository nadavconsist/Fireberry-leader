import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const checkIP = async (IP: string): Promise<boolean | null> => {
    try {
        const IPLIST = [
            "207.232.22.134",   //Consist - משרד
            "62.0.58.114", 	    //Consist - משרד - גרניט2	
            "84.110.121.209",   //consist - שרת 1,4
            "13.80.249.9",      //Consist - Azure - linux
            "9.163.108.121",	//Consist - Azure - Dockers	
            "13.70.16.77",      //Glassix
            "13.72.99.16",      //Glassix
            "20.50.248.137",    //Glassix
            "20.53.168.19",     //Glassix
            "20.73.204.39",     //Glassix
            "20.195.97.9",      //Glassix
            "40.74.245.255",    //Glassix
            "40.83.150.252",    //Glassix
            "40.115.68.94",     //Glassix
            "52.155.91.26",     //Glassix
            "191.235.85.21",    //Glassix
            "20.67.80.139",	    //Glassix
            "13.94.226.30",	    //Glassix	06.03.2024
            "3.70.39.119",      //Glassix - Functions
            "3.76.97.199",      //Glassix - Functions
            "13.60.101.229",	//Glassix - Functions - Backup	
            "13.49.14.201",	    //Glassix - Functions - Backup	
            "84.110.35.96",     //wso2
            "84.110.131.190",   //wso2
            "84.110.35.97",	    //Consist - wso2 - Prod	
            "18.198.250.71",    //vonage
            "18.156.30.186",    //vonage
            "18.195.173.181",   //vonage
            "31.168.46.52",     // sysaid
            "66.249.64.13"      // sysaid
        ]

        //const isIPok = IPLIST.includes(IP)
        let checkvalsArray = IP.split(",");
        const isIPok = checkvalsArray.every(val => IPLIST.includes(val))
        if(!isIPok) logger.info(`checkIP:${isIPok} ${IP}`)
        return isIPok
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error("checkIP error: ", error.message);
            logger.error("Stack trace: ", error.stack);
        } else {
            logger.error("checkIP error: Unknown error", error);
        }
        return null;
    }
}

export const authenticateIP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract the 'x-forwarded-for' header safely and check if it's a valid string
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === 'string' || Array.isArray(forwardedFor)) {
        const ipCkeck = await checkIP(typeof forwardedFor === 'string' ? forwardedFor : forwardedFor[0]);
        if (!ipCkeck) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return; // stop further processing if unauthorized
        }
        next(); // Allow the request to proceed if IP is valid
    } else {
        res.status(400).json({ success: false, message: "Bad Request: x-forwarded-for header is missing or malformed" });
    }
};

