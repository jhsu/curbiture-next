import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    res.statusCode = 201;
    res.json({
      id: 1,
    });
  } else {
    res.statusCode = 404;
  }
}
