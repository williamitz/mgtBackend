import { UploadedFile } from "express-fileupload";
import { IResPromise } from '../interfaces/resPromise.interface';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() {}

    saveImageTemp( file: UploadedFile, extensionFile: string, userId: string ): Promise<IResPromise> {
        return new Promise( (resolve, reject) => {
            let pathTemp = this.newPathUser( userId );
            let nameFile = this.generateUniqNameImg( extensionFile );
    
            file.mv( pathTemp + `/${nameFile}`, (err: any) => {
                if (err) {
                    return reject( { ok: false, error: err } );
                }
                resolve( { ok: true, message: 'Se movio a carpeta temporal' } );
            });
            // console.log('nombre img', nameFile);
        });
    }

    getPathImgUploaded( userId: string, img: string ): string {
        let pathImg = path.resolve( __dirname, '../uploads', userId, 'post', img );

        if ( !fs.existsSync( pathImg ) ) {
            return path.resolve( __dirname, '../assets/img/no-image.jpg' );
        }

        return pathImg;
    }

    private generateUniqNameImg( extensionFile: string ): string {
        return uniqid() + `.${ extensionFile }`;
    }

    private newPathUser( userId: string ): string {
        let pathUser = path.resolve( __dirname, '../uploads', userId );
        let pathTemp = pathUser + '/temp';

        if ( !fs.existsSync( pathUser ) ) {
            // crear carpetas
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathTemp );
        }
        // console.log(pathUser);

        return pathTemp;
    }

    moveImgTempInPost( userId: string ): string[] {

        let pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp' );
        let pathPost = path.resolve( __dirname, '../uploads', userId, 'post' );

        if ( !fs.existsSync( pathTemp ) ) {
            return [];
        }

        if ( !fs.existsSync( pathPost ) ) {
            fs.mkdirSync( pathPost );
        }

        let filesTemp = this.getImgTemp( pathTemp );

        filesTemp.forEach( srcFile => {

            fs.renameSync( `${ pathTemp }/${ srcFile }`, `${ pathPost }/${ srcFile }` );

        });

        return filesTemp;

    }

    private getImgTemp( pathTemp: string ): string[] {
        return fs.readdirSync( pathTemp ) || [];
    }

}
