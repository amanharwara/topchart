import { NextApiRequest, NextApiResponse } from "next";

export default async function imageLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { link } = req.body;
    const response = await fetch(link);

    res.status(200).send(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `${error}` });
  }
}
