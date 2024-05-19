import jwt from 'jsonwebtoken'

interface props {
    data: any
}

export const CreateToken = async ({ data }: props) => {
    try {
        let SecreteKey: any = process.env.KEY
        let token = jwt.sign(data, SecreteKey)
        console.log(token, "-----------------------");

        return token
    } catch (error) {
        console.log(error);

    }

}