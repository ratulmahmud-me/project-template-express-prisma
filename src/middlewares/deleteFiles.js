import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export const deleteUploadedFiles = async (myFilePath) => {
    if (myFilePath) {
        if (Array.isArray(myFilePath)) {
            myFilePath.forEach(async filePath => {
                await unlinkAsync(filePath)
                    .then(() => {
                        console.log(myFilePath + ' has been deleted from store.')
                    })
                    .catch(err => {
                        if (err.code === 'ENOENT') {
                            console.log(err);
                        }
                        else {
                            console.log(err);
                        }
                    });
            });
        }
        else {
            await unlinkAsync(myFilePath)
                .then(() => {
                    console.log(myFilePath + ' has been deleted from store.')
                })
                .catch(err => {
                    if (err.code === 'ENOENT') {
                        console.log(err);
                    }
                    else {
                        console.log(err);
                    }
                });
        }
    }
    else {
        console.log("No files to delete!");
    }
}