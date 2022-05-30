import jwt from 'jsonwebtoken';
import config from '../settings/variables';
import logging from '../settings/logging';
import IUser from '../interfaces/eventType';


const NAMESPACE = 'Auth';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    logging.info(NAMESPACE, `Attempting to sign token for ${user._id}`);


    try {
        jwt.sign(
            {
                _id: user._id,
                name: user.name,
                role: user.role
            },
            process.env.SERVER_TOKEN_SECRET as string,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds,
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {

                    callback(null, token);
                }
            }
        );
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        callback(error, null);
    }
};

export default signJWT;