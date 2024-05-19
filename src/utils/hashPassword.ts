import argon2 from 'argon2';


export const CreateHash = async (password: string) => {

    let hash = await argon2.hash(password);
    return hash;
}


export const VerfiyHash = async (hash: string, password: string) => {
    let result = await argon2.verify(hash, password);

    return result;
}