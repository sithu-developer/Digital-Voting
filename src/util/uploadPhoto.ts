import { PutBlobResult } from "@vercel/blob";
import { envValues } from "./envValues"

export const uploadPhoto = async (photoFile : File) => {
    try {
        const response = await fetch(`${envValues.apiUrl}/upload?filename=${photoFile.name}` , {
            method : "POST",
            body: photoFile,
        });
        const blob = (await response.json()) as PutBlobResult;
        return blob;
    } catch(err) {
        console.log(err)
    }

}